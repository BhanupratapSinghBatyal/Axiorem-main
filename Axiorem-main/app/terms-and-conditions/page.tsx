"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  ShieldCheck,
} from "lucide-react"

import termsAndConditionsData from "../../utils/terms_and_conditions.json"

type TermsSection = {
  id: string
  number: number
  title: string
  paragraphs?: string[]
  bullets?: string[]
  ordered?: string[]
}

type TermsData =
  | TermsSection[]
  | {
      sections?: TermsSection[]
      terms?: TermsSection[]
      data?: TermsSection[]
    }

function getSections(data: TermsData): TermsSection[] {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data.sections)) {
    return data.sections
  }

  if (Array.isArray(data.terms)) {
    return data.terms
  }

  if (Array.isArray(data.data)) {
    return data.data
  }

  return []
}

export default function TermsAndConditionsPage() {
  const [isMobileTocOpen, setIsMobileTocOpen] =
    useState(false)

  const TERMS_SECTIONS = useMemo(
    () =>
      getSections(
        termsAndConditionsData as TermsData
      ),
    []
  )

  const scrollToSection = (id: string) => {
    const element =
      document.getElementById(id)

    if (!element) return

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })

    setIsMobileTocOpen(false)
  }

  return (
    <main className="min-h-screen bg-[#212121] text-white">

      {/* Hero */}
      <section
        aria-labelledby="terms-heading"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/landing/pp_bg.png')",
          }}
        />

        <div className="absolute inset-0 bg-[#212121]/70" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-32 lg:px-8 lg:pb-24">

          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Axiorem
          </Link>

          <div className="max-w-4xl">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f9ed4]">
              Axiorem Legal
            </p>

            <h1
              id="terms-heading"
              className="font-serif text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Terms & Conditions
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              The terms governing access to and use of Axiorem, including our
              platform, AI functionality, training tools, generated content,
              subscriptions, and related services.
            </p>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-3">

              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Effective Date
                </p>

                <p className="mt-2 text-sm font-medium text-white">
                  1 SEPTEMBER 2026
                </p>
              </div>

              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Last Updated
                </p>

                <p className="mt-2 text-sm font-medium text-white">
                  1 SEPTEMBER 2026
                </p>
              </div>

              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Version
                </p>

                <p className="mt-2 text-sm font-medium text-white">
                  1.0
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Mobile Table of Contents */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#171717]/95 px-6 py-4 backdrop-blur-xl lg:hidden">

        <button
          type="button"
          onClick={() =>
            setIsMobileTocOpen(
              (previous) => !previous
            )
          }
          className="flex w-full items-center justify-between text-sm font-medium text-white"
          aria-expanded={isMobileTocOpen}
        >
          <span>
            Table of Contents
          </span>

          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              isMobileTocOpen
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {isMobileTocOpen && (
          <div className="mt-4 max-h-[60vh] overflow-y-auto border-t border-white/10 pt-4">
            <nav className="flex flex-col">
              {TERMS_SECTIONS.map(
                (section) => (
                  <button
                    type="button"
                    key={section.id}
                    onClick={() =>
                      scrollToSection(
                        section.id
                      )
                    }
                    className="border-b border-white/5 py-3 text-left text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <span className="mr-2 text-[#6f9ed4]">
                      {section.number}.
                    </span>

                    {section.title}
                  </button>
                )
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <section className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-24">

        {/* Desktop TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">

            <div className="mb-6 flex items-center gap-2">
              <FileText
                size={16}
                className="text-[#6f9ed4]"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                Contents
              </span>
            </div>

            <nav
              aria-label="Terms and Conditions sections"
              className="max-h-[calc(100vh-10rem)] space-y-0.5 overflow-y-auto pr-4"
            >
              {TERMS_SECTIONS.map(
                (section) => (
                  <button
                    type="button"
                    key={section.id}
                    onClick={() =>
                      scrollToSection(
                        section.id
                      )
                    }
                    className="group flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <span className="mt-0.5 text-xs text-white/25 transition-colors group-hover:text-[#6f9ed4]">
                      {section.number}
                    </span>

                    <span className="text-sm leading-snug text-white/50 transition-colors group-hover:text-white">
                      {section.title}
                    </span>
                  </button>
                )
              )}
            </nav>

          </div>
        </aside>

        {/* Terms Content */}
        <div className="min-w-0">

          {/* Introduction */}
          <div className="mb-16 rounded-2xl border border-[#1b365d]/40 bg-[#1b365d]/10 p-6">
            <div className="flex gap-4">

              <div className="shrink-0 pt-0.5">
                <ShieldCheck
                  size={22}
                  className="text-[#6f9ed4]"
                />
              </div>

              <div>

                <h2 className="text-base font-semibold text-white">
                  Using Axiorem
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  These Terms govern your access to and use of Axiorem. By
                  creating an Account, accessing the Service, or using any part
                  of the platform, you agree to be bound by these Terms and any
                  applicable agreements incorporated into them.
                </p>

              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-16">

            {TERMS_SECTIONS.map(
              (section) => (
                <article
                  id={section.id}
                  key={section.id}
                  className="scroll-mt-32 border-b border-white/10 pb-16 last:border-b-0"
                >
                  <div className="flex items-start gap-5">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1b365d]/50 bg-[#1b365d]/20 text-sm font-medium text-[#6f9ed4]">
                      {section.number}
                    </span>

                    <div className="min-w-0 flex-1">

                      <h2 className="font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                        {section.title}
                      </h2>

                      {Array.isArray(
                        section.paragraphs
                      ) &&
                      section.paragraphs.length >
                        0 ? (
                        <div className="mt-6 space-y-4">
                          {section.paragraphs.map(
                            (
                              paragraph,
                              index
                            ) => (
                              <p
                                key={`${section.id}-paragraph-${index}`}
                                className="text-[15px] leading-8 text-white/65 sm:text-base"
                              >
                                {paragraph}
                              </p>
                            )
                          )}
                        </div>
                      ) : null}

                      {Array.isArray(
                        section.bullets
                      ) &&
                      section.bullets.length >
                        0 ? (
                        <ul className="mt-6 space-y-3">
                          {section.bullets.map(
                            (
                              bullet,
                              index
                            ) => (
                              <li
                                key={`${section.id}-bullet-${index}`}
                                className="flex gap-3 text-[15px] leading-7 text-white/65 sm:text-base"
                              >
                                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6f9ed4]" />

                                <span>
                                  {bullet}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : null}

                      {Array.isArray(
                        section.ordered
                      ) &&
                      section.ordered.length >
                        0 ? (
                        <ol className="mt-6 list-decimal space-y-3 pl-5 text-[15px] leading-7 text-white/65 sm:text-base">
                          {section.ordered.map(
                            (
                              item,
                              index
                            ) => (
                              <li
                                key={`${section.id}-ordered-${index}`}
                              >
                                <span>
                                  {item}
                                </span>
                              </li>
                            )
                          )}
                        </ol>
                      ) : null}

                    </div>
                  </div>
                </article>
              )
            )}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            Axiorem
          </Link>

          <nav
            aria-label="Legal navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/45"
          >
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/cookie-and-data-policy"
              className="transition-colors hover:text-white"
            >
              Cookie & Data Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="text-white"
            >
              Terms & Conditions
            </Link>
          </nav>

        </div>
      </footer>

    </main>
  )
}