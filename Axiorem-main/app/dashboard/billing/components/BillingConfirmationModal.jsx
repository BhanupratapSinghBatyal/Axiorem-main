import React from 'react';
import { AlertTriangle, Pause, Play, CreditCard, Loader2 } from 'lucide-react';

export default function BillingConfirmationModal({ 
  isOpen, 
  modalType, 
  isProcessing, 
  onClose, 
  onConfirm 
}) {
  if (!isOpen) return null;

  const modalConfigs = {
    PAUSE: {
      title: 'Pause Active Subscription',
      icon: <Pause className="h-5 w-5 text-amber-500 stroke-[2.5]" />,
      description: 'Are you sure you want to pause your current iteration loop? The billing run scheduled for next cycle will stand frozen.',
      warning: 'Warning: New projects or high-tier operations will lock once current credits are exhausted, until framework resumption.',
      actionText: 'Confirm Operational Pause',
      actionStyle: 'bg-amber-950/40 border border-amber-800 hover:bg-amber-900 text-amber-200'
    },
    RESUME: {
      title: 'Resume Subscription Pipeline',
      icon: <Play className="h-5 w-5 text-blue-500 stroke-[2.5]" />,
      description: 'Are you sure you want to resume standard execution parameters? Normal billing and allocations will reactivate.',
      warning: 'Notice: Immediate baseline billing cycles will be initialized if your regular slot schedule has expired.',
      actionText: 'Execute Plan Resumption',
      actionStyle: 'bg-[#1b365d] border border-blue-900 hover:bg-[#24477a] text-white'
    },
    CANCEL: {
      title: 'Terminate Plan Subscription',
      icon: <AlertTriangle className="h-5 w-5 text-red-500 stroke-[2.5]" />,
      description: 'Are you absolute in your intent to sever the workspace subscription framework? This configuration update cannot be undone.',
      warning: 'Critical Warning: Your system workspace context downgrades instantly to the baseline free tier on current period expiration.',
      actionText: 'Confirm Terminate Execution',
      actionStyle: 'bg-red-950/40 border border-red-800 hover:bg-red-900 text-red-200'
    },
    UPDATE_PAYMENT: {
      title: 'Modify Routing Gateway',
      icon: <CreditCard className="h-5 w-5 text-blue-500 stroke-[2.5]" />,
      description: 'Are you ready to clear active configuration loops and pass verification over to the secure Dodo Payments gateway handler?',
      warning: 'Notice: System will deploy the primary encryption matrix wrapper. Live operations are unaffected by payment route updates.',
      actionText: 'Deploy Secure Gateway',
      actionStyle: 'bg-[#1b365d] border border-blue-900 hover:bg-[#24477a] text-white'
    }
  };

  const current = modalConfigs[modalType];
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in">
      <div className="bg-[#1E1E1E] border border-slate-800 p-8 rounded-sm w-full max-w-md shadow-2xl space-y-6">
        
        {/* Modal Structure and Warning Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {current.icon}
            <h3 className="text-base font-bold uppercase tracking-wider text-white">{current.title}</h3>
          </div>
          <div className="border-t border-slate-800 my-2" />
          <p className="text-sm text-slate-300 leading-relaxed uppercase tracking-wide">
            {current.description}
          </p>
          <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-sm">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider leading-normal">
              {current.warning}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="border-t border-slate-800 pt-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 h-10 border border-slate-700 bg-transparent hover:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel Execution
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 h-10 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${current.actionStyle}`}
          >
            {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isProcessing ? 'Processing Lifecycle...' : current.actionText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}