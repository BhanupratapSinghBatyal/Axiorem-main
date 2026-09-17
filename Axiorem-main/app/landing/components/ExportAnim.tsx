"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const FRAMES = [
  "/landing/export_frame_1.png",
  "/landing/export_frame_2.png",
  "/landing/export_frame_3.png",
  "/landing/export_frame_4.png",
]

const FRAME_DURATION = 600

const IMAGE_SIZES =
  "(max-width: 768px) 100vw, 600px"

export const ExportAnim = () => {
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentFrame(
        (current) =>
          (current + 1) % FRAMES.length
      )
    }, FRAME_DURATION)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="relative h-full w-full">
        {FRAMES.map((src, index) => {
          const isActive =
            index === currentFrame

          return (
            <div
              key={src}
              className={[
                "absolute inset-0",
                "transition-[opacity,transform]",
                "duration-[280ms]",
                "ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive
                  ? "scale-100 opacity-100"
                  : "scale-[1.025] opacity-0",
              ].join(" ")}
              aria-hidden={!isActive}
            >
              <Image
                src={src}
                alt={`Export process frame ${index + 1}`}
                fill
                priority={index === 0}
                className="object-contain"
                sizes={IMAGE_SIZES}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExportAnim