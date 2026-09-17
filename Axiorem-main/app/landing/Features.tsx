"use client"

import { motion } from "framer-motion"

type FeatureCard = {
  id: string
  serialNumber: string
  title: string
  description: string
}

const features: FeatureCard[] = [
  {
    id: "1",
    serialNumber: "01",
    title: "Save 10+ Hours a Week",
    description: "Automate lesson planning, assessments, and study materials so teachers can focus on teaching, not paperwork."
  },
  {
    id: "2", 
    serialNumber: "02",
    title: "AI-Powered Chapter Summaries",
    description: "Instantly generate concise, structured chapter summaries to enhance lesson plans and student engagement."
  },
  {
    id: "3",
    serialNumber: "03", 
    title: "Auto-Generated Assessments",
    description: "Create quizzes, MCQs, and flashcards from study material in seconds—no more manual question-making."
  },
  {
    id: "4",
    serialNumber: "04",
    title: "Designed for Schools & Colleges", 
    description: "Custom-built for educational institutions, ensuring seamless adoption, integration, and impact."
  },
  {
    id: "5",
    serialNumber: "05",
    title: "Boost Teaching Efficiency",
    description: "Reduce time spent on admin tasks, improve content quality, and enhance student learning outcomes."
  },
  {
    id: "6",
    serialNumber: "06",
    title: "Customizable & Easy to Use",
    description: "Tailor AI-generated lesson plans and assessments to your teaching style with an intuitive interface."
  },
  {
    id: "7",
    serialNumber: "07",
    title: "Collaboration Dashboards",
    description: "Unlock teacher superpowers with dashboards to create vibrant spaces for teaming up, sharing ideas, and sparking teacher collaboration magic, made simple!"
  }
]

type FeaturesProps = {
  title?: string
  subtitle?: string
}

export const Features = ({ 
  title = "Powerful Features for Modern Education",
  subtitle = "Discover how Syllabai transforms teaching with AI-powered tools designed specifically for educators"
}: FeaturesProps) => {
  return (
    <section id="features" className="w-full py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-[40px] leading-tight font-normal text-[#202020] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
              fontWeight: "400",
            }}
          >
            {title}
          </h2>
          <p
            className="text-lg leading-7 text-[#666666] max-w-3xl mx-auto"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.6, 
                ease: "easeOut",
                delay: index * 0.1 
              }}
              className="group relative bg-white rounded-2xl border border-[#e5e5e5] p-8 hover:border-[#156d95]/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Serial Number */}
              <div className="mb-4">
                <span 
                  className="text-[18px] font-medium leading-none"
                  style={{
                    fontFamily: "var(--font-figtree), Figtree",
                    color: "#156d95",
                    opacity: 0.3
                  }}
                >
                  {feature.serialNumber}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3
                  className="text-[20px] leading-tight font-medium text-[#202020] group-hover:text-[#156d95] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-figtree), Figtree",
                    fontWeight: "500",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-[16px] leading-6 text-[#666666]"
                  style={{
                    fontFamily: "var(--font-figtree), Figtree",
                  }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-linear-to-br from-[#156d95]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
