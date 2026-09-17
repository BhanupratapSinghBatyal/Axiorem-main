import type { MetadataRoute } from "next"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://axioremapp.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/login/",
        "/signup/",
        "/onboarding/",
        "/api/",
      ],
    },

    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}