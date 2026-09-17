"use client"

import type { ElementType } from "react"
import {
  Sparkles,
  Cpu,
  FileText,
  Users,
  ShieldCheck,
  Layers,
  User,
  Building2,
  Lock,
  RefreshCw,
  Globe2,
} from "lucide-react"

type Plan = {
  id: "individual" | "teams" | "enterprise"
  icon: ElementType
  name: string
  tagline: string
  price: number | null
  featured?: boolean
  features: {
    icon: ElementType
    label: string
  }[]
  cta: string
}

type TrustItem = {
  icon: ElementType
  title: string
  description: string
}

const PLANS: readonly Plan[] = [
  {
    id: "individual",
    icon: User,
    name: "Individual",
    tagline: "For solo creators",
    price: 99,
    features: [
      {
        icon: Sparkles,
        label: "1,000 credits / month",
      },
      {
        icon: Cpu,
        label: "Access to all AI workflows",
      },
      {
        icon: FileText,
        label: "Export to SCORM",
      },
    ],
    cta: "Start building",
  },
  {
    id: "teams",
    icon: Users,
    name: "Teams",
    tagline: "For growing teams",
    price: 249,
    featured: true,
    features: [
      {
        icon: Sparkles,
        label: "5,000 pooled credits",
      },
      {
        icon: Users,
        label: "Up to 8 members per workspace",
      },
      {
        icon: Cpu,
        label: "Access to all AI workflows",
      },
      {
        icon: FileText,
        label: "Export to SCORM",
      },
    ],
    cta: "Start building",
  },
  {
    id: "enterprise",
    icon: Building2,
    name: "Enterprise",
    tagline: "For large organizations",
    price: null,
    features: [
      {
        icon: Sparkles,
        label: "Uncapped credit pool",
      },
      {
        icon: Users,
        label: "Uncapped workspace members",
      },
      {
        icon: ShieldCheck,
        label: "Custom SSO integration",
      },
      {
        icon: Layers,
        label: "Dedicated LMS integration support",
      },
    ],
    cta: "Contact sales",
  },
]

const TRUST_ITEMS: readonly TrustItem[] = [
  {
    icon: RefreshCw,
    title: "Flexible Subscriptions",
    description:
      "Pause, downgrade, or cancel your team seats instantly with zero long-term commitment.",
  },
  {
    icon: Lock,
    title: "Enterprise Isolation",
    description:
      "Your documents and proprietary training data are never retained or used for AI training.",
  },
  {
    icon: Globe2,
    title: "Regional Residency",
    description:
      "Configure data hosting boundaries aligned directly with US, EU, or local compliance rules.",
  },
]

