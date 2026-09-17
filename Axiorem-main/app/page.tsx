"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

import { Navbar } from "./landing/Navbar"
import { Hero } from "./landing/Hero"
import ProcessVisual from "./landing/ProcessVisual"
import Formats from "./landing/Formats"
import TemplatePreview from "./landing/TemplatePreview"
import AppPreview from "./landing/AppPreview"
import WorkflowComparison from "./landing/WorkflowComparison"
import TeamFeatures from "./landing/TeamFeatures"
import VisualBuilderPreview from "./landing/VisualBuilderPreview"
import Pricing from "./landing/PricingSection"
import AxioremPolicy from "./landing/AxioremPolicy"
import { Footer } from "./landing/Footer"

// Consolidated list of media assets across all sections
const MEDIA_ASSETS = [
  "/backgrounds/hero_text_bg.png",
  "/backgrounds/beams.png", // Added Beams asset

  // Logos
  "/logo.png",
  "/landing/logo.png",

  // App Preview Section
  "/landing/app_preview_1.png",
  "/landing/app_preview_2.png",
  "/landing/app_preview_3.png",
  "/landing/app_preview_4.png",
  "/landing/app_preview_5.png",

  // Team Features Section
  "/landing/team_1.png",
  "/landing/team_2.png",
  "/landing/team_3.png",
  "/landing/team_features_bg.png",

  // Workflow Steps Section
  "/landing/step_1_bg.png",
  "/landing/step_2_bg.png",
  "/landing/step_3_bg.png",

  // Template Preview Section
  "/get-started-templates/industry-audits.png",
  "/get-started-templates/safety-manuals.png",
  "/get-started-templates/esg-initiatives.png",
  "/get-started-templates/api-docs.png",
  "/get-started-templates/hipaa-updates.png",
  "/get-started-templates/employee-handbooks.png",
  "/get-started-templates/commercial-contracts.png",
  "/get-started-templates/growth-reports.png",
  "/get-started-templates/supply-chain.png",
  "/get-started-templates/engineering-blueprints.png",
]

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const preloadMedia = async () => {
      const promises = MEDIA_ASSETS.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image()
          img.src = src
          img.onload = () => resolve()
          img.onerror = () => resolve() // Fail gracefully to prevent loader block
        })
      })

      await Promise.all(promises)

      if (isMounted) {
        setIsLoading(false)
      }
    }

    preloadMedia()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#212121]">
        <div className="animate-pulse flex items-center justify-center">
          <Image
            src="/landing/logo.png"
            alt="Loading..."
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProcessVisual />
        <Formats />
        <TemplatePreview />
        <AppPreview />
        <WorkflowComparison />
        <TeamFeatures />
        <VisualBuilderPreview />
        <Pricing />
        <AxioremPolicy />
        <Footer/>
      </main>
    </>
  )
}