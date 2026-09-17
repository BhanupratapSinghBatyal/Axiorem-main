"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { useMemo } from "react"

const BUILDERS = [
  "/landing/visual_builder_1.png",
  "/landing/visual_builder_2.png",
  "/landing/visual_builder_3.png",
  "/landing/visual_builder_4.png",
  "/landing/visual_builder_5.png",
  "/landing/visual_builder_6.png",
  "/landing/visual_builder_7.png",
  "/landing/visual_builder_8.png",
  "/landing/visual_builder_9.png",
] as const

function shuffleArray<T>(array: readonly T[]): T[] {
  const shuffled = [...array]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ]
  }

  return shuffled
}

export const VisualBuilderPreview = () => {
  const shouldReduceMotion = useReducedMotion()

  /*
   * Create one randomized sequence and duplicate that exact sequence.
   *
   * This guarantees that when the animation reaches -50%,
   * the second copy is visually identical to the first.
   */
  const items = useMemo(() => {
    const shuffled = shuffleArray(BUILDERS)

    return [...shuffled, ...shuffled]
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#212121] py-24 md:py-36">
      {/* SECTION CONTENT */}
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="ml-auto max-w-4xl text-right">
          <h2
            className="
              font-serif
              text-[clamp(2.5rem,5vw,5rem)]
              font-medium
              leading-[1.05]
              tracking-tight
              text-[#e1edff]
            "
          >
            Build It Your Way.
          </h2>

          <p
            className="
              ml-auto
              mt-6
              max-w-3xl
              font-['Figtree']
              text-base
              leading-relaxed
              text-[#a3b8cc]
              md:text-xl
            "
          >
            Choose from configurable visual builders for presentations,
            documentation, assessments, knowledge checks, and more. Build the
            exact compliance course, policy, assessment, or corporate content
            your project requires.
          </p>
        </div>
      </div>

      {/* CONTINUOUS CAROUSEL */}
      <div className="relative mt-12 w-full overflow-hidden py-4">
        {/* FADE MASKS */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-10
            w-20
            bg-gradient-to-r
            from-[#212121]
            to-transparent
            md:w-40
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-10
            w-20
            bg-gradient-to-l
            from-[#212121]
            to-transparent
            md:w-40
          "
        />

        <div className="flex w-max">
          <motion.div
            className="flex gap-6 pr-6 will-change-transform"
            initial={{ x: "0%" }}
            animate={
              shouldReduceMotion
                ? { x: "0%" }
                : { x: "-50%" }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 30,
                    ease: "linear",
                    repeat: Infinity,
                  }
            }
          >
            {items.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="
                  relative
                  aspect-[16/10]
                  w-[280px]
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  border
                  border-white/10
                  bg-[#171717]
                  shadow-xl
                  sm:w-[360px]
                  md:w-[460px]
                "
              >
                <Image
                  src={image}
                  alt="Axiorem visual builder"
                  fill
                  priority={index === 0}
                  sizes="
                    (max-width: 639px) 280px,
                    (max-width: 767px) 360px,
                    460px
                  "
                  className="object-cover object-top"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default VisualBuilderPreview