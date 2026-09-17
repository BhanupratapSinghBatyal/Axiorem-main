"use client"

import { motion } from "framer-motion"
type IntegrationCarouselProps = {
  buttonText?: string
  buttonHref?: string
  title?: string
  subtitle?: string
}
// @component: IntegrationCarousel
export const IntegrationCarousel = ({
  buttonText = "Explore Workspaces",
  buttonHref = "#",
  title = "Create centralized hubs for curricular exchange.",
  subtitle = "Deploy collaborative workspaces where educators co-author curriculum and instantly distribute AI-optimized study resources across departments.",
}: IntegrationCarouselProps) => {
  // @return
  return (
    <div 
      className="w-full py-24 bg-white relative"
      style={{
        backgroundImage: "url(/landing/Collaboration_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "500px"
      }}
    >
      {/* Top fade overlay */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 z-5 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)"
        }}
      />
      
      {/* Bottom fade overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 z-5 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)"
        }}
      />
      
      <div className="max-w-170 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center mb-20"
        >
          <div className="flex flex-col items-center gap-4">
            <h2
              className="text-[28px] sm:text-[36px] lg:text-[48px] leading-tight font-bold text-white text-center tracking-tight mb-0 drop-shadow-lg"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontWeight: "700",
                fontSize: "28px",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
              }}
            >
              {title}
            </h2>
            <p
              className="text-base sm:text-lg leading-7 text-white text-center max-w-100 sm:max-w-125 mt-2 drop-shadow-md font-medium"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                fontWeight: "500"
              }}
            >
              {subtitle}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="flex gap-3 mt-6"
          >
            <a
              href={buttonHref}
              className="inline-block px-5 py-2.5 rounded-full bg-white/90 text-[#222222] text-[15px] font-medium leading-6 text-center whitespace-nowrap transition-all duration-300 ease-out w-45.5 cursor-pointer hover:bg-[#156d95] hover:text-white hover:shadow-xl hover:scale-105 backdrop-blur-sm transform"
              style={{
                boxShadow:
                  "0 -1px 0 0 rgba(255, 255, 255, 0.3) inset, -1px 0 0 0 rgba(255, 255, 255, 0.3) inset, 1px 0 0 0 rgba(255, 255, 255, 0.3) inset, 0 1px 0 0 rgba(255, 255, 255, 0.3) inset",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              {buttonText}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
