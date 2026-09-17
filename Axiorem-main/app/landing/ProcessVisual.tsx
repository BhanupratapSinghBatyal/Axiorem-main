"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

import { PdfAnim } from "./components/PdfAnim"
import { PptxAnim } from "./components/PptxAnim"
import { DocxAnim } from "./components/DocxAnim"
import { LogoContrastAnim } from "./components/LogoContrastAnim"
import { ExportAnim } from "./components/ExportAnim"

type VisualPhase = "documents" | "ingesting" | "processing" | "output"
type Timer = ReturnType<typeof window.setTimeout>

const INGEST_DURATION = 1250
const EXPORT_COMPLETE_DELAY = 2400
const AUTO_PLAY_INTERVAL = 4000

const EASE = [0.16, 1, 0.3, 1] as const
const EXPORT_EASE = [0.22, 1, 0.36, 1] as const

const steps = [
  { description: "Upload your Safety and Compliance manuals, Corporate Handbooks or Policy Update documents" },
  { description: "Automate ingestion, structural extraction, and semantic analysis across formats" },
  { description: "Generate compliant operational insights directly into target workflows" },
]

const documentAnimations = [
  { Component: PdfAnim, delay: 0.12, x: "calc(150% - 50%)", rotate: [0, -1, 2, 0], scale: [1.2, 0.95, 0.55, 0.08] },
  { Component: PptxAnim, delay: 0.22, x: 0, rotate: [0, 2, -2, 0], scale: [1.2, 0.95, 0.5, 0.08] },
  { Component: DocxAnim, delay: 0.32, x: "calc(-150% + 50%)", rotate: [0, -2, 2, 0], scale: [1.2, 0.95, 0.5, 0.08] },
] as const

const DocumentGrid = ({ isIngesting }: { isIngesting: boolean }) => {
  return (
    <div  className="absolute inset-0 z-30 flex items-center justify-between px-2 sm:px-8 md:px-24">
      {documentAnimations.map(({ Component, delay, x, rotate, scale }, index) => (
        <motion.div
          key={index}
          initial={false}
          animate={
            isIngesting
              ? { x, y: 0, scale, opacity: [1, 1, 0.95, 0], rotate }
              : { x: 0, y: 0, scale: 1.2, opacity: 1, rotate: 0 }
          }
          transition={{
            duration: 0.78,
            delay: isIngesting ? delay : 0,
            times: isIngesting ? [0, 0.5, 0.82, 1] : undefined,
            ease: EASE,
          }}
          className="flex h-16 w-16 items-center justify-center transform-gpu will-change-transform sm:h-32 sm:w-32 md:h-64 md:w-64"
        >
          <Component />
        </motion.div>
      ))}
    </div>
  )
}

