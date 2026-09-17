"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, X } from 'lucide-react';

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

export default function InvitationInterceptModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: previewData, isLoading, error: previewError } = useQuery({
    queryKey: ['invitation-preview', token],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch(`${BACKEND_BASE_URL}/api/v1/users/join/${token}/preview`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch invitation details.');
      return data.payload;
    },
    enabled: !!token && !isDismissed,
    retry: false
  });

  const clearTokenParam = () => {
    setIsDismissed(true);
    router.replace('/dashboard');
  };

  const handleAccept = async () => {
    setIsSubmitting(true);
    setActionError('');
    try {
      const acceptRes = await fetch(`${BACKEND_BASE_URL}/api/v1/users/invitations/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token })
      });
      const acceptData = await acceptRes.json();
      if (!acceptRes.ok) throw new Error(acceptData?.error || 'Invitation acceptance failed.');

      const workspaceId = acceptData?.payload?.workspaceId || previewData?.id;
      if (!workspaceId) throw new Error('Workspace ID missing from server response.');

      const activeRes = await fetch(`${BACKEND_BASE_URL}/api/v1/users/active-workspace`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ workspaceId })
      });
      const activeData = await activeRes.json();
      if (!activeRes.ok) throw new Error(activeData?.error || 'Failed to switch workspace context.');

      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      await queryClient.invalidateQueries({ queryKey: ['current-user'] });

      window.location.href = `/dashboard/organization`;
    } catch (err) {
      setActionError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    clearTokenParam();
  };

  if (!token || isDismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#2A2A2A]  rounded-sm shadow-2xl p-6 relative space-y-6 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white stroke-[2]" />
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Workspace Invitation
            </h3>
          </div>
          <button 
            onClick={clearTokenParam}
            className="text-slate-400 hover:text-white p-1 rounded-sm transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Subtext */}
        <p className="text-[11px] text-slate-300 leading-normal">
          You have been invited to collaborate. Review the organization access details below before accepting.
        </p>

        {/* Content Display Area */}
        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-2.5">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Loading Invitation Details...
            </span>
          </div>
        ) : (previewError || actionError) ? (
          <div className="space-y-3">
            <p className="text-[11px] text-red-400 leading-relaxed">
              Error: {actionError || previewError?.message || "Could not process this invitation request."}
            </p>
            <div>
              <button 
                onClick={clearTokenParam} 
                className="bg-transparent hover:bg-white/10 text-white font-medium text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-sm border border-slate-600 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Metadata Parameters */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Organization
                </span>
                <h4 className="text-xs font-bold tracking-wider text-white uppercase truncate">
                  {previewData?.name || "Target Workspace"}
                </h4>
              </div>

              <div className="border-t border-slate-700/50 pt-3">
                <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Assigned Role
                </span>
                <span className="inline-flex items-center text-xs font-bold text-white uppercase tracking-wider mt-0.5">
                  {previewData?.role || "MEMBER"}
                </span>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting}
                className="bg-transparent hover:bg-white/10 text-white font-medium text-[10px] tracking-wider uppercase px-4 py-2 rounded-sm border border-slate-600 transition-colors disabled:opacity-50"
              >
                Decline
              </button>
              
              <button
                type="button"
                onClick={handleAccept}
                disabled={isSubmitting}
                className="bg-[#1b365d] hover:bg-[#24477a] text-white font-medium text-[10px] tracking-wider uppercase px-4 py-2 rounded-sm border border-[#1b365d] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Joining..." : "Accept Invitation"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}