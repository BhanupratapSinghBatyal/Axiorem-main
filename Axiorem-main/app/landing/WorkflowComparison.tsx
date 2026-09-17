"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

type WorkflowStep = {
  number: string
  title: string
  description: string
  direction: "left" | "right"
  background: string
}

const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    number: "01",
    title: "Start with your document",
    description:
      "Upload the manual, policy, procedure, or technical documentation you already have.",
    direction: "left",
    background: "/landing/step_1_bg.png",
  },
  {
    number: "02",
    title: "Turn it into what you need",
    description:
      "Generate courses, assessments, knowledge checks, SOPs, and other structured training content from the same source.",
    direction: "right",
    background: "/landing/step_2_bg.png",
  },
  {
    number: "03",
    title: "Review. Approve. Deploy.",
    description:
      "Refine the output, make changes where needed, and prepare it for delivery.",
    direction: "left",
    background: "/landing/step_3_bg.png",
  },
]

function WorkflowStepItem({
  step,
  index,
}: {
  step: WorkflowStep
  index: number
}) {
  const shouldReduceMotion = useReducedMotion()
  const isRight = step.direction === "right"

  return (
    <div
      className="
        relative
        isolate
        h-[30vh]
        min-h-[220px]
        w-full
        overflow-hidden
        border-b
        border-white/5
        bg-[#212121]
        md:h-[35vh]
        md:min-h-[260px]
      "
    >
      {/* BACKGROUND IMAGE */}
      <Image
        src={step.background}
        alt=""
        fill
        priority={index === 0}
        sizes="100vw"
        quality={85}
        className="
          pointer-events-none
          -z-10
          object-cover
          object-center
        "
      />

      {/* DIRECTIONAL OVERLAY */}
      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-0
          ${
            isRight
              ? "bg-gradient-to-l from-[#212121]/95 via-[#212121]/80 to-[#212121]/30"
              : "bg-gradient-to-r from-[#212121]/95 via-[#212121]/80 to-[#212121]/30"
          }
        `}
      />

      {/* CONTENT */}
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                x: isRight ? 120 : -120,
              }
        }
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{
          once: true,
          amount: 0.4,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          relative
          z-10
          mx-auto
          flex
          h-full
          w-full
          max-w-7xl
          items-center
          px-6
          transform-gpu
          will-change-[transform,opacity]
          md:px-12
          ${isRight ? "justify-end" : "justify-start"}
        `}
      >
        <div
          className={`
            w-full
            max-w-2xl
            ${isRight ? "md:text-right" : "md:text-left"}
          `}
        >
          <h3
            className="
              font-serif
              text-[clamp(1.25rem,2.5vw,2.5rem)]
              font-medium
              leading-tight
              tracking-tight
              text-[#e1edff]
              drop-shadow-md
            "
          >
            {step.title}
          </h3>

          <p
            className={`
              mt-2
              max-w-xl
              font-['Figtree']
              text-md
              leading-relaxed
              text-white
              md:text-lg
              ${isRight ? "ml-auto" : "mr-auto"}
            `}
          >
            {step.description}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export const WorkflowComparison = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#212121] text-[#e1edff]">
      {/* SECTION HEADER */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="
              font-serif
              text-[clamp(2rem,5vw,4.5rem)]
              font-medium
              leading-[1.05]
              tracking-tight
              text-[#e1edff]
            "
          >
            The Hardest Part of Training Happens Before the LMS.
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              font-['Figtree']
              text-sm
              leading-relaxed
              text-[#a3b8cc]
              sm:text-base
              md:text-xl
            "
          >
            Axiorem eliminates the manual work between your source
            documentation and deployable training.
          </p>
        </div>
      </div>

      {/* WORKFLOW STEPS */}
      <div className="relative w-full">
        {WORKFLOW_STEPS.map((step, index) => (
          <WorkflowStepItem
            key={step.number}
            step={step}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

export default WorkflowComparison