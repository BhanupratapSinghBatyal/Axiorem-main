
import type React from "react"
import type { Metadata } from "next"
import { Figtree, Inter, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import QueryProvider from "../providers/QueryProviders"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
})

const siteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://axioremapp.com"}`

const ogImage = {
  url: `${siteUrl}/og-image.png`,
  width: 1200,
  height: 630,
  alt: "Axiorem — AI SCORM Course Builder for Interactive Training",
}

export const metadata: Metadata = {
  title: "Axiorem: AI SCORM Course Builder for Interactive Training",

  description:
    "Create interactive, SCORM-compliant training from your documents with AI. Build quizzes, presentations, and engaging learning experiences, then deploy them to any LMS.",

  applicationName: "Axiorem",

  metadataBase: new URL(siteUrl),

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/icon.svg",
  },

  openGraph: {
    title: "Axiorem: AI SCORM Course Builder for Interactive Training",

    description:
      "Create interactive, SCORM-compliant training from your documents with AI. Build quizzes, presentations, and engaging learning experiences, then deploy them to any LMS.",

    type: "website",

    siteName: "Axiorem",

    url: siteUrl,

    images: [ogImage],
  },

  twitter: {
    card: "summary_large_image",

    title: "Axiorem: AI SCORM Course Builder for Interactive Training",

    description:
      "Create interactive, SCORM-compliant training from your documents with AI and deploy them to your LMS.",

    images: [ogImage.url],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        />
      </head>

      <body
        className={`${inter.variable} ${figtree.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <QueryProvider>
          {children}
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  )
}

