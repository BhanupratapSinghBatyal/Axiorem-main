"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

type ScreenContent = {
  id: string
  heading: string
  description: string
  imageSrc: string
}

const appScreens: ScreenContent[] = [
  {
    id: "workspace",
    heading: "Your Work, In One Workspace",
    description:
      "Keep your projects, templates, resources, and organizational activity organized from a single starting point.",
    imageSrc: "/landing/app_preview_1.png",
  },
  {
    id: "project-library",
    heading: "Every Project, Within Reach",
    description:
      "Manage active projects, access shared resources, and keep your organization's documentation organized in one central library.",
    imageSrc: "/landing/app_preview_2.png",
  },
  {
    id: "ai-assistant",
    heading: "Tell Axiorem What You Need",
    description:
      "Choose a starting point, add your source document, and generate assessments, SOPs, training content, and more with AI.",
    imageSrc: "/landing/app_preview_3.png",
  },
  {
    id: "team-workspace",
    heading: "Built for the Whole Team",
    description:
      "Manage members, projects, and shared resources from a workspace designed to keep everyone working from the same source of truth.",
    imageSrc: "/landing/app_preview_4.png",
  },
  {
    id: "content-editor",
    heading: "Shape the Final Outcome",
    description:
      "Edit, structure, and refine generated content in a visual workspace before publishing or exporting it for delivery.",
    imageSrc: "/landing/app_preview_5.png",
  },
]

function ScreenStep({
  screen,
  index,
}: {
  screen: ScreenContent
  index: number
}) {
  const stepRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start start", "end end"],
  })

  // Phase 1: Heading Entrance
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.15],
    [0, 1]
  )

  const headingY = useTransform(
    scrollYProgress,
    [0, 0.15],
    [20, 0]
  )

  // Phase 2: Image Entrance
  const imageOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35],
    [0, 1]
  )

  const imageY = useTransform(
    scrollYProgress,
    [0.15, 0.35],
    [30, 0]
  )

  // Phase 3: Image Pan
  const imagePan = useTransform(
    scrollYProgress,
    [0.35, 0.65],
    ["0%", "-37.5%"]
  )

  // Phase 4: Description Entrance
  const descriptionOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.75],
    [0, 1]
  )

  const descriptionY = useTransform(
    scrollYProgress,
    [0.55, 0.75],
    [16, 0]
  )

  return (
    <div ref={stepRef} className="relative h-[250vh] w-full">
      <div className="sticky top-[80px] h-[calc(100svh-80px)] w-full overflow-hidden bg-[#212121]">
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* Content Pane */}
          <div className="relative z-10 flex w-full shrink-0 flex-col justify-start px-6 pt-10 md:w-1/2 md:justify-center md:px-8 md:pr-12 md:pt-0">
            <motion.h3
              style={{
                opacity: headingOpacity,
                y: headingY,
              }}
              className="transform-gpu font-serif text-[clamp(1.5rem,3.5vw,2.75rem)] font-medium leading-tight tracking-tight text-[#e1edff] drop-shadow-md will-change-transform"
            >
              {screen.heading}
            </motion.h3>

            <motion.p
              style={{
                opacity: descriptionOpacity,
                y: descriptionY,
              }}
              className="mt-2 max-w-xl transform-gpu font-['Figtree'] text-xs leading-relaxed text-[#a3b8cc] sm:text-sm md:mt-4 md:text-lg will-change-transform"
            >
              {screen.description}
            </motion.p>
          </div>

          {/* Image Display Pane */}
          <div className="relative min-h-0 w-full flex-1 overflow-hidden md:w-1/2">
            <motion.div
              style={{
                opacity: imageOpacity,
                y: imageY,
              }}
              className="relative h-full w-full transform-gpu will-change-transform"
            >
              <div className="relative h-full w-full overflow-hidden">
                <motion.div
                  style={{ x: imagePan }}
                  className="relative h-full w-[160%] max-w-none transform-gpu will-change-transform"
                >
                  <Image
                    src={screen.imageSrc}
                    alt={screen.heading}
                    fill
                    priority={index === 0}
                    quality={90}
                    className="object-cover object-left-top"
                    sizes="(max-width: 767px) 160vw, 80vw"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AppPreview = () => {
  return (
    <section id="walkthrough" className="relative w-full bg-[#212121]">
      <div className="w-full bg-[#212121] px-4 pb-10 pt-16 md:px-8 md:pb-14 md:pt-24">
        <div className="flex w-full flex-col items-start gap-4 text-left">
          <h2 className="font-serif text-[clamp(1.75rem,4.5vw,4.25rem)] font-medium leading-tight tracking-tight text-[#e1edff] drop-shadow-md">
            From Document to Deliverable.
          </h2>

          <p className="max-w-3xl font-['Figtree'] text-sm leading-relaxed text-[#a3b8cc] sm:text-base md:text-xl md:leading-relaxed">
            Create, review, refine, and deliver the operational content your
            organization needs from one structured workspace.
          </p>
        </div>
      </div>

      <div className="relative">
        {appScreens.map((screen, index) => (
          <ScreenStep
            key={screen.id}
            screen={screen}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

export default AppPreview