function PricingCard({
  plan,
}: {
  plan: Plan
}) {
  const Icon = plan.icon

  const handleCtaClick = () => {
    if (plan.id === "enterprise") {
      window.location.href = "mailto:sales@axioremapp.com"
      return
    }

    window.location.href = "/onboarding"
  }

  return (
    <div
      className={[
        "group relative flex flex-col justify-between rounded-sm border p-7",
        "transition-[border-color,background-color,transform,box-shadow] duration-300",
        plan.featured
          ? [
              "border-[#4a7ab5]/40",
              "bg-[#2a2f3a]",
              "md:-translate-y-6",
              "md:shadow-[0_0_0_1px_rgba(74,122,181,0.2),0_20px_60px_-15px_rgba(0,0,0,0.6)]",
            ].join(" ")
          : "border-white/10 bg-[#262626] hover:border-white/20",
      ].join(" ")}
    >
      <div>
        <div className="flex items-center gap-2.5">
          <Icon
            className="h-4 w-4 text-[#a3b8cc]"
            strokeWidth={1.75}
          />

          <span className="font-['Figtree'] text-xs font-semibold uppercase tracking-wider text-[#a3b8cc]">
            {plan.name}
          </span>
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          {plan.price !== null ? (
            <>
              <span className="font-serif text-5xl font-medium tracking-tight text-[#e1edff]">
                ${plan.price}
              </span>

              <span className="font-['Figtree'] text-sm text-[#a3b8cc]">
                /mo
              </span>
            </>
          ) : (
            <span className="font-serif text-5xl font-medium tracking-tight text-[#e1edff]">
              Custom
            </span>
          )}
        </div>

        <p className="mt-1 font-['Figtree'] text-sm text-[#a3b8cc]">
          {plan.tagline}
        </p>

        <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
          {plan.features.map((feature) => {
            const FeatureIcon = feature.icon

            return (
              <div
                key={feature.label}
                className="flex items-start gap-3 font-['Figtree'] text-sm text-[#a3b8cc]"
              >
                <FeatureIcon
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#7fa8e0]"
                  strokeWidth={1.75}
                />

                <span>{feature.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCtaClick}
        className={[
          "mt-8 flex w-full items-center justify-center gap-2 rounded-sm border py-2.5",
          "font-['Figtree'] text-xs font-bold uppercase tracking-wider",
          "transition-[background-color,color,border-color] duration-200",
          plan.featured
            ? "border-transparent bg-[#e1edff] text-[#212121] hover:bg-white"
            : "border-white/20 bg-transparent text-[#e1edff] hover:bg-white/5",
        ].join(" ")}
      >
        {plan.cta}
      </button>
    </div>
  )
}

function TrustCard({
  item,
}: {
  item: TrustItem
}) {
  const Icon = item.icon

  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-[#262626] text-[#e1edff]">
        <Icon
          className="h-4 w-4 text-[#7fa8e0]"
          strokeWidth={1.75}
        />
      </div>

      <div>
        <h4 className="font-['Figtree'] text-sm font-semibold tracking-wide text-[#e1edff]">
          {item.title}
        </h4>

        <p className="mt-1 font-['Figtree'] text-sm leading-relaxed text-[#a3b8cc]">
          {item.description}
        </p>
      </div>
    </div>
  )
}

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden bg-[#212121] px-4 py-24 md:px-8 md:py-36"
    >
      {/* SECTION HEADER */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start gap-4 text-left">
          <span className="font-['Figtree'] text-xs font-semibold uppercase tracking-wider text-[#a3b8cc]/70 md:text-sm">
            Pricing
          </span>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[1.05] tracking-tight text-[#e1edff]">
            Pricing that scales with your workflow.
          </h2>

          <p className="max-w-2xl font-['Figtree'] text-base leading-relaxed text-[#a3b8cc] md:text-xl">
            Create content, automate tasks, and export course materials with
            plans designed for any scale — from a single creator to an entire
            organization.
          </p>
        </div>

        {/* BILLING CADENCE */}
        <div className="mt-10 inline-flex w-fit items-center gap-1 rounded-sm border border-white/10 bg-[#2a2a2a] px-4 py-1.5">
          <span className="font-['Figtree'] text-xs font-semibold uppercase tracking-wider text-[#e1edff]">
            Billed monthly
          </span>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="relative mx-auto mt-16 max-w-7xl">
        <svg
          className="pointer-events-none absolute inset-x-0 -top-8 hidden h-[420px] w-full md:block"
          viewBox="0 0 1200 420"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 100 320 L 500 200 L 900 60"
            stroke="url(#scaleLineGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          <circle
            cx="100"
            cy="320"
            r="3"
            fill="#a3b8cc"
            fillOpacity="0.5"
          />

          <circle
            cx="500"
            cy="200"
            r="3.5"
            fill="#e1edff"
          />

          <circle
            cx="900"
            cy="60"
            r="3"
            fill="#a3b8cc"
            fillOpacity="0.5"
          />

          <defs>
            <linearGradient
              id="scaleLineGradient"
              x1="0"
              y1="0"
              x2="1200"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#a3b8cc"
                stopOpacity="0.25"
              />

              <stop
                offset="50%"
                stopColor="#4a7ab5"
                stopOpacity="0.6"
              />

              <stop
                offset="100%"
                stopColor="#7fa8e0"
                stopOpacity="0.7"
              />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:items-end">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
            />
          ))}
        </div>
      </div>

      {/* TRUST / ASSURANCE */}
      <div className="mx-auto mt-24 max-w-7xl border-t border-white/10 pt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {TRUST_ITEMS.map((item) => (
            <TrustCard
              key={item.title}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing