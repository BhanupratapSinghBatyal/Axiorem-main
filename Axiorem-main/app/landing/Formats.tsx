"use client"

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"

const formats = [
  {
    title: "Manuals",
    description:
      "Transform dense operational manuals into structured, interactive step-by-step guidance.",
  },
  {
    title: "SOPs",
    description:
      "Standardize procedure execution with automated extraction and real-time updates.",
  },
  {
    title: "Policies",
    description:
      "Convert corporate compliance policies into enforceable operational protocols.",
  },
  {
    title: "Compliance",
    description:
      "Ensure regulatory alignment with verifiable tracking and structured oversight.",
  },
  {
    title: "Technical Documentation",
    description:
      "Distill complex technical schematics and specs into digestible visual insights.",
  },
  {
    title: "Handbooks",
    description:
      "Reinvent employee handbooks into actionable onboarding and daily references.",
  },
  {
    title: "Training",
    description:
      "Generate dynamic learning paths directly from core domain documents.",
  },
  {
    title: "Assessments",
    description:
      "Automate skill evaluation and knowledge checks across target workflows.",
  },
  {
    title: "SCORM",
    description:
      "Export standards-compliant SCORM packages instantly into existing enterprise LMS platforms.",
  },
]

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 150,
}

const CARD_SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 22,
}

type FormatCardProps = {
  item: (typeof formats)[number]
  row: number
  col: number
  hoveredRow: number | null
  onHover: (row: number) => void
}

const FormatCard = memo(
  ({
    item,
    row,
    col,
    hoveredRow,
    onHover,
  }: FormatCardProps) => {
    const isRowHovered =
      hoveredRow === row

    const isAnyRowHovered =
      hoveredRow !== null

    const defaultRotateY =
      col === 0
        ? 8
        : col === 2
          ? -8
          : 0

    let targetRotateX = 0
    let targetZ = 0

    if (isAnyRowHovered) {
      if (isRowHovered) {
        targetZ = 45
      } else {
        targetRotateX =
          row < hoveredRow
            ? -12
            : 12

        targetZ = -30
      }
    }

    return (
      <motion.div
        onMouseEnter={() => onHover(row)}
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        animate={{
          rotateY: defaultRotateY,
          rotateX: targetRotateX,
          z: targetZ,
        }}
        transition={CARD_SPRING}
        style={{
          transformStyle:
            "preserve-3d",
        }}
        className="
          group
          relative
          flex
          flex-col
          justify-between
          rounded-xl
          border
          border-white/10
          bg-[#262626]
          p-6
          transition-colors
          duration-300
          hover:border-white/25
          hover:bg-[#2e2e2e]
          lg:will-change-transform
        "
      >
        <div
          style={{
            transform:
              "translateZ(20px)",
          }}
        >
          <h3 className="font-['Figtree'] text-lg font-semibold tracking-wide text-[#e1edff] transition-colors duration-200 group-hover:text-white sm:text-xl">
            {item.title}
          </h3>

          <p className="mt-2 font-['Figtree'] text-xs leading-relaxed text-[#a3b8cc] sm:text-sm">
            {item.description}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-xl border border-transparent transition-colors duration-300 group-hover:border-[#e1edff]/20" />
      </motion.div>
    )
  }
)

FormatCard.displayName =
  "FormatCard"

export const Formats = () => {
  const containerRef =
    useRef<HTMLDivElement>(null)

  const boundsRef = useRef({
    left: 0,
    top: 0,
    width: 1,
    height: 1,
  })

  const [hoveredRow, setHoveredRow] =
    useState<number | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseXSpring = useSpring(
    mouseX,
    SPRING_CONFIG
  )

  const mouseYSpring = useSpring(
    mouseY,
    SPRING_CONFIG
  )

  const globalRotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [6, -6]
  )

  const globalRotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [-6, 6]
  )

  /*
   * Read layout only when the container's
   * geometry can actually change.
   */
  const updateBounds = useCallback(() => {
    const container =
      containerRef.current

    if (!container) return

    const rect =
      container.getBoundingClientRect()

    boundsRef.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }
  }, [])

  useEffect(() => {
    const container =
      containerRef.current

    if (!container) return

    updateBounds()

    const resizeObserver =
      new ResizeObserver(updateBounds)

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateBounds])

  /*
   * No layout reads here.
   *
   * Mouse movement only updates MotionValues.
   */
  const handleMouseMove = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement>
    ) => {
      const {
        left,
        top,
        width,
        height,
      } = boundsRef.current

      const x =
        (event.clientX - left) /
          width -
        0.5

      const y =
        (event.clientY - top) /
          height -
        0.5

      mouseX.set(x)
      mouseY.set(y)
    },
    [mouseX, mouseY]
  )

  const handleMouseEnter = useCallback(() => {
    updateBounds()
  }, [updateBounds])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)

    setHoveredRow((current) =>
      current === null
        ? current
        : null
    )
  }, [mouseX, mouseY])

  const handleRowHover = useCallback(
    (row: number) => {
      setHoveredRow((current) =>
        current === row
          ? current
          : row
      )
    },
    []
  )

  return (
    <section id="formats" className="relative w-full overflow-hidden bg-[#212121] px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-tight tracking-tight text-[#e1edff] drop-shadow-md">
            One Document. Every Operational
            Format.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl font-['Figtree'] text-sm leading-relaxed text-[#a3b8cc] sm:text-base md:text-xl">
            Turn your existing manuals,
            policies, and technical
            documentation into the training,
            assessments, SOPs, and compliance
            assets your organization actually
            needs.
          </p>
        </div>

        {/* 3D Perspective Container */}
        <motion.div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: globalRotateX,
            rotateY: globalRotateY,
            transformStyle:
              "preserve-3d",
          }}
          className="
            grid
            grid-cols-1
            gap-4
            perspective-1000
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-6
          "
        >
          {formats.map((item, index) => {
            const row =
              Math.floor(index / 3)

            const col = index % 3

            return (
              <FormatCard
                key={item.title}
                item={item}
                row={row}
                col={col}
                hoveredRow={hoveredRow}
                onHover={handleRowHover}
              />
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Formats