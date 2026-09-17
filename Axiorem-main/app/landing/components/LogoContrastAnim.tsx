"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const LOGO_IMAGES = [
  {
    src: "/landing/logo.png",
    alt: "Standard Logo",
  },
  {
    src: "/landing/logo_inverted.png",
    alt: "Inverted Logo",
  },
]

const IMAGE_SIZES =
  "(max-width: 768px) 100vw, 480px"

type LogoState = "idle" | "ingesting" | "processed"

type LogoContrastAnimProps = {
  state?: LogoState
}

const EASE = [0.16, 1, 0.3, 1] as const

export const LogoContrastAnim = ({
  state = "idle",
}: LogoContrastAnimProps) => {
  const isIngesting = state === "ingesting"

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      <div className="relative aspect-square w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] [perspective:1400px]">
        {/* Soft aura field */}
        <motion.div
          initial={false}
          animate={
            state === "idle"
              ? {
                  opacity: 0,
                  scale: 0.8,
                }
              : isIngesting
                ? {
                    opacity: [0, 0.35, 0.7, 0.45],
                    scale: [0.7, 1.05, 1.3, 1.12],
                  }
                : {
                    opacity: 0.22,
                    scale: 1,
                  }
          }
          transition={
            isIngesting
              ? {
                  duration: 0.9,
                  times: [0, 0.3, 0.75, 1],
                  ease: EASE,
                }
              : {
                  duration: 0.55,
                  ease: EASE,
                }
          }
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[72%]
            w-[72%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/10
            blur-[70px]
            transform-gpu
            will-change-transform
          "
        />

        {/* Secondary depth layer */}
        <motion.div
          initial={false}
          animate={
            isIngesting
              ? {
                  opacity: [0, 0.12, 0.28, 0],
                  scale: [0.45, 0.9, 1.55, 1.8],
                }
              : {
                  opacity: 0,
                  scale: 0.5,
                }
          }
          transition={{
            duration: 0.9,
            ease: EASE,
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[45%]
            w-[45%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/10
            blur-[45px]
            transform-gpu
          "
        />

        {/* 3D logo */}
        <motion.div
          initial={false}
          animate={
            state === "idle"
              ? {
                  rotateY: 0,
                  scaleX: 1,
                  scaleY: 1,
                }
              : isIngesting
                ? {
                    rotateY: [0, 90, 180, 270, 360],
                    scaleX: [
                      1,
                      1.025,
                      0.97,
                      1.035,
                      1,
                    ],
                    scaleY: [
                      1,
                      0.985,
                      1.025,
                      0.975,
                      1,
                    ],
                  }
                : {
                    rotateY: 180,
                    scaleX: 1,
                    scaleY: 1,
                  }
          }
          transition={
            isIngesting
              ? {
                  duration: 0.9,
                  times: [0, 0.22, 0.5, 0.76, 1],
                  ease: [0.65, 0, 0.35, 1],
                }
              : {
                  duration: 0.45,
                  ease: EASE,
                }
          }
          className="
            relative
            z-10
            h-full
            w-full
            transform-gpu
            will-change-transform
            [transform-style:preserve-3d]
          "
        >
          {/* Front face */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <Image
              src={LOGO_IMAGES[0].src}
              alt={LOGO_IMAGES[0].alt}
              fill
              priority
              className="object-contain"
              sizes={IMAGE_SIZES}
            />
          </div>

          {/* Back face */}
          <div
            className="
              absolute
              inset-0
              [backface-visibility:hidden]
              [transform:rotateY(180deg)]
            "
          >
            <Image
              src={LOGO_IMAGES[1].src}
              alt={LOGO_IMAGES[1].alt}
              fill
              className="object-contain"
              sizes={IMAGE_SIZES}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LogoContrastAnim