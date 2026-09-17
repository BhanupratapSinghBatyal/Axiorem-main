"use client";

import React from 'react';
import { FolderOpen, FileText, Plus, X } from 'lucide-react';

export default function EmptyState({ activeTab, searchQuery, onClearSearch }) {
  const isSearchActive = Boolean(searchQuery && searchQuery.trim() !== '');

  return (
    <div className="relative w-full rounded-sm py-20 px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md text-center">
        <div className="mb-6 p-4 rounded-sm bg-[#3A3A3A] border border-slate-600 shadow-xl flex items-center justify-center">
          {activeTab === 'projects' ? (
            <FolderOpen className="h-10 w-10 text-slate-300 stroke-[1.5]" />
          ) : (
            <FileText className="h-10 w-10 text-slate-300 stroke-[1.5]" />
          )}
        </div>

        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          {isSearchActive ? `No ${activeTab} found` : `No ${activeTab} yet`}
        </h3>

        <p className="text-xs text-slate-400 uppercase tracking-wider leading-relaxed mb-8">
          {isSearchActive ? (
            <>Your search <span className="text-white font-semibold">"{searchQuery}"</span> did not match any {activeTab}.</>
          ) : (
            <>Get started by creating your first {activeTab === 'projects' ? 'project' : 'resource'} in this workspace.</>
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          {isSearchActive && (
            <button
              onClick={onClearSearch}
              className="px-4 py-2.5 rounded-sm bg-[#3A3A3A] hover:bg-slate-600 border border-slate-600 text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          )}

          <button
            onClick={() => window.open(activeTab === 'projects' ? '/project-editor' : '', '_blank')}
            className="px-5 py-2.5 rounded-sm bg-[#1b365d] hover:bg-[#2a4a7a] text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4 stroke-2" />
            <span>New {activeTab === 'projects' ? 'Project' : 'Resource'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}