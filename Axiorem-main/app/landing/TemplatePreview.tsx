"use client"

import { memo, useCallback, useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

type TemplateItem = {
  id: string
  title: string
  src: string
  alt: string
  description: string
}

type IndustryCategory = {
  id: string
  name: string
  templates: TemplateItem[]
}

/**
 * Shared template data.
 *
 * This remains the single source of truth for the homepage template
 * showcase. The same data can later be extracted into a shared data
 * file and reused by the dedicated /solutions/* SEO pages.
 */
export const INDUSTRY_DATA: IndustryCategory[] = [
  {
    id: "compliance",
    name: "Compliance",
    templates: [
      {
        id: "industry-audits",
        title: "Industry Audits & Operational Frameworks",
        src: "/get-started-templates/industry-audits.png",
        alt: "Industry Audits and Operational Frameworks template",
        description:
          "Converts ISO standards, operational audit documentation, and internal SOPs into structured compliance training, audit preparation guides, and assessment workflows.",
      },
      {
        id: "safety-manuals",
        title: "OSHA / Safety Manuals",
        src: "/get-started-templates/safety-manuals.png",
        alt: "OSHA and workplace safety manuals template",
        description:
          "Distills lengthy federal safety guidelines and dense compliance handbooks into clear, actionable daily field checklists.",
      },
    ],
  },
  {
    id: "esg",
    name: "ESG (Environmental, Social & Governance)",
    templates: [
      {
        id: "esg-initiatives",
        title: "ESG Initiatives",
        src: "/get-started-templates/esg-initiatives.png",
        alt: "Environmental, Social and Governance ESG initiatives template",
        description:
          "Transforms sustainability reports, ESG disclosures, environmental audits, and corporate governance documentation into executive sustainability briefings, policy training, and stakeholder-ready presentations.",
      },
    ],
  },
  {
    id: "fintech",
    name: "Fintech",
    templates: [
      {
        id: "api-docs",
        title: "Complex FinTech API Documentation",
        src: "/get-started-templates/api-docs.png",
        alt: "FinTech API documentation and developer training template",
        description:
          "Transforms financial API documentation, integration specifications, authentication flows, and webhook references into interactive developer onboarding, implementation guides, and integration training.",
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    templates: [
      {
        id: "hipaa-updates",
        title: "Annual HIPAA Policy Updates",
        src: "/get-started-templates/hipaa-updates.png",
        alt: "HIPAA policy updates and healthcare compliance training template",
        description:
          "Transforms HIPAA policies, patient privacy procedures, security standards, and regulatory updates into interactive compliance training, role-based learning, and healthcare privacy assessments.",
      },
    ],
  },
  {
    id: "hr",
    name: "Human Resources",
    templates: [
      {
        id: "employee-handbooks",
        title: "Employee Handbooks & Conduct Guidelines",
        src: "/get-started-templates/employee-handbooks.png",
        alt: "Employee handbooks and workplace conduct guidelines template",
        description:
          "Converts complex internal policies regarding information security, workplace conduct, and operational protocols into comprehensive presentation decks.",
      },
    ],
  },
  {
    id: "legal",
    name: "Legal",
    templates: [
      {
        id: "commercial-contracts",
        title: "M&A Term Sheets & Commercial Contracts",
        src: "/get-started-templates/commercial-contracts.png",
        alt: "M&A term sheets and commercial contracts template",
        description:
          "Transforms commercial agreements, procurement contracts, and M&A documentation into executive briefings, obligation summaries, approval workflows, and compliance learning modules.",
      },
    ],
  },
  {
    id: "strategy",
    name: "Corporate Strategy",
    templates: [
      {
        id: "growth-reports",
        title: "Quarterly Strategic Growth Reports",
        src: "/get-started-templates/growth-reports.png",
        alt: "Quarterly strategic growth reports template",
        description:
          "Transforms quarterly business reports, revenue metrics, product updates, and operational KPIs into executive business reviews, performance briefings, and strategic decision presentations.",
      },
    ],
  },
  {
    id: "supply-chain",
    name: "Supply Chain",
    templates: [
      {
        id: "supply-chain",
        title: "Global Supply Chain Procedures",
        src: "/get-started-templates/supply-chain.png",
        alt: "Global supply chain procedures and logistics training template",
        description:
          "Transforms procurement procedures, logistics documentation, supplier standards, and global shipping workflows into operational playbooks, team procedures, and supply chain training.",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical & Engineering",
    templates: [
      {
        id: "engineering-blueprints",
        title: "Technical Product Specs & Engineering Blueprints",
        src: "/get-started-templates/engineering-blueprints.png",
        alt: "Technical product specifications and engineering blueprints template",
        description:
          "Translates deeply technical manufacturing data, complex software code logic, and heavy equipment manuals into clear, step-by-step guides.",
      },
    ],
  },
]

type TemplateContentProps = {
  templates: TemplateItem[]
  industryId: string
}

const TemplateContent = memo(
  ({ templates, industryId }: TemplateContentProps) => {
    return (
      <div
        id={`template-content-${industryId}`}
        className="space-y-6 pb-8 pt-4"
      >
        {templates.map((tmpl) => (
          <article
            key={tmpl.id}
            className="grid grid-cols-1 items-center gap-6 rounded-xl border border-white/5 p-6 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <h3 className="font-serif text-lg font-medium text-[#e1edff] md:text-xl">
                {tmpl.title}
              </h3>

              <p className="mt-3 font-['Figtree'] text-xs leading-relaxed text-[#a3b8cc] sm:text-sm">
                {tmpl.description}
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={tmpl.src}
                  alt={tmpl.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    )
  }
)

TemplateContent.displayName = "TemplateContent"

type AccordionItemProps = {
  item: IndustryCategory
  isOpen: boolean
  onToggle: (id: string) => void
}

const AccordionItem = memo(
  ({ item, isOpen, onToggle }: AccordionItemProps) => {
    const handleClick = () => {
      onToggle(item.id)
    }

    const contentId = `template-content-${item.id}`

    return (
      <div
        id={`templates-${item.id}`}
        className="border-b border-white/10"
      >
        <button
          type="button"
          onClick={handleClick}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="flex w-full items-center justify-between py-6 text-left transition-colors duration-200 hover:text-[#e1edff]"
        >
          <h3 className="font-['Playwrite_Display',serif] text-2xl font-normal tracking-wide text-[#e1edff] sm:text-3xl md:text-4xl">
            {item.name}
          </h3>

          <div
            className={[
              "ml-4 flex h-8 w-8 shrink-0 items-center justify-center text-white/60",
              "transition-transform duration-[250ms]",
              "ease-[cubic-bezier(0.16,1,0.3,1)]",
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="overflow-hidden"
            >
              <TemplateContent
                templates={item.templates}
                industryId={item.id}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

AccordionItem.displayName = "AccordionItem"

export const TemplatePreview = () => {
  const [openId, setOpenId] =
    useState<string | null>(null)

  const toggleAccordion = useCallback(
    (id: string) => {
      setOpenId((current) =>
        current === id ? null : id
      )
    },
    []
  )

  useEffect(() => {
    const handleOpenAccordionEvent = (
      e: Event
    ) => {
      const customEvent =
        e as CustomEvent<{
          industryId?: string
        }>

      if (
        customEvent.detail?.industryId
      ) {
        setOpenId(
          customEvent.detail.industryId
        )
      }
    }

    window.addEventListener(
      "open-industry-accordion",
      handleOpenAccordionEvent as EventListener
    )

    return () => {
      window.removeEventListener(
        "open-industry-accordion",
        handleOpenAccordionEvent as EventListener
      )
    }
  }, [])

  return (
    <section
      id="templates"
      aria-labelledby="templates-heading"
      className="relative w-full bg-[#212121] px-4 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px]">

        <div className="mb-10 text-left md:mb-14">
          <h2
            id="templates-heading"
            className="font-serif text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-tight tracking-tight text-[#e1edff] drop-shadow-md"
          >
            Built for the Work You Already Do.
          </h2>

          <p className="mt-4 max-w-3xl font-['Figtree'] text-sm leading-relaxed text-[#a3b8cc] sm:text-base md:text-xl md:leading-relaxed">
            Choose a starting point designed around your documentation and workflow. From safety compliance to technical onboarding, start with a template that already understands the kind of outcome you&apos;re trying to create.
          </p>
        </div>

        <div className="mt-8 flex flex-col border-t border-white/10">
          {INDUSTRY_DATA.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={toggleAccordion}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default TemplatePreview