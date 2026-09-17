"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useScormViewer } from "@/hooks/useScormViewer"
import { Navbar } from "@/app/landing/Navbar"
import { Footer } from "@/app/landing/Footer"

export default function ScormViewerPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    uploading,
    uploadProgress,
    error,
    uploadPackage,
  }: any = useScormViewer() as any

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSelectFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleButtonClick = (): void => {
    if (!selectedFile) {
      fileInputRef.current?.click()
    } else {
      handleUpload()
    }
  }

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile || uploading) return

    try {
      const uploadResult: any = await uploadPackage(selectedFile)

      const publicId =
        uploadResult?.publicId ??
        uploadResult?.package?.publicId ??
        uploadResult?.data?.publicId ??
        uploadResult?.data?.package?.publicId ??
        null

      if (
        typeof publicId !== "string" ||
        publicId.trim().length === 0
      ) {
        throw new Error(
          "SCORM package uploaded successfully, but no course identifier was returned."
        )
      }

      router.push(
        `/scorm-viewer/${encodeURIComponent(publicId.trim())}`
      )
    } catch {
      /* Hook manages error state */
    }
  }

  return (
    <div className="bg-[#212121] text-white flex min-h-screen flex-col justify-between antialiased">
      <Navbar />

      <main
        className="flex min-h-screen items-center bg-[url('/landing/pp_bg.png')] bg-cover bg-center bg-no-repeat px-8 py-28 lg:px-20"
        aria-labelledby="scorm-viewer-heading"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* SEO / Introduction */}
          <section className="space-y-5 text-left">
            <h1
              id="scorm-viewer-heading"
              className="text-4xl font-normal leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Online SCORM Viewer
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
              View and test SCORM 1.2 courses online without installing
              an LMS. Upload a SCORM package to preview your course and
              share a browser-based viewing link.
            </p>

            <p className="pt-2 text-sm font-figtree uppercase tracking-wide text-slate-400">
              SCORM 1.2 Course Viewer &amp; Package Preview
            </p>

            <div className="max-w-2xl pt-2 text-sm leading-relaxed text-slate-400">
              <p>
                Axiorem&apos;s online SCORM viewer lets you open SCORM
                course packages directly in your browser. Upload a
                SCORM ZIP package to extract and preview its learning
                content before deploying it to your LMS.
              </p>
            </div>
          </section>

          {/* Viewer Upload */}
          <section
            className="flex w-full flex-col items-start justify-center lg:items-end"
            aria-label="SCORM package upload"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,application/zip"
              onChange={handleSelectFile}
              className="hidden"
              aria-label="Select a SCORM ZIP package"
            />

            <div className="w-full max-w-md space-y-4">

              {selectedFile && (
                <div className="flex items-center justify-between border border-slate-700/60 bg-[#2A2A2A] px-4 py-3 text-xs font-mono text-slate-300">
                  <span className="max-w-[240px] truncate">
                    {selectedFile.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null)

                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                    className="ml-2 text-[10px] uppercase tracking-wider text-slate-400 underline hover:text-white"
                  >
                    Change
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleButtonClick}
                disabled={uploading}
                className="w-full cursor-pointer rounded-none bg-white px-8 py-5 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? `Processing ${uploadProgress ?? 0}%`
                  : selectedFile
                  ? "Upload & View SCORM Course"
                  : "Select SCORM ZIP"}
              </button>

              {uploading && (
                <div
                  className="relative h-1 w-full overflow-hidden bg-[#3A3A3A]"
                  aria-label={`Processing ${uploadProgress ?? 0}%`}
                >
                  <div
                    className="h-full bg-white transition-all duration-200"
                    style={{
                      width: `${uploadProgress ?? 0}%`,
                    }}
                  />
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="pt-2 text-xs font-mono text-red-400"
                >
                  {error?.message ??
                    "Failed to process SCORM archive."}
                </p>
              )}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}