export const ProcessVisual = () => {
  const containerRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const [currentStep, setCurrentStep] = useState(0)
  const [phase, setPhase] = useState<VisualPhase>("documents")
  const [showScormPackage, setShowScormPackage] = useState(false)

  const ingestTimerRef = useRef<Timer | null>(null)
  const exportTimerRef = useRef<Timer | null>(null)
  const autoPlayTimerRef = useRef<Timer | null>(null)

  const isIngesting = phase === "ingesting"

  // 1. Intersection Observer logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const clearIngestTimer = useCallback(() => {
    if (ingestTimerRef.current !== null) {
      window.clearTimeout(ingestTimerRef.current)
      ingestTimerRef.current = null
    }
  }, [])

  const clearExportTimer = useCallback(() => {
    if (exportTimerRef.current !== null) {
      window.clearTimeout(exportTimerRef.current)
      exportTimerRef.current = null
    }
  }, [])

  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current !== null) {
      window.clearTimeout(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
  }, [])

  const clearAllTimers = useCallback(() => {
    clearIngestTimer()
    clearExportTimer()
    clearAutoPlayTimer()
  }, [clearIngestTimer, clearExportTimer, clearAutoPlayTimer])

  useEffect(() => {
    return clearAllTimers
  }, [clearAllTimers])

  const startOutputSequence = useCallback(() => {
    clearExportTimer()
    setShowScormPackage(false)

    exportTimerRef.current = window.setTimeout(() => {
      exportTimerRef.current = null
      setShowScormPackage(true)
    }, EXPORT_COMPLETE_DELAY)
  }, [clearExportTimer])

  const startIngestion = useCallback(() => {
    if (ingestTimerRef.current !== null) return
    setPhase("ingesting")

    ingestTimerRef.current = window.setTimeout(() => {
      ingestTimerRef.current = null
      setCurrentStep(1)
      setPhase("processing")
    }, INGEST_DURATION)
  }, [])

  const advanceStep = useCallback(() => {
    if (phase === "ingesting") return

    if (currentStep === 0) {
      startIngestion()
      return
    }

    if (currentStep === 1) {
      setCurrentStep(2)
      setPhase("output")
      startOutputSequence()
      return
    }

    clearExportTimer()
    setShowScormPackage(false)
    setCurrentStep(0)
    setPhase("documents")
  }, [currentStep, phase, startIngestion, startOutputSequence, clearExportTimer])

  const handleNext = useCallback(() => {
    if (isIngesting) return
    clearAutoPlayTimer()
    advanceStep()
  }, [isIngesting, clearAutoPlayTimer, advanceStep])

  // 2. Pause auto-play loop if off-screen
  useEffect(() => {
    if (!isVisible || phase === "ingesting") {
      clearAutoPlayTimer()
      return
    }

    clearAutoPlayTimer()

    autoPlayTimerRef.current = window.setTimeout(() => {
      autoPlayTimerRef.current = null
      advanceStep()
    }, AUTO_PLAY_INTERVAL)

    return clearAutoPlayTimer
  }, [isVisible, currentStep, phase, advanceStep, clearAutoPlayTimer])

  const showProcessingStage = currentStep === 0 || currentStep === 1 || phase === "ingesting"

  const logoState = phase === "ingesting" ? "ingesting" : phase === "processing" ? "processed" : "idle"

  return (
    <section id="process"
      ref={containerRef}
      className="relative flex h-[70vh] min-h-[70vh] w-full flex-col items-center justify-between overflow-hidden bg-[#212121] px-4 py-4 md:h-screen md:min-h-screen md:px-8 md:py-16"
    >
      {/* Header */}
      <div className="z-10 flex w-full flex-col items-center gap-2 text-center md:gap-4">
        <h2 className="font-serif text-[clamp(1.625rem,4vw,3.25rem)] font-medium leading-tight tracking-tight text-[#e1edff] drop-shadow-md">
          Now Here's where Axiorem Operates
        </h2>

        <div className="z-20 min-h-[3.5rem] w-full md:my-[3%] md:min-h-[5rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="font-['Figtree'] text-[0.975rem] leading-snug text-[#a3b8cc] drop-shadow-sm sm:text-base md:text-xl md:leading-relaxed"
            >
              {steps[currentStep].description}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Visual Arena - Lazy rendered based on intersection status */}
      <div className="relative z-10 flex h-[36vh] w-full max-w-[1200px] items-center justify-center md:h-[60vh]">
        {isVisible && (
          <AnimatePresence mode="wait">
            {showProcessingStage && currentStep !== 2 && (
              <motion.div
                key="processing-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative flex h-full w-full items-center justify-center"
              >
                <motion.div
                  initial={false}
                  animate={
                    phase === "documents"
                      ? { opacity: 0, scale: 0.72 }
                      : phase === "ingesting"
                        ? { opacity: 1, scale: [0.78, 1.06, 1] }
                        : { opacity: 1, scale: 1 }
                  }
                  transition={{
                    duration: phase === "ingesting" ? 0.75 : 0.4,
                    times: phase === "ingesting" ? [0, 0.72, 1] : undefined,
                    ease: EASE,
                  }}
                  className="absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center transform-gpu will-change-transform sm:h-48 sm:w-48 md:h-96 md:w-96"
                >
                  <LogoContrastAnim state={logoState} />
                </motion.div>

                {phase !== "processing" && <DocumentGrid isIngesting={phase === "ingesting"} />}
              </motion.div>
            )}

            {currentStep === 2 && phase === "output" && (
              <motion.div
                key="output-stage"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="relative flex h-full w-full max-w-[700px] items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {!showScormPackage ? (
                    <motion.div
                      key="export-animation"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: EXPORT_EASE }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <ExportAnim />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="scorm-package"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="relative h-[120px] w-[120px] sm:h-[200px] sm:w-[200px] md:h-[320px] md:w-[320px]">
                        <Image
                          src="/landing/scorm_zip.png"
                          alt="Generated SCORM package"
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 120px, (max-width: 768px) 200px, 320px"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Controls */}
        <button
          type="button"
          aria-label="Next slide"
          onClick={handleNext}
          disabled={isIngesting}
          className="absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-full p-1 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 active:scale-95 md:right-4 md:p-2"
        >
          <svg className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default ProcessVisual