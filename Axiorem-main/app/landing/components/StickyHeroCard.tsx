"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

export const StickyHeroCard = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  })

  // Retain hardware-accelerated transforms
  const backgroundX = useTransform(
    scrollYProgress,
    [0, 0.35],
    shouldReduceMotion ? ["0%", "0%"] : ["-100%", "0%"]
  )

  // Clamp opacity bounds to prevent frame-reversal in optimized production builds
  const initialTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.42, 1],
    [1, 1, 0, 0]
  )
  
  const replacementTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [0, 0, 1, 1]
  )

  // Explicitly hide elements when dormant to prevent layout layering glitches
  const initialVisibility = useTransform(
    initialTextOpacity,
    (v) => (v === 0 ? "hidden" : "visible")
  )
  const replacementVisibility = useTransform(
    replacementTextOpacity,
    (v) => (v === 0 ? "hidden" : "visible")
  )

  const handlePrimaryAction = () => {
    window.open("/dashboard", "_blank")
  }

  return (
    <div ref={trackRef} className="relative w-full min-h-[150vh] md:min-h-[360vh]">
      {/* 
        INITIAL RUNWAY
        Calculated as (Hero Height [100vh] - Card Height - Navbar Height [80px])
        to force the card's top edge to start aligned with the hero's bottom boundary.
      */}
      <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-320px)]" />

      <div className="sticky top-[80px] z-30 w-full px-0 md:w-[70vw] lg:w-[65vw] xl:w-[60vw] 2xl:w-[55vw]">
        <div className="relative isolate overflow-hidden p-[clamp(1rem,2.5vw,2.5rem)]">
          <motion.div
            style={{
              x: backgroundX,
              backgroundImage: "url('/backgrounds/hero_text_bg.png')",
            }}
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center [will-change:transform] [transform:translateZ(0)]"
          />

          <div className="relative z-10 grid min-h-[160px] w-full max-w-4xl items-center sm:min-h-[180px]">
            {/* First Text Section */}
            <motion.div
              style={{
                opacity: initialTextOpacity,
                visibility: initialVisibility,
              }}
              className="col-start-1 row-start-1 flex w-full flex-col items-start gap-6 [will-change:opacity]"
            >
              <h1 className="font-serif text-[clamp(2.25rem,5vw,5rem)] font-medium leading-tight tracking-tight text-[#e1edff]">
                From Compliance Documents to Training.{" "}
                <span className="text-[#bf953f] md:shimmer-gold font-semibold">
                  In Minutes.
                </span>
              </h1>

              <button
                onClick={handlePrimaryAction}
                className="bg-white px-6 py-3.5 text-base font-medium text-black transition-colors duration-200 hover:bg-slate-100 md:hidden"
              >
                Sign up for Free
              </button>
            </motion.div>

            {/* Replacement Text Section */}
            <motion.div
              style={{
                opacity: replacementTextOpacity,
                visibility: replacementVisibility,
              }}
              className="col-start-1 row-start-1 flex w-full flex-col items-start justify-center [will-change:opacity]"
            >
              <h1 className="font-serif text-[clamp(2.25rem,5vw,5rem)] font-medium leading-tight tracking-tight text-[#e1edff]">
                Your company already wrote the{" "}
                <span className="font-semibold">training modules.</span>
              </h1>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}