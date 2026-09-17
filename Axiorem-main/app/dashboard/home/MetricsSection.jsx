// app/dashboard/home/MetricsSection.jsx
import React from 'react';
import { Users, FolderOpen, FileText } from 'lucide-react';

export default function MetricsSection({ metrics, isLoading }) {
  const DYNAMIC_METRICS = [
    {
      label: 'Active Members',
      value: isLoading ? '...' : metrics?.activeMembersCount ?? 0,
      icon: Users
    },
    {
      label: 'Total Projects',
      value: isLoading ? '...' : metrics?.totalProjectsCount ?? 0,
      icon: FolderOpen
    },
    {
      label: 'Resources Saved',
      value: isLoading ? '...' : metrics?.resourcesSavedCount ?? 0,
      icon: FileText
    },
  ];

  return (
    <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-6 pt-6 mt-6">
      {DYNAMIC_METRICS.map((metric, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row items-center sm:text-left gap-2 sm:gap-3">
          <div className="p-1 text-white shrink-0">
            <metric.icon className="h-4 w-4 stroke-[2]" />
          </div>
          <div className="space-y-0.5 min-w-0 w-full">
            <span className="block text-[10px] font-medium text-blue-200 uppercase tracking-wider truncate">
              {metric.label}
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-none">
              {metric.value}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}
