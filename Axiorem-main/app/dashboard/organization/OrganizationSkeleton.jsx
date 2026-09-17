"use client";

import React from 'react';

export default function OrganizationSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#212121] antialiased text-white min-h-screen relative animate-pulse">
      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Header Block: Workspace Dropdown, Plan Badge & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-28 bg-[#3A3A3A] rounded-sm" />
              <div className="h-4 w-4 bg-[#3A3A3A] rounded-sm" />
            </div>
            <div className="h-4 w-20 bg-slate-700 rounded-sm" />
          </div>
          <div className="h-7 w-48 bg-[#3A3A3A] rounded-sm" />
        </div>

        {/* Tab Navigation Line */}
        <div className="border-b border-slate-700 pb-2">
          <div className="flex items-center gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <div className="h-3.5 w-16 bg-[#3A3A3A] rounded-sm" />
                <div className="h-3 w-4 bg-[#3A3A3A] rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Overview Row & Primary Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-[#3A3A3A] rounded-sm" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-40 bg-[#1b365d]/50 rounded-sm" />
            <div className="h-8 w-32 bg-red-900/30 rounded-sm border border-red-900/50" />
          </div>
        </div>

        {/* Micro Cards (Admins & Members count metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#3A3A3A] rounded-sm p-4 shadow-md flex items-center justify-between h-20">
            <div className="space-y-2">
              <div className="h-6 w-8 bg-slate-600 rounded-sm" />
              <div className="h-3 w-16 bg-slate-600 rounded-sm" />
            </div>
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-sm bg-slate-600 border-2 border-[#3A3A3A]" />
              <div className="w-6 h-6 rounded-sm bg-slate-600 border-2 border-[#3A3A3A]" />
            </div>
          </div>

          <div className="bg-[#3A3A3A] rounded-sm p-4 shadow-md flex items-center justify-between h-20">
            <div className="space-y-2">
              <div className="h-6 w-8 bg-slate-600 rounded-sm" />
              <div className="h-3 w-16 bg-slate-600 rounded-sm" />
            </div>
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-sm bg-slate-600 border-2 border-[#3A3A3A]" />
              <div className="w-6 h-6 rounded-sm bg-slate-600 border-2 border-[#3A3A3A]" />
              <div className="w-6 h-6 rounded-sm bg-slate-600 border-2 border-[#3A3A3A]" />
            </div>
          </div>
        </div>

        {/* Action Bar: Search Input, Filters & View Options */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          <div className="h-8 w-full lg:w-64 bg-[#3A3A3A] rounded-sm" />
          <div className="flex items-center gap-1.5 justify-end">
            <div className="h-8 w-20 bg-[#3A3A3A] rounded-sm" />
            <div className="h-8 w-20 bg-[#3A3A3A] rounded-sm" />
            <div className="h-8 w-32 bg-[#3A3A3A] rounded-sm" />
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden">
          <div className="p-4 bg-slate-700/40 border-b border-slate-600 flex items-center justify-between">
            <div className="h-3 w-full bg-slate-600/60 rounded-sm" />
          </div>
          <div className="divide-y divide-slate-600">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4 h-14">
                <div className="h-3.5 w-full bg-slate-600/40 rounded-sm" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}