// app/dashboard/home/DashboardHeader.jsx
import React from 'react';
import { Plus } from 'lucide-react';
import MetricsSection from './MetricsSection';

export default function DashboardHeader({ workspaceName, onCreateProject, metrics, isLoading }) {
  return (
    <section className="w-full rounded-sm relative overflow-hidden p-6 sm:p-8 md:p-10 min-h-[200px] flex flex-col justify-between">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img
          src="/backgrounds/grid_background.png"
          alt="Grid Infrastructure Overlay"
          className="w-full h-full object-cover opacity-100"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.parentElement) {
              e.currentTarget.parentElement.style.backgroundImage = 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)';
              e.currentTarget.parentElement.style.backgroundSize = '32px 32px';
            }
          }}
        />
      </div>
      
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="max-w-xl space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase min-h-[1.75rem]">
            {workspaceName}
          </h1>
          {/* <p className="text-xs font-normal text-blue-100 leading-relaxed max-w-md sm:max-w-none">
            Central orchestration hub for institutional assets, instructional programs, and collaborative workflows.
          </p> */}
        </div>
        
        <button
          onClick={onCreateProject}
          className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-medium text-xs px-4 py-2 rounded-sm transition-colors flex items-center justify-center sm:justify-start gap-1.5 shrink-0 border border-white"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span className="uppercase tracking-wider">New Project</span>
        </button>
      </div>
      
      <MetricsSection metrics={metrics} isLoading={isLoading} />
    </section>
  );
}
