import type { Metadata } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://axioremapp.com"

export const metadata: Metadata = {
  title: "Online SCORM Viewer | SCORM 1.2 Course Player | Axiorem",

  description:
    "View and test SCORM 1.2 courses online with Axiorem's SCORM Viewer. Upload a SCORM package, preview its content, and share a course link without installing an LMS.",

  alternates: {
    canonical: `${siteUrl}/scorm-viewer`,
  },

  openGraph: {
    title: "Online SCORM Viewer | SCORM 1.2 Course Player | Axiorem",

    description:
      "Upload, view, and test SCORM 1.2 courses online. Preview SCORM packages and share course links with Axiorem.",

    url: `${siteUrl}/scorm-viewer`,

    siteName: "Axiorem",

    type: "website",

    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Axiorem Online SCORM Viewer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Online SCORM Viewer | SCORM 1.2 Course Player | Axiorem",

    description:
      "Upload, view, and test SCORM 1.2 courses online with Axiorem.",

    images: [`${siteUrl}/og-image.png`],
  },
}

export default function ScormViewerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}