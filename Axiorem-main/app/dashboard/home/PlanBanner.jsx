// app/dashboard/home/PlanBanner.jsx
import React from 'react';
import { X, InfoIcon } from 'lucide-react';

export default function PlanBanner({ isFreePlan, onDismiss }) {
  if (!isFreePlan) return null;

  return (
    <div className="w-full bg-[#2A2A2A] border border-slate-700 rounded-sm p-4 flex items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-[#1b365d] text-white rounded-sm shrink-0">
          <InfoIcon className="h-4 w-4 stroke-[2]" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold tracking-wider text-white uppercase">
            Free Plan Limitations
          </h4>
          <p className="text-[11px] text-slate-300 leading-normal">
            Supercharge your workspace. Upgrade today to unlock advanced AI Workflows and seamless team collaboration.
          </p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-white p-1 rounded-sm transition-colors shrink-0"
        aria-label="Dismiss message"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
