"use client"

const footerLinks = {
  Product: [
    { label: "How It Works", href: "#process" },
    { label: "Platform", href: "#platform" },
    { label: "Document Formats", href: "#formats" },
    { label: "Pricing", href: "#pricing" },
  ],

  Solutions: [
    {
      label: "Compliance",
      href: "#templates",
      industryId: "compliance",
    },
    {
      label: "ESG",
      href: "#templates",
      industryId: "esg",
    },
    {
      label: "Fintech",
      href: "#templates",
      industryId: "fintech",
    },
    {
      label: "Healthcare",
      href: "#templates",
      industryId: "healthcare",
    },
    {
      label: "Human Resources",
      href: "#templates",
      industryId: "hr",
    },
    {
      label: "Legal",
      href: "#templates",
      industryId: "legal",
    },
    {
      label: "Corporate Strategy",
      href: "#templates",
      industryId: "strategy",
    },
    {
      label: "Supply Chain",
      href: "#templates",
      industryId: "supply-chain",
    },
    {
      label: "Technical & Engineering",
      href: "#templates",
      industryId: "technical",
    },
  ],
}

const contactLinks = [
  {
    label: "Support",
    email: "support@axioremapp.com",
  },
  {
    label: "Sales",
    email: "sales@axioremapp.com",
  },
]

export const Footer = () => {
  const handleNavigation = (href: string, industryId?: string) => {
    if (!href.startsWith("#")) {
      window.location.href = href
      return
    }

    const targetId = href.slice(1)

    const element =
      document.getElementById(targetId) ||
      document.getElementById("templates")

    if (element) {
      const lenis = (window as any).lenis

      if (lenis) {
        lenis.scrollTo(element, {
          offset: -80,
          duration: 1.2,
        })
      } else {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }

    if (industryId) {
      window.dispatchEvent(
        new CustomEvent("open-industry-accordion", {
          detail: { industryId },
        })
      )
    }

    window.history.pushState(null, "", href)
  }

  return (
    <footer className="relative w-full overflow-hidden bg-[#212121] pt-0 lg:px-8 lg:pt-20">
      {/* Main Footer */}
      <div className="relative z-10 mx-auto w-full bg-[#1b365d] px-6 py-10 sm:px-8 sm:py-12 lg:max-w-[1400px] lg:rounded-[2rem] lg:border lg:border-white/10 lg:px-12 lg:py-14 lg:shadow-2xl">
        {/* Main Content */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-16">
          {/* Brand Column */}
          <div className="max-w-sm">
            <button
              onClick={() => handleNavigation("#hero")}
              className="flex items-center gap-3"
            >
              <img
                src="/logo.png"
                alt="Axiorem"
                className="h-9 w-9 object-contain sm:h-10 sm:w-10"
              />

              <span
                className="text-2xl font-extrabold tracking-tight text-white"
                style={{
                  fontFamily: "Figtree",
                }}
              >
                Axiorem
              </span>
            </button>

            <p
              className="mt-5 max-w-xs text-sm leading-relaxed text-white/65 sm:mt-6"
              style={{
                fontFamily: "Figtree",
              }}
            >
              Transform complex documents into structured, interactive learning
              experiences your team can actually use.
            </p>
          </div>

          {/* Product and Solutions Navigation */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="text-sm font-semibold text-white"
                style={{
                  fontFamily: "Figtree",
                }}
              >
                {category}
              </h3>

              <div className="mt-4 flex flex-col gap-3 lg:mt-6 lg:gap-4">
                {links.map((link) => (
                  <button
                    key={link.label}
                    onClick={() =>
                      handleNavigation(link.href, 'industryId' in link ? link.industryId : undefined)
                    }
                    className="w-fit text-left text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    style={{
                      fontFamily: "Figtree",
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h3
              className="text-sm font-semibold text-white"
              style={{
                fontFamily: "Figtree",
              }}
            >
              Contact
            </h3>

            <div className="mt-4 flex flex-col gap-5 lg:mt-6">
              {contactLinks.map((contact) => (
                <div
                  key={contact.email}
                  className="flex flex-col gap-1"
                >
                  <span
                    className="text-xs font-medium uppercase tracking-wider text-white/40"
                    style={{
                      fontFamily: "Figtree",
                    }}
                  >
                    {contact.label}
                  </span>

                  <a
                    href={`mailto:${contact.email}`}
                    className="w-fit text-sm text-white/65 transition-colors duration-200 hover:text-white"
                    style={{
                      fontFamily: "Figtree",
                    }}
                  >
                    {contact.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-white/15 lg:my-10" />

        {/* Bottom Row */}
        <div
          className="flex flex-col gap-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between"
          style={{
            fontFamily: "Figtree",
          }}
        >
          <p>
            © {new Date().getFullYear()} Axiorem. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-6">
            <button
              onClick={() => handleNavigation("/privacy-policy")}
              className="transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </button>

            <button
              onClick={() =>
                handleNavigation("/terms-and-conditions")
              }
              className="transition-colors duration-200 hover:text-white"
            >
              Terms & Conditions
            </button>

            <button
              onClick={() =>
                handleNavigation("/cookie-and-data-policy")
              }
              className="transition-colors duration-200 hover:text-white"
            >
              Cookie & Data Policy
            </button>
          </div>
        </div>
      </div>

      {/* Large Background Wordmark — Desktop Only */}
      <div
        className="pointer-events-none relative z-0 mx-auto mt-[-1vw] hidden select-none overflow-hidden text-center font-extrabold leading-none tracking-[-0.08em] text-[#1b365d]/30 lg:block"
        style={{
          fontFamily: "Figtree",
          fontSize: "clamp(8rem, 23vw, 30rem)",
          marginBottom: "-3vw",
        }}
      >
        Axiorem
      </div>
    </footer>
  )
}