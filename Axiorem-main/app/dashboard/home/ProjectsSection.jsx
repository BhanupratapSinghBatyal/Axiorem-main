"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen, ArrowUpRight, MoreHorizontal, AlertCircle } from 'lucide-react';
import {useLibraryData} from '../../../hooks/useLibaryData';

function formatDate(value) {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ProjectsSection() {
  const router = useRouter();
  const { projects, isLoading, isError, error } = useLibraryData({
    activeTab: 'projects',
    page: 1,
    limit: 3,
  });

  const recentProjects = (projects || []).slice(0, 3);

  const handleNavigate = (id) => {
    router.push(`/project-editor?id=${encodeURIComponent(id)}`);
  };

  const handleViewAll = () => {
    router.push('/dashboard/library');
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">Recent Projects</h2>
          <p className="text-xs text-slate-300 hidden sm:block">
            Quick access to newly generated and modified Projects.
          </p>
        </div>
        <button
          onClick={handleViewAll}
          className="inline-flex items-center gap-1 text-xs font-medium text-white hover:bg-[#24477a] bg-[#1b365d] px-3 py-1.5 rounded-sm transition-colors shrink-0 uppercase tracking-wider cursor-pointer"
        >
          <span>View All</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-[#3A3A3A] rounded-sm p-4 h-24 flex items-start gap-3 shadow-md">
              <div className="h-4 w-4 bg-slate-600 rounded-sm shrink-0 mt-1" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-600 rounded-sm w-3/4" />
                <div className="h-2 bg-slate-600 rounded-sm w-1/2" />
                <div className="h-2 bg-slate-600 rounded-sm w-1/4 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 p-4 bg-[#3A3A3A] text-red-300 rounded-sm border border-red-500/20 text-xs uppercase tracking-wider font-semibold">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>{error || 'Failed to load recent projects'}</span>
        </div>
      ) : recentProjects.length === 0 ? (
        <div className="bg-[#3A3A3A] rounded-sm p-6 text-center text-xs text-slate-400 uppercase tracking-wider">
          No recent projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProjects.map((project) => {
            const updatedAt = project.updatedAt || project.updated_at || project.createdAt || project.created_at || project.date;
            const dateDisplay = formatDate(updatedAt);
            const sectionText = project.sectionCount !== undefined ? `${project.sectionCount} SECTIONS` : (project.type || 'PROJECT');

            return (
              <div
                key={project.id}
                onClick={() => handleNavigate(project.id)}
                className="bg-[#3A3A3A] shadow-md rounded-sm p-4 flex items-start gap-3 hover:bg-[#4E4E4E] border border-transparent hover:border-slate-600 transition-all group cursor-pointer relative"
              >
                <FolderOpen className="h-4 w-4 stroke-[2] text-white shrink-0 mt-1" />
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="font-semibold text-sm text-white truncate transition-colors">
                    {project.name || project.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{sectionText}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-2 tracking-wider uppercase">{dateDisplay}</p>
                </div>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-3 top-4 p-1 rounded-sm hover:bg-slate-600 text-slate-400 hover:text-slate-300 transition-colors sm:opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}