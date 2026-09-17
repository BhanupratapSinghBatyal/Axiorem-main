import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export default function NewProjectDialog({ isOpen, onClose }) {
  const resetToNewDocument = useEditorStore((state) => state.resetToNewDocument);

  if (!isOpen) return null;

  const handleConfirmNewProject = async () => {
    resetToNewDocument();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-white antialiased">
      <div className="bg-[#3A3A3A] rounded-sm shadow-lg w-full max-w-sm overflow-hidden p-5 space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Create new project?</h3>
          <p className="text-[10px] text-slate-300 font-medium leading-relaxed uppercase tracking-wider">
            Creating a new project will discard all unsaved changes in the current project.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-slate-300 hover:bg-slate-600 rounded-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmNewProject}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm transition-colors cursor-pointer"
          >
            Create New Project
          </button>
        </div>
      </div>
    </div>
  );
}