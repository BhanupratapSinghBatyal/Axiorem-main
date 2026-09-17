import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Axiorem",

  description:
    "Read the Terms & Conditions governing access to and use of Axiorem, including its AI-powered SCORM course authoring platform, training tools, generated content, subscriptions, and related services.",

  alternates: {
    canonical: "/terms-and-conditions",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Terms & Conditions | Axiorem",

    description:
      "Read the Terms & Conditions governing access to and use of Axiorem, including its AI-powered SCORM course authoring platform, training tools, generated content, subscriptions, and related services.",

    type: "website",

    siteName: "Axiorem",
  },

  twitter: {
    card: "summary",

    title: "Terms & Conditions | Axiorem",

    description:
      "Terms governing access to and use of the Axiorem platform and related services.",
  },
}

export default function TermsAndConditionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}