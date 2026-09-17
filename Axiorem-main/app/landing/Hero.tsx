import BeamsWrapper from "./components/BeamsWrapper.js"
import { StickyHeroCard } from "./components/StickyHeroCard"
import { ProblemOverview } from "./ProblemOverview"

export const Hero = () => {
  return (
    <section className="relative w-full bg-[#212121]">
      {/* Background canvas rendered across all screen sizes */}
      <BeamsWrapper />

      <div className="relative w-full md:min-h-[360vh]">
        <StickyHeroCard />
        <ProblemOverview />
      </div>
    </section>
  )
}