"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen, FileText, Share2, Upload } from 'lucide-react';

export default function EmptyState({ activeTab = 'Projects', searchQuery, onClearSearch }) {
  const router = useRouter();
  const isSearchActive = Boolean(searchQuery && searchQuery.trim() !== '');
  const isProjects = activeTab.toLowerCase() === 'projects';

  const handleAction = () => {
    router.push('/dashboard/library');
  };

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
        {/* Icon Container */}
        <div className="mb-6 p-4 rounded-sm bg-[#3A3A3A] border border-slate-600 shadow-xl flex items-center justify-center">
          {isProjects ? (
            <FolderOpen className="h-10 w-10 text-slate-300 stroke-[1.5]" />
          ) : (
            <FileText className="h-10 w-10 text-slate-300 stroke-[1.5]" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          {isSearchActive 
            ? `No shared ${activeTab.toLowerCase()} match search` 
            : `No shared ${activeTab.toLowerCase()} in organization`}
        </h3>

        {/* Messaging */}
        <p className="text-xs text-slate-400 uppercase tracking-wider leading-relaxed mb-8">
          {isSearchActive ? (
            <>Your search <span className="text-white font-semibold">"{searchQuery}"</span> did not return any shared {activeTab.toLowerCase()}.</>
          ) : isProjects ? (
            <>Start collaborating with your team. Create projects in your personal library and share them with the organization.</>
          ) : (
            <>Empower your workspace. Upload resources to your library and share them here to begin collaborating.</>
          )}
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          {isSearchActive && (
            <button
              type="button"
              onClick={onClearSearch}
              className="px-4 py-2.5 rounded-sm bg-[#3A3A3A] hover:bg-slate-600 border border-slate-600 text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Clear Search</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAction}
            className="px-5 py-2.5 rounded-sm bg-[#1b365d] hover:bg-[#2a4a7a] text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md"
          >
            {isProjects ? (
              <>
                <Share2 className="w-4 h-4 stroke-2" />
                <span>Go to Library to Share</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 stroke-2" />
                <span>Go to Library to Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}