"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, ArrowRight, AlertCircle } from "lucide-react";

const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
).replace(/\/$/, "");

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#212121]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="w-48 h-1 bg-[#3A3A3A] rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 w-1/3 bg-white rounded-full animate-indeterminate" />
        </div>
      </div>

      <style jsx>{`
        @keyframes indeterminate {
          0% {
            left: -35%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: -35%;
          }
        }
        .animate-indeterminate {
          animation: indeterminate 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

function ErrorPanel({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 antialiased">
      <div className="w-full max-w-sm bg-[#3A3A3A] border border-slate-700 rounded-sm p-6 shadow-md flex flex-col items-center text-center space-y-4">
        <div className="h-12 w-12 rounded-sm bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
          <AlertCircle className="h-6 w-6 stroke-2" />
        </div>

        <div className="space-y-1 w-full">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Invitation Error
          </span>
          <p className="text-xs text-slate-300 font-medium leading-relaxed break-words">
            {message || "Unable to process invitation link."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="w-full bg-[#1b365d] hover:bg-[#2a4a7a] text-white text-xs font-bold tracking-wider uppercase py-2.5 px-4 rounded-sm transition-colors shadow-md cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function InvitationAcceptContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const { data: previewData, isLoading, error: previewError } = useQuery({
    queryKey: ["invitation-preview", token],
    queryFn: async () => {
      if (!token) throw new Error("Invalid or missing invitation link.");
      const res = await fetch(
        `${BACKEND_BASE_URL}/api/v1/users/join/${token}/preview`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "This invitation is invalid or has expired.");
      }
      return data.payload;
    },
    enabled: !!token,
    retry: false,
  });

  const handleAccept = async () => {
    setIsSubmitting(true);
    setSubmissionError("");
    try {
      const acceptRes = await fetch(
        `${BACKEND_BASE_URL}/api/v1/users/invitations/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ token }),
        }
      );

      const acceptData = await acceptRes.json();
      if (!acceptRes.ok) {
        throw new Error(
          acceptData?.details ||
            acceptData?.error ||
            "Failed to accept invitation."
        );
      }

      const workspaceId =
        acceptData?.user?.lastAccessedWorkspaceId || previewData?.id;
      if (!workspaceId) {
        throw new Error("Target workspace details missing.");
      }

      const activeRes = await fetch(
        `${BACKEND_BASE_URL}/api/v1/users/active-workspace`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ workspaceId }),
        }
      );

      const activeData = await activeRes.json();
      if (!activeRes.ok) {
        throw new Error(
          activeData?.details ||
            activeData?.error ||
            "Failed to update active workspace."
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["user", "pending-invitations"],
      });
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });

      window.location.href = "/dashboard";
    } catch (err) {
      setSubmissionError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard";
  };

  if (!token) {
    return <ErrorPanel message="Invitation link is missing or invalid." />;
  }

  if (isLoading || isSubmitting) {
    return <LoadingScreen />;
  }

  if (previewError || submissionError) {
    return <ErrorPanel message={submissionError || previewError?.message} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 antialiased">
      <div className="w-full max-w-sm bg-[#3A3A3A] border border-slate-700 rounded-sm p-6 shadow-md flex flex-col items-center text-center space-y-5 relative">
        <div className="h-12 w-12 rounded-sm bg-[#1b365d] flex items-center justify-center text-white shrink-0 shadow-sm">
          <FolderOpen className="h-6 w-6 stroke-2" />
        </div>

        <div className="space-y-1 w-full">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Workspace Invitation
          </span>
          <h1 className="text-base font-bold text-white uppercase tracking-wider truncate w-full">
            {previewData?.name || "Workspace"}
          </h1>
          {previewData?.role && (
            <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm bg-slate-700 text-slate-300 mt-1">
              Role: {previewData.role}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          You've been invited to join and collaborate in this workspace. Accept to get started.
        </p>

        <div className="w-full space-y-2">
          <button
            type="button"
            onClick={handleAccept}
            className="w-full bg-[#1b365d] hover:bg-[#2a4a7a] text-white text-xs font-bold tracking-wider uppercase py-2.5 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Accept Invitation</span>
            <ArrowRight className="w-4 h-4 stroke-2" />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-transparent hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold tracking-wider uppercase py-2 px-4 rounded-sm transition-colors cursor-pointer"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InvitationAcceptPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <InvitationAcceptContent />
    </Suspense>
  );
}