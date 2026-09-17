"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink } from "lucide-react"
type CaseStudy = {
  id: string
  company: string
  logo: React.ReactNode
  title: string
  features: string[]
  quote: string
  attribution: string
  accentColor: string
  source?: string
  cards: {
    type: "lesson-planning" | "grading" | "content-creation" | "student-engagement" | "productivity" | "analytics"
    delay: number
    zIndex: number
  }[]
}
const caseStudies: CaseStudy[] = [
  {
    id: "notion",
    company: "Clandestine",
        logo: (
          <img 
            src="/landing/The_74_logo.png" 
            alt="Syllabai Logo"
            height="48"
            width="38"
            style={{ objectFit: 'contain' }}
          />
        ),
    title: "How 2 Teachers Use AI Behind the Scenes to Build Lessons & Save Time.",
    features: ["AI Lesson Planning", "Automated Grading", "Content Generation"],
    quote: "Classroom preparation goes from hours to seconds.",
    attribution: "Jean D’Aurio, Teacher, John Street School",
    accentColor: "#16b364",
    source: "https://www.the74million.org/article/case-study-how-2-teachers-use-ai-behind-the-scenes-to-build-lessons-save-time/",
    cards: [
      {
        type: "analytics",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "analytics",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
  {
    id: "cloudwatch",
    company: "Cloudwatch",
    logo: (
      <img 
        src="/landing/Arxiv_logo.png" 
        alt="Syllabai Logo"
        height="48"
        width="38"
        style={{ objectFit: 'contain' }}
      />
    ),
    title: "Teacher-AI Collaboration for Curating and Customizing Lesson Plans in Low-Resource Schools",
    features: ["AI Analytics", "Automated Grading", "Student Engagement Tools"],
    quote: "Our findings revealed critical insights regarding how teachers generated and engaged with the AI-generated LPs.",
    attribution: "Research @ Cornell University,Ithaca, USA",
    accentColor: "#3b82f6",
    source:"https://arxiv.org/html/2507.00456v1",
    cards: [
      {
        type: "analytics",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "analytics",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
  {
    id: "eightball",
    company: "EightBall",
    logo: (
      <img 
        src="/landing/Goodreads_logo.png" 
        alt="Syllabai Logo"
        height="48"
        width="38"
        style={{ objectFit: 'contain' }}
      />
    ),
    title: "AI for Educators: Learning Strategies, Teacher Efficiencies, and a Vision for an Artificial Intelligence Future",
    features: ["AI Analytics", "Student Engagement Tracking"],
    quote: "In the end, if using AI tools cuts your planning time from 30 minutes to 18 minutes—or your grading time from 40 minutes to 22—that extra time it creates is yours.",
    attribution: " Matt Miller,Author",
    accentColor: "#0A0D12",
    source: "https://www.goodreads.com/work/quotes/144643542-ai-for-educators-learning-strategies-teacher-efficiencies-and-a-visio",
    cards: [
      {
        type: "analytics",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "analytics",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
  {
    id: "coreos",
    company: "CoreOS",
    logo: (
      <img 
        src="/landing/Connecta_logo.png" 
        alt="Syllabai Logo"
        height="48"
        width="38"
        style={{ objectFit: 'contain' }}
      />
    ),
    title: "Academic success stories of Tec professors were presented during the second AI Day.",
    features: ["AI Content Creation", "Productivity Tools"],
    quote: "AI helps generate questions aligned with learning objectives quickly.",
    attribution: "Jorge Cruz Ángeles, Professor, Tec de Monterrey",
    source:"https://conecta.tec.mx/en/news/national/education/six-success-stories-tec-professors-applying-artificial-intelligence",
    accentColor: "#155eef",
    cards: [
      {
        type: "student-engagement",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "student-engagement",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
]
const FeatureBadge = ({
  name,
}: {
  name: string
}) => {
  const getIcon = (featureName: string) => {
    if (featureName.includes("Lesson Planning")) {
      return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50">
          <path
            d="M2 2C2 1.44772 1.55228 1 1 1C1.55228 1 2 1.44772 2 2V6C2 6.55228 1.55228 7 1 7C1.55228 7 1 6.55228 1 6V2Z"
            fill="#E01E5A"
          />
          <path d="M10 2C10.5523 2 11 1.55228 11 1C11 4.44772 10.5523 4 10 4H6V6H10Z" fill="#36C5F0" />
          <path d="M14 5C14 4.44772 13.5523 4 13 4C12.4477 4 12 4.44772 12 5V9C12 9.55228 12.4477 10 13 10C13.5523 10 14 9.55228 14 9V5Z" fill="#2EB67D" />
          <path d="M6 10C5.44772 10 5 10.4477 5 11C5 11.5523 5.44772 12 6 12H10V10H6Z" fill="#ECB22E" />
        </svg>
      )
    } else if (featureName.includes("Grading")) {
      return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50">
          <path
            d="M2 4C2 3.44772 2.44772 3 3 3H9C9.55228 3 10 3.44772 10 4V10C10 10.55228 9.55228 11 9 11H3C2.44772 11 2 10.55228 2 10V4Z"
            fill="#10B981"
          />
          <path d="M10 5L13 3V11L10 9" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    } else if (featureName.includes("Content")) {
      return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50">
          <path
            d="M4 2C4 1.44772 3.44772 1 4 1C4.44772 1 5 1.44772 5 2V6C5 6.55228 4.44772 7 4 7C4.44772 7 4 6.55228 4 6V2Z"
            fill="#E01E5A"
          />
          <path d="M12 2C12.5523 2 13 1.55228 13 1C13 4.44772 12.4477 4 12 4H6V6H12Z" fill="#36C5F0" />
          <path d="M14 5C14 4.44772 13.5523 4 13 4C12.4477 4 12 4.44772 12 5V9C12 9.55228 12.4477 10 13 10C13.5523 10 14 9.55228 14 9V5Z" fill="#2EB67D" />
        </svg>
      )
    } else if (featureName.includes("Engagement")) {
      return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50">
          <path d="M3 9L5 11L8 8L13 13" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 5H13M3 5V13M13 5V13M3 13H13" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    } else if (featureName.includes("Productivity")) {
      return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50">
          <path d="M2 4C2 3.44772 2.44772 3 3 3H9C9.55228 3 10 3.44772 10 4V10C10 10.55228 9.55228 11 9 11H3C2.44772 11 2 10.55228 2 10V4Z" fill="#10B981" />
          <path d="M10 5L13 3V11L10 9" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    } else if (featureName.includes("Analytics")) {
      return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50">
          <path d="M2 2C2 1.44772 1.55228 1 1 1C1.55228 1 2 1.44772 2 2V6C2 6.55228 1.55228 7 1 7C1.55228 7 1 6.55228 1 6V2Z" fill="#E01E5A" />
          <path d="M10 2C10.5523 2 11 1.55228 11 1C11 4.44772 10.5523 4 10 4H6V6H10Z" fill="#36C5F0" />
          <path d="M14 5C14 4.44772 13.5523 4 13 4C12.4477 4 12 4.44772 12 5V9C12 9.55228 12.4477 10 13 10C13.5523 10 14 9.55228 14 9V5Z" fill="#2EB67D" />
        </svg>
      )
    }
    return null
  }
  return (
    <div className="flex items-center gap-2 bg-white/75 shadow-sm border border-black/5 rounded-lg px-2 py-1 text-sm font-medium text-foreground">
      {getIcon(name)}
      {name}
    </div>
  )
}
const SlackCallCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    null
  )
}
const MeetingTranscriptCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    null
  )
}
const SentimentReportCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return null
}
const NotionCollaborationCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        delay,
      }}
      className="absolute w-70 sm:w-[320px] lg:w-95 rounded-xl p-4 sm:p-6 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        filter: "drop-shadow(0 4px 6px rgba(30, 30, 44, 0.15))",
        transform: "translate(-120px, -60px) sm:translate(-160px, -70px) lg:translate(-200px, -80px)",
        zIndex,
      }}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Lesson Planning</h4>
          <span className="text-xs text-muted-foreground">AI-Powered</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-foreground">Time Saved</span>
            </div>
            <span className="text-sm font-semibold text-green-600">10+ hrs/week</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-foreground">Lesson Quality</span>
            </div>
            <span className="text-sm font-semibold text-blue-600">95%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm text-foreground">Student Engagement</span>
            </div>
            <span className="text-sm font-semibold text-purple-600">92%</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">50+</span> AI-generated lessons
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const StripeGlobalCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        delay,
      }}
      className="absolute w-75 sm:w-85 lg:w-100 rounded-xl p-4 sm:p-6 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        filter: "drop-shadow(0 4px 6px rgba(30, 30, 44, 0.15))",
        transform: "translate(-100px, -40px) sm:translate(-140px, -50px) lg:translate(-180px, -60px)",
        zIndex,
      }}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Student Performance</h4>
          <span className="text-xs text-muted-foreground">This Month</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">A+</div>
            <div className="text-xs text-muted-foreground mt-1">Grade Average</div>
            <div className="text-xs font-semibold text-green-600 mt-2">Excellent</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">95%</div>
            <div className="text-xs text-muted-foreground mt-1">Assignment Rate</div>
            <div className="text-xs font-semibold text-blue-600 mt-2">High</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">85%</div>
            <div className="text-xs text-muted-foreground mt-1">Test Scores</div>
            <div className="text-xs font-semibold text-purple-600 mt-2">Improved</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Learning outcomes</span>
            <span className="font-semibold text-foreground">+42%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "87%", backgroundColor: accentColor }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const FigmaSprintCard = ({
  accentColor,
  delay,
  zIndex,
}: {
  accentColor: string
  delay: number
  zIndex: number
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        delay,
      }}
      className="absolute w-70 sm:w-[320px] lg:w-95 rounded-xl p-4 sm:p-6 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        filter: "drop-shadow(0 4px 6px rgba(30, 30, 44, 0.15))",
        transform: "translate(-110px, -50px) sm:translate(-150px, -60px) lg:translate(-190px, -70px)",
        zIndex,
      }}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: accentColor }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M8 2L12 6L8 10L4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 14L12 10L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Assessment Creation</h4>
              <p className="text-xs text-muted-foreground">Week 3 • Day 2</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Quiz generation speed</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "94%" }} />
              </div>
              <span className="text-xs font-semibold text-foreground">94%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Student participation</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "89%" }} />
              </div>
              <span className="text-xs font-semibold text-foreground">89%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-foreground">Content accuracy</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-green-600">Excellent</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Assessments created</span>
            <span className="font-semibold text-foreground">25</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const CaseStudiesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const currentStudy = caseStudies[currentIndex]
  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 5000)
  }
  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }
  }
  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }
    return () => stopAutoPlay()
  }, [isAutoPlaying, currentIndex])
  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % caseStudies.length)
  }
  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)
  }
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }
  return (
    <div
      id="case-studies"
      className="w-full min-h-screen  bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center py-24 px-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-7xl w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1
            className="text-[40px] leading-tight font-normal text-foreground mb-6 tracking-tight"
            style={{
              fontWeight: "400",
              fontFamily: "var(--font-figtree), Figtree",
              fontSize: "40px",
            }}
          >
            Case Studies
          </h1>
          <p
            className="text-lg leading-7 text-muted-foreground max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-figtree), Figtree",
            }}
          >
            Analyze how forward-thinking institutions leverage AI to automate pedagogical overhead and optimize institutional learning outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStudy.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                }}
                className="space-y-6"
              >
                <div className="text-foreground/60">{currentStudy.logo}</div>

                <div className="flex items-center gap-3">
                  <h2
                    className="text-4xl font-bold text-foreground leading-tight tracking-tight"
                    style={{
                      fontFamily: "var(--font-figtree), Figtree",
                      fontWeight: "400",
                      fontSize: "32px",
                    }}
                  >
                    {currentStudy.title}
                  </h2>
                  {currentStudy.source && (
                    <a
                      href={currentStudy.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      title="Read full case study"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentStudy.features.map((feature, idx) => (
                    <FeatureBadge key={idx} name={feature} />
                  ))}
                </div>

                <blockquote className="border-l-4 border-primary pl-6 py-2">
                  <p
                    className="text-lg leading-7 text-foreground/80 italic mb-3"
                    style={{
                      fontFamily: "var(--font-figtree), Figtree",
                    }}
                  >
                    "{currentStudy.quote}"
                  </p>
                  <footer
                    className="text-sm text-muted-foreground"
                    style={{
                      fontFamily: "var(--font-inter), Inter",
                    }}
                  >
                    {currentStudy.attribution}
                  </footer>
                </blockquote>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                {caseStudies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  aria-label="Previous slide"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M12.5 15L7.5 10L12.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  aria-label="Next slide"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Card Visualization */}
          <div className="relative h-125 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStudy.id}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {currentStudy.id === "notion" && (
                  <>
                    <NotionCollaborationCard accentColor={currentStudy.accentColor} delay={0} zIndex={1} />
                    <SlackCallCard accentColor={currentStudy.accentColor} delay={0.1} zIndex={2} />
                  </>
                )}
                {currentStudy.id === "cloudwatch" && (
                  <>
                    <StripeGlobalCard accentColor={currentStudy.accentColor} delay={0} zIndex={1} />
                    <SlackCallCard accentColor={currentStudy.accentColor} delay={0.1} zIndex={2} />
                  </>
                )}
                {currentStudy.id === "eightball" && (
                  <>
                    <MeetingTranscriptCard accentColor={currentStudy.accentColor} delay={0} zIndex={1} />
                    <NotionCollaborationCard accentColor={currentStudy.accentColor} delay={0.1} zIndex={2} />
                  </>
                )}
                {currentStudy.id === "coreos" && (
                  <>
                    <FigmaSprintCard accentColor={currentStudy.accentColor} delay={0} zIndex={1} />
                    <MeetingTranscriptCard accentColor={currentStudy.accentColor} delay={0.1} zIndex={2} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
