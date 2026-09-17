"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

const DOCS = [
  { src: "/landing/sample_docs.png", title: "POLICY DOCUMENTS", alt: "Policy Documents" },
  { src: "/landing/sample_docs_2.jpg", title: "OPERATION MANUALS", alt: "Operation Manuals" },
  { src: "/landing/sample_docs_3.jpg", title: "EMPLOYEE HANDBOOKS", alt: "Employee Handbooks" },
  { src: "/landing/sample_docs_4.jpg", title: "TECHNICAL DOCUMENTATION", alt: "Technical Documentation" },
]

export const ProblemOverview = () => {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Mobile Layout */}
      <section className="relative z-40 w-full bg-[#212121] px-4 py-12 md:hidden">
        <div className="mx-auto flex w-full max-w-2xl flex-col">
          <div className="mb-8">
            <h2 className="font-['Figtree'] text-3xl font-bold leading-tight tracking-tight text-[#e1edff]">
              And it's all sitting in
            </h2>
          </div>

          <div className="relative aspect-[15/56] w-full">
            {DOCS.map((doc, index) => (
              <div
                key={doc.title}
                className="absolute left-0 w-full overflow-hidden"
                style={{
                  top: `${index * 21.4286}%`,
                  height: "35.7143%",
                  zIndex: index + 1,
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={doc.src}
                    alt={doc.alt}
                    fill
                    className="object-cover object-top"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 z-10 flex items-start justify-start bg-gradient-to-br from-black/80 via-black/40 to-transparent p-6">
                    <h3 className="font-figtree text-lg uppercase tracking-wider text-white">
                      {doc.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop Layout */}
      {isDesktop && <DesktopProblemOverview />}
    </>
  )
}

const DesktopProblemOverview = () => {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Explicitly clamp output bounds [start, peak, end-hold] to prevent production scroll extrapolation resets
  const doc2Y = useTransform(scrollYProgress, [0, 0.33, 1], ["100%", "14%", "14%"])
  const doc2Opacity = useTransform(scrollYProgress, [0, 0.12, 0.33, 1], [0, 1, 1, 1])
  const doc2Scale = useTransform(scrollYProgress, [0, 0.33, 1], [1.03, 1, 1])
  const doc2LabelOpacity = useTransform(scrollYProgress, [0.16, 0.3, 1], [0, 1, 1])

  const doc3Y = useTransform(scrollYProgress, [0.33, 0.66, 1], ["100%", "28%", "28%"])
  const doc3Opacity = useTransform(scrollYProgress, [0.33, 0.45, 0.66, 1], [0, 1, 1, 1])
  const doc3Scale = useTransform(scrollYProgress, [0.33, 0.66, 1], [1.03, 1, 1])
  const doc3LabelOpacity = useTransform(scrollYProgress, [0.48, 0.63, 1], [0, 1, 1])

  const doc4Y = useTransform(scrollYProgress, [0.66, 1], ["100%", "42%"])
  const doc4Opacity = useTransform(scrollYProgress, [0.66, 0.78, 1], [0, 1, 1])
  const doc4Scale = useTransform(scrollYProgress, [0.66, 1], [1.03, 1])
  const doc4LabelOpacity = useTransform(scrollYProgress, [0.82, 0.95, 1], [0, 1, 1])

  const docTransforms = [
    { y: doc2Y, opacity: doc2Opacity, scale: doc2Scale, labelOpacity: doc2LabelOpacity },
    { y: doc3Y, opacity: doc3Opacity, scale: doc3Scale, labelOpacity: doc3LabelOpacity },
    { y: doc4Y, opacity: doc4Opacity, scale: doc4Scale, labelOpacity: doc4LabelOpacity },
  ]

  return (
    <section
      ref={sectionRef}
      className="absolute right-0 top-[160vh] hidden h-[200vh] w-[30vw] md:block lg:w-[35vw] xl:w-[40vw] 2xl:w-[45vw]"
    >
      <div className="sticky top-[80px] flex h-[calc(100vh-80px)] w-full flex-col overflow-hidden">
        <div className="w-full shrink-0 px-4 pt-2 text-left sm:px-6 lg:px-8">
          <h2 className="font-['Figtree'] text-[clamp(1.75rem,3vw,3rem)] font-bold leading-tight tracking-tight text-[#e1edff]">
            And it's all sitting in
          </h2>
        </div>

        <div className="relative mt-6 min-h-0 w-full flex-1 overflow-hidden">
          {/* Base Document */}
          <div className="absolute inset-0 h-full w-full z-10">
            <Image
              src={DOCS[0].src}
              alt={DOCS[0].alt}
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1023px) 30vw, (max-width: 1279px) 35vw, (max-width: 1535px) 40vw, 45vw"
            />
            <div className="absolute inset-0 z-10 flex items-start justify-start bg-gradient-to-br from-black/80 via-black/40 to-transparent p-6 sm:p-8">
              <h3 className="font-figtree text-lg uppercase tracking-wider text-white sm:text-xl md:text-2xl">
                {DOCS[0].title}
              </h3>
            </div>
          </div>

          {/* Cascading Animated Documents */}
          {docTransforms.map((transform, index) => {
            const doc = DOCS[index + 1]
            return (
              <motion.div
                key={doc.title}
                style={{
                  y: transform.y,
                  opacity: transform.opacity,
                  scale: transform.scale,
                  zIndex: (index + 2) * 10, // Explicit inline zIndex prevents Tailwind purge issues
                }}
                className="absolute inset-0 h-full w-full origin-top [will-change:transform,opacity] [transform:translateZ(0)]"
              >
                <Image
                  src={doc.src}
                  alt={doc.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1023px) 30vw, (max-width: 1279px) 35vw, (max-width: 1535px) 40vw, 45vw"
                />
                <motion.div
                  style={{ opacity: transform.labelOpacity }}
                  className="absolute inset-0 z-10 flex items-start justify-start bg-gradient-to-br from-black/80 via-black/40 to-transparent p-6 sm:p-8 [will-change:opacity]"
                >
                  <h3 className="font-figtree text-lg uppercase tracking-wider text-white sm:text-xl md:text-2xl">
                    {doc.title}
                  </h3>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}