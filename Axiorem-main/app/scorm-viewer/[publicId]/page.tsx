"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  useScormViewer,
} from "@/hooks/useScormViewer";

import { Navbar } from "@/app/landing/Navbar";
import { Footer } from "@/app/landing/Footer";

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8080";

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

// -----------------------------------------------------------------------------
// URL helpers
// -----------------------------------------------------------------------------

const normalizeBaseUrl = (
  value: any
): string => {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .trim()
    .replace(
      /\/+$/,
      ""
    );
};

const normalizePlayerPath = (
  value: any
): string | null => {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  if (
    trimmed.length ===
    0
  ) {
    return null;
  }

  return (
    trimmed
      .replace(
        /\/player\/?$/,
        ""
      ) ||
    "/"
  );
};

const buildPlayerUrl = (
  playerPath: any
): string | null => {
  const normalizedPath =
    normalizePlayerPath(
      playerPath
    );

  if (
    !normalizedPath
  ) {
    return null;
  }

  if (
    normalizedPath.startsWith(
      "http://"
    ) ||
    normalizedPath.startsWith(
      "https://"
    )
  ) {
    return normalizedPath;
  }

  const baseUrl =
    normalizeBaseUrl(
      BACKEND_URL
    );

  const normalizedPathWithSlash =
    normalizedPath.startsWith(
      "/"
    )
      ? normalizedPath
      : `/${normalizedPath}`;

  return `${baseUrl}${normalizedPathWithSlash}`;
};

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function PublicScormViewerPage() {
  const params =
    useParams();

  const publicId: string =
    (
      Array.isArray(
        params?.publicId
      )
        ? params.publicId[0]
        : params?.publicId
    ) as string;

  const {
    getPlayer,
    error,
  }: any =
    useScormViewer() as any;

  const [
    playerData,
    setPlayerData,
  ] = useState<any>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState<boolean>(
    true
  );

  const [
    loadError,
    setLoadError,
  ] = useState<any>(
    null
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);

  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (playerContainerRef.current) {
        const width = playerContainerRef.current.clientWidth;
        const height = playerContainerRef.current.clientHeight;

        if (width > 0 && height > 0) {
          const scaleX = width / BASE_WIDTH;
          const scaleY = height / BASE_HEIGHT;
          setScale(Math.min(scaleX, scaleY));
        }
      }
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (playerContainerRef.current) {
      resizeObserver.observe(playerContainerRef.current);
    }

    window.addEventListener("resize", updateScale);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async (): Promise<void> => {
    if (!playerContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        if (playerContainerRef.current.requestFullscreen) {
          await playerContainerRef.current.requestFullscreen();
        } else if ((playerContainerRef.current as any).webkitRequestFullscreen) {
          await (playerContainerRef.current as any).webkitRequestFullscreen();
        } else if ((playerContainerRef.current as any).msRequestFullscreen) {
          await (playerContainerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch {
      /* Fullscreen permission error fallback */
    }
  };

  const handleCopyLink = async (): Promise<void> => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard write fallback */
    }
  };

  // ---------------------------------------------------------------------------
  // Load public course
  // ---------------------------------------------------------------------------

  useEffect(
    () => {
      if (
        typeof publicId !==
          "string" ||
        publicId.trim().length ===
          0
      ) {
        setLoading(
          false
        );

        setLoadError(
          new Error(
            "Public course identifier is missing."
          )
        );

        return;
      }

      let cancelled =
        false;

      const loadCourse =
        async (): Promise<void> => {
          setLoading(
            true
          );

          setLoadError(
            null
          );

          try {
            const result: any =
              await getPlayer(
                publicId
              );

            if (
              cancelled
            ) {
              return;
            }

            const normalizedResult =
              result?.data ??
              result;

            setPlayerData(
              normalizedResult
            );

          } catch (
            requestError: any
          ) {
            if (
              cancelled
            ) {
              return;
            }

            setLoadError(
              requestError
            );

          } finally {
            if (
              !cancelled
            ) {
              setLoading(
                false
              );
            }
          }
        };

      loadCourse();

      return () => {
        cancelled =
          true;
      };
    },
    [
      publicId,
      getPlayer,
    ]
  );

  // ---------------------------------------------------------------------------
  // Player URL
  // ---------------------------------------------------------------------------

  const playerPath: any =
    playerData?.playerPath ??
    playerData?.playerUrl ??
    playerData?.launchUrl ??
    playerData?.publicUrl ??
    null;

  const playerUrl =
    useMemo(
      () =>
        buildPlayerUrl(
          playerPath
        ),
      [
        playerPath,
      ]
    );

  // ---------------------------------------------------------------------------
  // Course metadata
  // ---------------------------------------------------------------------------

  const courseTitle: string =
    playerData?.title ??
    playerData?.package?.title ??
    "SCORM Course";

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  const displayedError: any =
    loadError ??
    error ??
    null;

  // ---------------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------------

  return (
    <div className="bg-[#212121] text-white flex flex-col justify-between antialiased">
      <Navbar />

      <main className="h-[100vh] px-8 lg:px-20 py-12 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center flex-1 my-auto">
          
          {/* Left Column: View Window (60% Width) */}
          <div className="lg:col-span-3 flex flex-col h-full w-full justify-center">
            <div className="mb-3 flex items-center justify-between gap-4">
              
            </div>

            {/* Player Container: 16:9 Aspect Ratio */}
            <div 
              ref={playerContainerRef}
              className="relative w-full aspect-[16/9] overflow-hidden rounded-xl border border-slate-700/60 bg-[#1a1a1a] shadow-sm flex items-center justify-center"
            >
              {/* Fullscreen Button */}
              {!loading && !displayedError && playerUrl && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  className="absolute top-3 right-3 z-20 flex items-center justify-center p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-slate-700/50 transition-colors cursor-pointer"
                >
                  {isFullscreen ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 4l5 5m0 0l-5 0m5 0l0-5m-5-11l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* Loading */}
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1a1a1a]">
                  <div className="text-sm text-slate-400">
                    Loading course...
                  </div>
                </div>
              )}

              {/* Error */}
              {!loading && displayedError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center px-6 bg-[#1a1a1a]">
                  <div className="max-w-md text-center">
                    <div className="text-sm font-medium text-red-400">
                      Unable to load this SCORM course.
                    </div>

                    <div className="mt-2 text-sm text-slate-400">
                      {displayedError?.message ??
                        "The course could not be loaded."}
                    </div>
                  </div>
                </div>
              )}

              {/* SCORM player scaled viewport */}
              {!loading && !displayedError && playerUrl && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div
                    style={{
                      width: `${BASE_WIDTH}px`,
                      height: `${BASE_HEIGHT}px`,
                      transform: `scale(${scale})`,
                      transformOrigin: "center center",
                      flexShrink: 0,
                    }}
                  >
                    <iframe
                      src={playerUrl}
                      title={courseTitle}
                      className="block h-full w-full border-0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Missing player */}
              {!loading && !displayedError && !playerUrl && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1a1a1a]">
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-200">
                      Player unavailable
                    </div>

                    <div className="mt-1 text-sm text-slate-400">
                      This SCORM course does not currently have a playable entry point.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Share Info (40% Width) */}
          <div className="lg:col-span-2 flex flex-col items-start justify-center w-full space-y-6">
            <div className="space-y-4">
              <h2 
                className="text-4xl sm:text-5xl text-white font-normal leading-tight tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Share the link below to view this SCORM course.
              </h2>
              <p className="text-sm text-slate-400 font-figtree tracking-wide uppercase">
                Instant SCORM Runtime Preview Link
              </p>
            </div>

            <div className="w-full max-w-md space-y-3">
              {currentUrl && (
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 bg-[#2A2A2A] px-4 py-3 border border-slate-700/60">
                  <span className="truncate max-w-[280px]">{currentUrl}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full bg-white text-black rounded-none text-xs font-bold tracking-widest uppercase py-5 px-8 transition-colors hover:bg-slate-200 cursor-pointer"
              >
                {copied ? "Link Copied!" : "Copy Share Link"}
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}