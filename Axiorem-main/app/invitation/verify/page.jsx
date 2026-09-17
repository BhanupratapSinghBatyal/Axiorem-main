"use client";

import React, { useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useVerifyInvitation } from "@/hooks/useVerifyInvitation";

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
            window.location.href = "/";
          }}
          className="w-full bg-[#1b365d] hover:bg-[#2a4a7a] text-white text-xs font-bold tracking-wider uppercase py-2.5 px-4 rounded-sm transition-colors shadow-md cursor-pointer"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

function InvitationVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated ?? true);

  const { data: invitation, isLoading, error, isError } = useVerifyInvitation(token);

  useEffect(() => {
    if (isLoading || !isHydrated) return;

    if (isError || !invitation) return;

    const workspaceName = invitation.workspaceName || invitation.name || "";
    const emailHint = invitation.email || "";

    if (!isAuthenticated) {
      const targetParams = new URLSearchParams({
        token: token,
        workspaceName: workspaceName,
        emailHint: emailHint,
      });

      router.replace(`/onboarding?${targetParams.toString()}`);
    } else {
      router.replace(`/invitation/accept?token=${encodeURIComponent(token)}`);
    }
  }, [isLoading, isHydrated, invitation, isError, isAuthenticated, token, router]);

  if (!token) {
    return <ErrorPanel message="Invitation link is missing or invalid." />;
  }

  if (isLoading || !isHydrated) {
    return <LoadingScreen />;
  }

  if (isError || error) {
    return (
      <ErrorPanel
        message={error?.message || "This invitation link is invalid or has expired."}
      />
    );
  }

  return <LoadingScreen />;
}

export default function InvitationVerifyPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <InvitationVerifyContent />
    </Suspense>
  );
}