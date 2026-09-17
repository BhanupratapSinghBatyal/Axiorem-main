"use client"

import { useState, useEffect, useRef } from "react"
import type { MouseEvent } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  ChevronDown,
  FileCode,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Landmark,
  HeartPulse,
  Users,
  Scale,
  ChartNoAxesCombined,
  Truck,
  Cog,
  PlayCircle,
  Users2,
  FileText,
  Cookie,
  LucideIcon,
} from "lucide-react"
import Lenis from "@studio-freight/lenis"

type DropdownType = "solutions" | "platform" | "resources"

interface NavLink {
  name: string
  href: string
  type?: DropdownType
}

const NAVIGATION_LINKS: NavLink[] = [
  { name: "How It Works", href: "#process" },
  { name: "Solutions", href: "#templates", type: "solutions" },
  { name: "Platform", href: "#platform", type: "platform" },
  { name: "Resources", href: "#resources", type: "resources" },
  { name: "Pricing", href: "#pricing" },
]

const INDUSTRIES = [
  {
    id: "compliance",
    name: "Compliance",
    description:
      "Audits, operational frameworks, and regulatory training.",
    href: "#templates",
    industryId: "compliance",
    icon: ShieldCheck,
  },
  {
    id: "esg",
    name: "ESG",
    description:
      "Sustainability, governance, and stakeholder reporting.",
    href: "#templates",
    industryId: "esg",
    icon: Leaf,
  },
  {
    id: "fintech",
    name: "Fintech",
    description:
      "Financial APIs, integrations, and technical workflows.",
    href: "#templates",
    industryId: "fintech",
    icon: Landmark,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description:
      "HIPAA policies, privacy procedures, and compliance training.",
    href: "#templates",
    industryId: "healthcare",
    icon: HeartPulse,
  },
  {
    id: "hr",
    name: "Human Resources",
    description:
      "Employee policies, handbooks, and conduct guidelines.",
    href: "#templates",
    industryId: "hr",
    icon: Users,
  },
  {
    id: "legal",
    name: "Legal",
    description:
      "Contracts, term sheets, obligations, and approval workflows.",
    href: "#templates",
    industryId: "legal",
    icon: Scale,
  },
  {
    id: "strategy",
    name: "Corporate Strategy",
    description:
      "Growth reports, KPIs, and strategic decision briefings.",
    href: "#templates",
    industryId: "strategy",
    icon: ChartNoAxesCombined,
  },
  {
    id: "supply-chain",
    name: "Supply Chain",
    description:
      "Procurement, logistics, supplier standards, and procedures.",
    href: "#templates",
    industryId: "supply-chain",
    icon: Truck,
  },
  {
    id: "technical",
    name: "Technical & Engineering",
    description:
      "Product specifications, engineering blueprints, and manuals.",
    href: "#templates",
    industryId: "technical",
    icon: Cog,
  },
]

const RESOURCES_LINKS = [
  {
    title: "Terms & Conditions",
    desc:
      "Rules, guidelines, and legal agreements governing the platform.",
    href: "/terms-and-conditions",
    icon: FileText,
    tag: "Legal",
    bg: "/backgrounds/assignment_onboarding_bg_2.png",
    actionText: "Read Terms",
  },
  {
    title: "Privacy Policy",
    desc:
      "How we collect, protect, and handle your data across services.",
    href: "/privacy-policy",
    icon: ShieldCheck,
    tag: "Privacy",
    bg: "/backgrounds/assignment_onboarding_bg_4.png",
    actionText: "Read Policy",
  },
  {
    title: "Cookie & Data Policy",
    desc:
      "Information regarding tracking, analytics, and data management preferences.",
    href: "/cookie-and-data-policy",
    icon: Cookie,
    tag: "Compliance",
    bg: "/backgrounds/assignment_onboarding_bg_5.png",
    actionText: "Read Policy",
  },
]

