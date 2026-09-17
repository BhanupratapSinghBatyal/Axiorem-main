import { FolderOpen, ArrowRight } from "lucide-react"

export async function generateMetadata({ params, searchParams }) {
  const resolvedSearchParams = await searchParams

  const workspaceName =
    resolvedSearchParams?.name?.trim() || "Workspace"

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://axioremapp.com"

  const cleanBaseUrl = baseUrl.replace(/\/$/, "")

  const imageUrl =
    `${cleanBaseUrl}/og-image.png`

  const title =
    `Join ${workspaceName} on Axiorem`

  const description =
    `You've been invited to join and collaborate in ${workspaceName} on Axiorem.`

  return {
    title,

    description,

    metadataBase: new URL(cleanBaseUrl),

    robots: {
      index: false,
      follow: false,
    },

    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Axiorem",

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Invitation to join ${workspaceName} on Axiorem`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function WorkspaceInviteLanding({
  params,
  searchParams,
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const invitationToken = resolvedParams.id

  const targetWorkspace =
    resolvedSearchParams?.name || "Workspace"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm antialiased">
      <div className="relative flex w-full max-w-sm flex-col items-center space-y-5 rounded-sm border border-slate-700 bg-[#3A3A3A] p-6 text-center shadow-2xl">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#1b365d] text-white shadow-sm">
          <FolderOpen className="h-6 w-6 stroke-2" />
        </div>

        <div className="w-full space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace Invitation
          </span>

          <h1 className="w-full truncate text-base font-bold uppercase tracking-wider text-white">
            {targetWorkspace}
          </h1>
        </div>

        <p className="text-xs font-medium leading-relaxed text-slate-300">
          You've been invited to join and collaborate in this
          workspace. Accept to get started.
        </p>

        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#1b365d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-[#2a4a7a]"
        >
          <span>Accept Invitation</span>
          <ArrowRight className="h-4 w-4 stroke-2" />
        </button>

      </div>
    </div>
  )
}