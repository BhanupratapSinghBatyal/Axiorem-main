import React from 'react';
import { X, Plus, Wand2 } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose, onCreateScratch, onCreateAI }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#2A2A2A] border border-slate-700 rounded-sm shadow-2xl p-6 relative space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">
            Create New Project
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-sm transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={onCreateScratch}
            className="w-full bg-[#3A3A3A] hover:bg-slate-700 text-left p-4 rounded-sm border border-transparent hover:border-slate-500 transition-all flex items-start gap-3.5 group"
          >
            <Plus className="w-4 h-4 stroke-[2] text-white shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold tracking-wider text-white uppercase group-hover:text-blue-200 transition-colors">
                Start from Scratch
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                Begin with a blank canvas. Build and organize your course structure, lessons, and content step by step.
              </p>
            </div>
          </button>

          <button
            onClick={onCreateAI}
            className="w-full bg-[#1b365d]/40 hover:bg-[#1b365d]/70 text-left p-4 rounded-sm border border-[#1b365d] transition-all flex items-start gap-3.5 group"
          >
            <Wand2 className="w-4 h-4 text-blue-300 shrink-0 mt-0.5 fill-blue-300/40" />
            <div>
              <h4 className="text-xs font-bold tracking-wider text-white uppercase group-hover:text-blue-200 transition-colors">
                Generate with AI
              </h4>
              <p className="text-[11px] text-slate-200 mt-1 leading-normal">
                Type in your topic or goal, and AI will automatically draft a complete course outline and content for you.
              </p>
            </div>
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-white/10 text-white font-medium text-[10px] tracking-wider uppercase px-4 py-2 rounded-sm border border-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}