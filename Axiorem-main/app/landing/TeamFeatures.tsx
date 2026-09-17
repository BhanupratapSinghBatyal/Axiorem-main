"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

type TeamFeature = {
  id: string
  title: string
  description: string
  image: string
  direction: "top" | "bottom"
}

const TEAM_FEATURES: readonly TeamFeature[] = [
  {
    id: "version-history",
    title: "Every Version Has a History",
    description:
      "Track published versions and changes over time, so your team always has a clear record of how a project evolved.",
    image: "/landing/team_1.png",
    direction: "top",
  },
  {
    id: "organization-sharing",
    title: "Share Work Across Your Organization",
    description:
      "Move personal projects into your organization's shared workspace when they're ready for the rest of the team.",
    image: "/landing/team_2.png",
    direction: "bottom",
  },
  {
    id: "personal-library",
    title: "Bring Shared Work Into Your Own Library",
    description:
      "Copy organizational projects into your personal library to adapt, refine, and build on shared work independently.",
    image: "/landing/team_3.png",
    direction: "top",
  },
]

function TeamFeatureCard({
  feature,
}: {
  feature: TeamFeature
}) {
  const shouldReduceMotion = useReducedMotion()
  const isFromTop = feature.direction === "top"

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: isFromTop ? -180 : 180,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        group
        relative
        min-w-0
        overflow-hidden
        border
        border-white/[0.08]
        bg-[#181818]
      "
    >
      <div className="relative aspect-[0.56] w-full overflow-hidden">
        <Image
          src={feature.image}
          alt={feature.title}
          fill
          className="
            object-cover
            object-top
            motion-safe:transition-transform
            motion-safe:duration-700
            motion-safe:ease-out
            md:group-hover:scale-[1.02]
          "
          sizes="
            (max-width: 767px) calc(100vw - 3rem),
            (max-width: 1279px) calc(33.333vw - 2rem),
            400px
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-[#111111]
            via-[#111111]/30
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            p-5
            sm:p-6
            md:p-5
            lg:p-7
          "
        >
          <div className="mb-4 h-px w-10 bg-[#6f8fba]" />

          <h3
            className="
              font-serif
              text-xl
              font-medium
              leading-tight
              tracking-tight
              text-[#e1edff]
              md:text-[clamp(1.1rem,1.6vw,1.75rem)]
            "
          >
            {feature.title}
          </h3>

          <p
            className="
              mt-3
              font-['Figtree']
              text-xs
              leading-relaxed
              text-[#a3b8cc]
              md:text-sm
            "
          >
            {feature.description}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

export const TeamFeatures = () => {
  return (
    <section id="teams"
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#212121]
        py-20
        text-[#e1edff]
        md:py-32
      "
    >
      {/* BACKGROUND */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >
        <Image
          src="/landing/team_features_bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* HEADER */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <div className="text-left">
          <h2
            className="
              max-w-4xl
              font-serif
              text-[clamp(2rem,5vw,4.5rem)]
              font-medium
              leading-[1.05]
              tracking-tight
              text-[#e1edff]
            "
          >
            Built for Work That Moves Beyond One Person.
          </h2>

          <p
            className="
              mt-5
              max-w-3xl
              font-['Figtree']
              text-sm
              leading-relaxed
              text-[#a3b8cc]
              sm:text-base
              md:text-xl
            "
          >
            Track how projects evolve, share work across your organization,
            and move content between personal and shared libraries without
            losing control of where it belongs.
          </p>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div
        className="
          relative
          z-10
          mx-auto
          mt-14
          grid
          w-full
          max-w-7xl
          grid-cols-1
          gap-4
          px-6
          md:mt-20
          md:grid-cols-3
          md:gap-5
          md:px-8
        "
      >
        {TEAM_FEATURES.map((feature) => (
          <TeamFeatureCard
            key={feature.id}
            feature={feature}
          />
        ))}
      </div>
    </section>
  )
}

export default TeamFeatures