const MenuItem = ({
  title,
  desc,
  icon: Icon,
  onClick,
  href,
}: {
  title: string
  desc: string
  icon: LucideIcon
  onClick: (event?: MouseEvent<HTMLAnchorElement>) => void
  href?: string
}) => {
  const content = (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/5 p-2 text-white/70 transition-colors duration-150 group-hover:bg-white/10 group-hover:text-white">
            <Icon size={18} />
          </div>

          <span className="text-sm font-semibold text-white/90 transition-colors duration-150 group-hover:text-white">
            {title}
          </span>
        </div>

        <ArrowRight
          size={16}
          className="shrink-0 text-white/50 transition-all duration-150 group-hover:translate-x-1 group-hover:text-white"
        />
      </div>

      <p className="mt-2 text-xs leading-relaxed text-white/60">
        {desc}
      </p>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={(event) => onClick(event)}
        className="group flex flex-col justify-start rounded-xl p-4 text-left transition-colors duration-150 hover:bg-[#2b2b2b]"
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={() => onClick()}
      className="group flex flex-col justify-start rounded-xl p-4 text-left transition-colors duration-150 hover:bg-[#2b2b2b]"
    >
      {content}
    </button>
  )
}

const CardItem = ({
  title,
  desc,
  tag,
  icon: Icon,
  bg,
  actionText = "Explore Solutions",
  onClick,
}: {
  title: string
  desc: string
  tag?: string
  icon?: LucideIcon
  bg: string
  actionText?: string
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat p-6 text-left shadow-md transition-all duration-300"
    style={{
      backgroundImage: `url('${bg}')`,
    }}
  >
    <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/30" />

    {tag && Icon && (
      <div className="relative z-10 flex items-center space-x-3">
        <div className="rounded-lg bg-white/10 p-2.5 text-white backdrop-blur-md">
          <Icon size={24} />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
          {tag}
        </span>
      </div>
    )}

    <div className="relative z-10 my-4">
      <h3 className="text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm text-white/80">
        {desc}
      </p>
    </div>

    <div className="relative z-10 flex items-center justify-between text-sm font-semibold text-white">
      <span>{actionText}</span>

      <ArrowRight
        size={18}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </div>
  </button>
)

export const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false)

  const [isScrolled, setIsScrolled] =
    useState(false)

  const [activeDropdown, setActiveDropdown] =
    useState<DropdownType | null>(null)

  const [activeMobileAccordion, setActiveMobileAccordion] =
    useState<DropdownType | null>(null)

  const lenisRef =
    useRef<Lenis | null>(null)

  const dropdownTimeoutRef =
    useRef<NodeJS.Timeout | null>(null)

  const scrollToAnchor = (targetId: string) => {
    const element =
      document.getElementById(targetId) ||
      document.getElementById("templates")

    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, {
        offset: -80,
        duration: 1.2,
      })
    } else if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
    })

    ;(window as any).lenis = lenis
    lenisRef.current = lenis

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const handleScroll = (e: any) => {
      setIsScrolled(e.animatedScroll > 20)
    }

    lenis.on("scroll", handleScroll)

    return () => {
      lenis.off("scroll", handleScroll)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (
      pathname === "/" &&
      typeof window !== "undefined" &&
      window.location.hash
    ) {
      const targetId = window.location.hash.slice(1)

      const timer = setTimeout(() => {
        scrollToAnchor(targetId)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  const closeMenus = () => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
    setActiveMobileAccordion(null)
  }

  const handleLinkClick = (
    href: string,
    industryId?: string
  ) => {
    closeMenus()

    if (!href.startsWith("#")) {
      router.push(href)
      return
    }

    if (pathname !== "/") {
      if (industryId) {
        sessionStorage.setItem(
          "pending_industry_id",
          industryId
        )
      }

      router.push(`/${href}`)
      return
    }

    if (industryId) {
      window.dispatchEvent(
        new CustomEvent("open-industry-accordion", {
          detail: { industryId },
        })
      )
    }

    const targetId = href.slice(1)

    scrollToAnchor(targetId)

    window.history.replaceState(null, "", href)
  }

  const handleMouseEnter = (
    type: DropdownType
  ) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }

    setActiveDropdown(type)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current =
      setTimeout(() => {
        setActiveDropdown(null)
      }, 150)
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="w-full pl-6 pr-0 lg:pl-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <div className="z-50 shrink-0">
            <button
              onClick={() =>
                handleLinkClick("#hero")
              }
              className="text-foreground hover:text-primary flex items-center text-3xl font-bold transition-colors duration-200 sm:text-4xl"
            >
              <motion.img
                src="/logo.png"
                alt="Axiorem Logo"
                height="45"
                width="45"
                style={{
                  objectFit: "contain",
                }}
                animate={{
                  x: isScrolled ? 16 : 0,
                }}
                transition={{
                  duration: 0.3,
                }}
              />

              <motion.span
                style={{
                  fontFamily: "Figtree",
                  fontWeight: "800",
                }}
                animate={{
                  opacity: isScrolled ? 0 : 1,
                  width: isScrolled
                    ? 0
                    : "auto",
                  marginLeft: isScrolled
                    ? 0
                    : 12,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                Axiorem
              </motion.span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden h-full items-center space-x-6 md:flex lg:space-x-8">
            <div className="flex h-full items-center space-x-6 lg:space-x-8">
              {NAVIGATION_LINKS.map((link) =>
                link.type ? (
                  <div
                    key={link.name}
                    className="flex h-full items-center"
                    onMouseEnter={() =>
                      handleMouseEnter(link.type!)
                    }
                    onMouseLeave={
                      handleMouseLeave
                    }
                  >
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          (prev) =>
                            prev === link.type
                              ? null
                              : link.type!
                        )
                      }
                      className="text-foreground hover:text-primary font-serif flex items-center space-x-1.5 px-3 py-2 text-lg lg:text-xl"
                    >
                      <span>
                        {link.name}
                      </span>

                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          activeDropdown ===
                          link.type
                            ? "rotate-180 text-primary"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                ) : link.name === "Pricing" ? (
                  <button
                    key={link.name}
                    onClick={() =>
                      handleLinkClick("#pricing")
                    }
                    className="text-foreground hover:text-primary font-serif group relative px-3 py-2 text-lg lg:text-xl"
                  >
                    <span>
                      {link.name}
                    </span>

                    <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
                  </button>
                ) : (
                  <button
                    key={link.name}
                    onClick={() =>
                      handleLinkClick(
                        link.href
                      )
                    }
                    className="text-foreground hover:text-primary font-serif group relative px-3 py-2 text-lg lg:text-xl"
                  >
                    <span>
                      {link.name}
                    </span>

                    <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => {
                closeMenus()

                window.open(
                  "/dashboard",
                  "_blank"
                )
              }}
              className="flex h-full items-center justify-center whitespace-nowrap bg-white px-8 text-lg font-medium text-black transition-colors hover:bg-slate-100"
            >
              Sign up for Free
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="z-50 pr-6 md:hidden">
            <button
              onClick={() =>
                setIsMobileMenuOpen(
                  !isMobileMenuOpen
                )
              }
              className="text-foreground p-2"
            >
              {isMobileMenuOpen ? (
                <X size={32} />
              ) : (
                <Menu size={32} />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Dropdowns */}
        {(
          [
            "solutions",
            "platform",
            "resources",
          ] as DropdownType[]
        ).map((type) => (
          <div
            key={type}
            onMouseEnter={() =>
              handleMouseEnter(type)
            }
            onMouseLeave={
              handleMouseLeave
            }
            className={`absolute left-1/2 top-20 hidden w-[95%] -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.45),0_6px_20px_rgba(0,0,0,0.3)] transition-[grid-template-rows,opacity] duration-300 md:grid ${
              activeDropdown === type
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-xl bg-[#212121]">
              <div className="px-8 pb-8 pt-6">
                <div className="mx-auto max-w-7xl">

                  {/* Solutions */}
                  {type ===
                    "solutions" && (
                    <div className="flex items-stretch gap-8">

                      <button
                        onClick={() =>
                          handleLinkClick(
                            "#templates"
                          )
                        }
                        className="group relative flex min-h-[360px] w-80 shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-[url('/backgrounds/assignment_onboarding_bg_2.png')] bg-cover bg-center bg-no-repeat p-6 text-left shadow-md"
                      >
                        <div className="absolute inset-0 bg-black/30" />

                        <div className="relative z-10">
                          <h3 className="mt-4 text-2xl font-bold leading-tight text-white">
                            Turn documents into learning experiences.
                          </h3>
                        </div>

                        <div className="relative z-10">
                          <p className="text-sm leading-relaxed text-white/80">
                            Transform existing documentation into structured
                            courses, assessments, and SCORM-ready learning
                            content.
                          </p>

                          <div className="mt-6 flex items-center justify-between text-sm font-semibold text-white">
                            <span>
                              Explore Solutions
                            </span>

                            <ArrowRight
                              size={18}
                              className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                          </div>
                        </div>
                      </button>

                      <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">

                        <MenuItem
                          title="Document Formats"
                          desc="Explore export formats and layouts."
                          icon={FileCode}
                          onClick={() =>
                            handleLinkClick(
                              "#formats"
                            )
                          }
                        />

                        {/* SCORM Viewer — crawlable sitelink destination */}
                        <MenuItem
                          title="SCORM Viewer"
                          desc="Upload and view SCORM 1.2 courses directly in Axiorem."
                          icon={PlayCircle}
                          href="/scorm-viewer"
                          onClick={() => {
                            closeMenus()
                          }}
                        />

                        {/* Existing template navigation */}
                        {INDUSTRIES.map(
                          (ind) => (
                            <MenuItem
                              key={ind.id}
                              title={ind.name}
                              desc={
                                ind.description
                              }
                              icon={
                                ind.icon
                              }
                              onClick={() =>
                                handleLinkClick(
                                  ind.href,
                                  ind.industryId
                                )
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Platform */}
                  {type ===
                    "platform" && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                      <CardItem
                        title="App Walkthrough"
                        desc="Take a guided tour of our engine, editing suite, and automated asset builder."
                        tag="Interactive Tour"
                        icon={PlayCircle}
                        bg="/backgrounds/assignment_onboarding_bg_4.png"
                        actionText="Watch Demo"
                        onClick={() =>
                          handleLinkClick(
                            "#walkthrough"
                          )
                        }
                      />

                      <CardItem
                        title="Teams Workflow"
                        desc="Discover enterprise access controls, shared spaces, and cross-team review pipelines."
                        tag="Collaboration"
                        icon={Users2}
                        bg="/backgrounds/assignment_onboarding_bg_5.png"
                        actionText="Explore Workflows"
                        onClick={() =>
                          handleLinkClick(
                            "#teams"
                          )
                        }
                      />

                    </div>
                  )}

                  {/* Resources */}
                  {type ===
                    "resources" && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                      {RESOURCES_LINKS.map(
                        (res) => {
                          const Icon =
                            res.icon

                          if (
                            res.title ===
                            "Terms & Conditions"
                          ) {
                            return (
                              <Link
                                key={
                                  res.title
                                }
                                href={
                                  res.href
                                }
                                onClick={() =>
                                  closeMenus()
                                }
                                className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat p-6 text-left shadow-md transition-all duration-300"
                                style={{
                                  backgroundImage: `url('${res.bg}')`,
                                }}
                              >
                                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/30" />

                                <div className="relative z-10 flex items-center space-x-3">
                                  <div className="rounded-lg bg-white/10 p-2.5 text-white backdrop-blur-md">
                                    <Icon
                                      size={
                                        24
                                      }
                                    />
                                  </div>

                                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                    {
                                      res.tag
                                    }
                                  </span>
                                </div>

                                <div className="relative z-10 my-4">
                                  <h3 className="text-2xl font-bold text-white">
                                    {
                                      res.title
                                    }
                                  </h3>

                                  <p className="mt-1 text-sm text-white/80">
                                    {
                                      res.desc
                                    }
                                  </p>
                                </div>

                                <div className="relative z-10 flex items-center justify-between text-sm font-semibold text-white">
                                  <span>
                                    {
                                      res.actionText
                                    }
                                  </span>

                                  <ArrowRight
                                    size={
                                      18
                                    }
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                  />
                                </div>
                              </Link>
                            )
                          }

                          return (
                            <CardItem
                              key={
                                res.title
                              }
                              title={
                                res.title
                              }
                              desc={
                                res.desc
                              }
                              tag={
                                res.tag
                              }
                              icon={
                                res.icon
                              }
                              bg={
                                res.bg
                              }
                              actionText={
                                res.actionText
                              }
                              onClick={() =>
                                handleLinkClick(
                                  res.href
                                )
                              }
                            />
                          )
                        }
                      )}

                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="bg-background fixed inset-0 z-40 flex h-screen w-screen flex-col justify-between overflow-y-auto px-8 py-24 md:hidden"
            >
              <div className="mt-8 flex flex-col space-y-2">

                {NAVIGATION_LINKS.map(
                  (link) =>
                    link.type ? (
                      <div
                        key={link.name}
                        className="border-b border-border/40 py-2"
                      >
                        <button
                          onClick={() =>
                            setActiveMobileAccordion(
                              (prev) =>
                                prev ===
                                link.type
                                  ? null
                                  : link.type!
                            )
                          }
                          className="font-serif text-foreground hover:text-primary flex w-full items-center justify-between py-2 text-left text-3xl font-medium"
                        >
                          <span>
                            {link.name}
                          </span>

                          <ChevronDown
                            size={28}
                            className={`transition-transform duration-300 ${
                              activeMobileAccordion ===
                              link.type
                                ? "rotate-180 text-primary"
                                : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {activeMobileAccordion ===
                            link.type && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                              }}
                              className="overflow-hidden pl-2"
                            >
                              <div className="flex flex-col space-y-4 py-4">

                                {/* Mobile Solutions */}
                                {link.type ===
                                  "solutions" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleLinkClick(
                                          "#formats"
                                        )
                                      }
                                      className="flex items-start space-x-4 text-left"
                                    >
                                      <FileCode
                                        size={20}
                                      />

                                      <span className="text-lg text-white">
                                        Document Formats
                                      </span>
                                    </button>

                                    {/* SCORM Viewer — crawlable sitelink destination */}
                                    <Link
                                      href="/scorm-viewer"
                                      onClick={() =>
                                        closeMenus()
                                      }
                                      className="flex items-start space-x-4 text-left"
                                    >
                                      <PlayCircle
                                        size={20}
                                      />

                                      <span className="text-lg text-white">
                                        SCORM Viewer
                                      </span>
                                    </Link>

                                    {/* Existing template navigation */}
                                    {INDUSTRIES.map(
                                      (ind) => {
                                        const Icon =
                                          ind.icon

                                        return (
                                          <button
                                            key={
                                              ind.id
                                            }
                                            onClick={() =>
                                              handleLinkClick(
                                                ind.href,
                                                ind.industryId
                                              )
                                            }
                                            className="flex items-start space-x-4 text-left"
                                          >
                                            <Icon
                                              size={
                                                20
                                              }
                                            />

                                            <span className="text-lg text-white">
                                              {
                                                ind.name
                                              }
                                            </span>
                                          </button>
                                        )
                                      }
                                    )}
                                  </>
                                )}

                                {/* Mobile Platform */}
                                {link.type ===
                                  "platform" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleLinkClick(
                                          "#walkthrough"
                                        )
                                      }
                                      className="flex items-start space-x-4 text-left"
                                    >
                                      <PlayCircle
                                        size={20}
                                      />

                                      <span className="text-lg text-white">
                                        App Walkthrough
                                      </span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleLinkClick(
                                          "#teams"
                                        )
                                      }
                                      className="flex items-start space-x-4 text-left"
                                    >
                                      <Users2
                                        size={20}
                                      />

                                      <span className="text-lg text-white">
                                        Teams Workflow
                                      </span>
                                    </button>
                                  </>
                                )}

                                {/* Mobile Resources */}
                                {link.type ===
                                  "resources" &&
                                  RESOURCES_LINKS.map(
                                    (res) => {
                                      const Icon =
                                        res.icon

                                      if (
                                        res.title ===
                                        "Terms & Conditions"
                                      ) {
                                        return (
                                          <Link
                                            key={
                                              res.title
                                            }
                                            href={
                                              res.href
                                            }
                                            onClick={() =>
                                              closeMenus()
                                            }
                                            className="flex items-start space-x-4 text-left"
                                          >
                                            <Icon
                                              size={
                                                20
                                              }
                                            />

                                            <span className="text-lg text-white">
                                              {
                                                res.title
                                              }
                                            </span>
                                          </Link>
                                        )
                                      }

                                      return (
                                        <button
                                          key={
                                            res.title
                                          }
                                          onClick={() =>
                                            handleLinkClick(
                                              res.href
                                            )
                                          }
                                          className="flex items-start space-x-4 text-left"
                                        >
                                          <Icon
                                            size={
                                              20
                                            }
                                          />

                                          <span className="text-lg text-white">
                                            {
                                              res.title
                                            }
                                          </span>
                                        </button>
                                      )
                                    }
                                  )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : link.name ===
                      "Pricing" ? (
                      <button
                        key={link.name}
                        onClick={() =>
                          handleLinkClick(
                            "#pricing"
                          )
                        }
                        className="font-serif text-foreground hover:text-primary border-b border-border/40 py-4 text-left text-3xl font-medium"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <button
                        key={link.name}
                        onClick={() =>
                          handleLinkClick(
                            link.href
                          )
                        }
                        className="font-serif text-foreground hover:text-primary border-b border-border/40 py-4 text-left text-3xl font-medium"
                      >
                        {link.name}
                      </button>
                    )
                )}
              </div>

              <div className="w-full pb-8 pt-6">
                <button
                  onClick={() => {
                    closeMenus()

                    window.open(
                      "/dashboard",
                      "_blank"
                    )
                  }}
                  className="w-full bg-white px-6 py-4 text-center text-xl font-medium text-black"
                >
                  Sign up for Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}