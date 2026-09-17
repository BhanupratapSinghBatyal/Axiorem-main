"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const PPTX_ICONS = [
  "/landing/pptx_icon_1.png",
  "/landing/pptx_icon_2.png",
  "/landing/pptx_icon_3.png",
  "/landing/pptx_icon_4.png",
]

const IMAGE_SIZES =
  "(max-width: 768px) 100vw, 480px"

export const PptxAnim = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex(
        (current) =>
          (current + 1) % PPTX_ICONS.length
      )
    }, 750)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="relative aspect-square w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
        {PPTX_ICONS.map((src, index) => {
          const isActive = index === currentIndex

          return (
            <div
              key={src}
              className={[
                "absolute inset-0",
                "transition-opacity duration-500 ease-in-out",
                isActive
                  ? "opacity-100"
                  : "opacity-0",
              ].join(" ")}
            >
              <Image
                src={src}
                alt={`PPTX Step ${index + 1}`}
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

export default PptxAnim