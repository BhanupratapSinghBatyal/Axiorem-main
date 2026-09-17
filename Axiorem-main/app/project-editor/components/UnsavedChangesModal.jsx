// src/app/project-editor/components/UnsavedChangesModal.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function UnsavedChangesModal({ isOpen, onConfirmLeave, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] text-white antialiased">
      <div className="bg-[#3A3A3A] rounded-sm shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-full">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Unsaved Changes
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              You have unsaved updates in your project.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-medium">
          Leaving this page now will discard all unsaved changes. Are you sure you want to proceed?
        </p>

        <div className="flex items-center justify-end gap-3 text-xs font-bold uppercase tracking-wider pt-2 border-t border-slate-600/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-300 hover:bg-slate-600 rounded-sm transition-colors cursor-pointer"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onConfirmLeave}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm transition-colors cursor-pointer shadow-md"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}