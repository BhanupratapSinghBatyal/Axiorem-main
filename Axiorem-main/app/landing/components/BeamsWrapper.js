"use client"

import { useEffect, useState } from "react"
import Beams from "./Beams"

export default function BeamsWrapper() {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Do not execute canvas/animation loops on mobile devices
  // if (isMobile) return null

  return (
    <div className="pointer-events-none absolute top-0 left-0 z-0 h-screen w-full overflow-hidden">
      <Beams
        beamWidth={3}
        beamHeight={30}
        beamNumber={20}
        lightColor="#e1edff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
      />
    </div>
  )
}