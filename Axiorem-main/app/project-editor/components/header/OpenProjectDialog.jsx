import React from 'react';
import { X } from 'lucide-react';

/**
 * TODO: Integration Phase
 * Replace placeholderProjects with data from useProjects() / useLoadProject().
 * Workflow execution flow:
 * 1. Fetch target project payload by ID via React Query mutation/query.
 * 2. Deserialize payload via deserializeEditorDocument().
 * 3. Invoke loadDocument() on the editor store.
 * 4. Close dialog and notify session state.
 */
export default function OpenProjectDialog({ isOpen, onClose }) {
  if (!isOpen) return null;

  const placeholderProjects = [
    { id: "proj-1", name: "Midterm Evaluation: Advanced Data Structures", date: "May 14, 2026" },
    { id: "proj-2", name: "Quiz 3: Systems Engineering & Design Architecture", date: "Jun 02, 2026" },
    { id: "proj-3", name: "Comprehensive Diagnostics Baseline Assessment", date: "Jun 05, 2026" }
  ];

  const handleOpenProject = async (projectId) => {
    // Temporary stub until useLoadProject hook pipeline is bound
    console.log(`[OpenProjectDialog] Invoking project load for ID: ${projectId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-white antialiased">
      <div className="bg-[#3A3A3A] rounded-sm shadow-lg w-full max-w-md overflow-hidden flex flex-col max-h-[400px]">
        {/* Header */}
        <div className="p-4 border-b border-slate-600 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Open Project</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-sm hover:bg-slate-600 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Picker List */}
        <div className="flex-1 overflow-y-auto p-2">
          {placeholderProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOpenProject(project.id)}
              className="w-full p-2.5 rounded-sm hover:bg-slate-600 text-left cursor-pointer transition-colors group flex items-center justify-between"
            >
              <div className="flex flex-col min-w-0 pr-2 uppercase tracking-wider">
                <span className="text-xs font-semibold text-white truncate">{project.name}</span>
                <span className="text-[9px] text-slate-400 font-medium mt-0.5">Modified {project.date}</span>
              </div>
              <span className="text-[9px] bg-slate-700 px-2 py-0.5 rounded-sm text-slate-300 font-bold tracking-wider uppercase group-hover:bg-[#1b365d] group-hover:text-white transition-colors shrink-0">
                Load Project
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-600 bg-[#212121] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-[#3A3A3A] rounded-sm text-[10px] font-bold uppercase tracking-wider text-white hover:bg-slate-600 cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}