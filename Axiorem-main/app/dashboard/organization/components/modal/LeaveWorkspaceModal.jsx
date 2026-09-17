import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function LeaveWorkspaceModal({ isOpen, isProcessing, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in">
      <div className="bg-[#1E1E1E] border border-slate-800 p-8 rounded-sm w-full max-w-md shadow-2xl space-y-6">
        
        {/* Terminal Header Alert Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
            <h3 className="text-base font-bold uppercase tracking-wider">Leave Active Workspace</h3>
          </div>
          <div className="border-t border-slate-800 my-2" />
          <p className="text-sm text-slate-300 leading-relaxed uppercase tracking-wide">
            Are you absolute in your intent to sever access parameters for this workspace context? 
          </p>
          <div className="bg-red-950/20 border border-red-900/40 p-3 rounded-sm">
            <p className="text-xs text-red-400 font-medium uppercase tracking-wider leading-normal">
              Warning: Termination removes resource routing, structural data metrics visibility, and workspace operational privileges immediately.
            </p>
          </div>
        </div>

        {/* Action Triggers Grid */}
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
            className="flex-1 h-10 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm bg-red-950/40 border border-red-800 hover:bg-red-900 text-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing Severance...' : 'Confirm Severance'}
          </button>
        </div>
      </div>
    </div>
  );
}