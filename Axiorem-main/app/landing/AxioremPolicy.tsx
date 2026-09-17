"use client"

import Image from "next/image"
import Link from "next/link"

export const AxioremPolicy = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#212121] px-6 py-24 md:px-8 md:py-32">
      {/* ==========================================================
          SECTION BACKGROUND
      ========================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <Image
          src="/landing/grid_bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.18]"
        />

        <div className="absolute inset-0 bg-[#212121]/70" />
      </div>

      {/* ==========================================================
          CREDIT POLICY CARD
      ========================================================== */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-5xl
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.08]
          shadow-[0_24px_80px_rgba(0,0,0,0.35)]
        "
      >
        {/* Card Background */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
        >
          <Image
            src="/landing/charge_card_bg.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover object-center"
          />
        </div>

        {/* Controlled darkening */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#080b10]/60"
        />

        {/* Directional depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35"
        />

        {/* ========================================================
            CONTENT
        ======================================================== */}
        <div
          className="
            relative
            z-10
            flex
            min-h-[480px]
            flex-col
            items-center
            justify-center
            px-6
            py-20
            text-center
            sm:px-12
            md:min-h-[620px]
            md:px-24
          "
        >
          <h2
            className="
              max-w-4xl
              font-serif
              text-[clamp(2.25rem,5vw,5.5rem)]
              font-medium
              leading-[1.02]
              tracking-tight
              text-[#e1edff]
            "
          >
            You Pay for the Outcome.
            <br />
            Not the AI Behind It.
          </h2>

          <p
            className="
              mt-7
              max-w-3xl
              font-['Figtree']
              text-base
              leading-relaxed
              text-[#b5c4d6]
              sm:text-lg
              md:mt-8
              md:text-xl
            "
          >
            Every action that consumes credits is clearly accounted for.
            Axiorem keeps your credit usage transparent, so you always know
            exactly what each completed outcome costs.
          </p>

          <p
            className="
              mt-5
              max-w-3xl
              font-['Figtree']
              text-sm
              leading-relaxed
              text-[#8fa3b8]
              sm:text-base
              md:text-lg
            "
          >
            Credits are deducted when you receive the result you asked for—not
            while Axiorem is processing, reasoning, or generating in the
            background.
          </p>

          <Link
            href="/onboarding"
            className="
              mt-10
              inline-flex
              items-center
              justify-center
              bg-white
              px-8
              py-4
              font-['Figtree']
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-[#212121]
              transition-opacity
              duration-200
              hover:opacity-90
            "
          >
            Create Your Workspace
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AxioremPolicy