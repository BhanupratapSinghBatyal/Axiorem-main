"use client";

import React from 'react';

export default function PlansSkeleton() {
  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#212121] text-white font-sans antialiased py-6 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 min-h-0 pb-6">

        {/* Header Block */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 w-80 bg-[#3A3A3A] rounded-sm" />
            <div className="h-3 w-96 bg-[#3A3A3A] rounded-sm" />
          </div>
          <div className="h-7 w-20 bg-[#3A3A3A] rounded-sm" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full bg-[#3A3A3A] rounded-sm p-5 shadow-md space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-24 bg-slate-600 rounded-sm" />
                  {i === 1 && <div className="h-3.5 w-12 bg-slate-600 rounded-sm" />}
                </div>

                <div className="h-8 w-28 bg-slate-600 rounded-sm" />
                <div className="h-5 w-36 bg-slate-600 rounded-sm" />

                <div className="pt-4 border-t border-slate-600 space-y-3">
                  <div className="h-3 w-28 bg-slate-600 rounded-sm" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="h-3.5 w-3.5 bg-slate-600 rounded-sm shrink-0" />
                        <div className="h-3 w-full bg-slate-600 rounded-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-8 w-full bg-slate-600 rounded-sm mt-6" />
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-[#3A3A3A] rounded-sm overflow-hidden shadow-md">
          <div className="p-4 bg-[#212121] space-y-1.5">
            <div className="h-4 w-52 bg-[#3A3A3A] rounded-sm" />
            <div className="h-3 w-80 bg-[#3A3A3A] rounded-sm" />
          </div>
          <div className="p-4 space-y-3">
            <div className="h-4 w-full bg-slate-600 rounded-sm" />
            <div className="h-4 w-full bg-slate-600/60 rounded-sm" />
            <div className="h-4 w-full bg-slate-600/60 rounded-sm" />
            <div className="h-4 w-full bg-slate-600/60 rounded-sm" />
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#3A3A3A] rounded-sm p-4 flex items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-sm bg-[#212121] shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-28 bg-slate-600 rounded-sm" />
                  <div className="h-2.5 w-48 bg-slate-600 rounded-sm" />
                </div>
              </div>
              <div className="h-7 w-24 bg-slate-600 rounded-sm shrink-0" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-2 border-t border-slate-600 pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 w-48 bg-[#3A3A3A] rounded-sm mx-auto sm:mx-0" />
            ))}
          </div>
          <div className="h-12 w-full bg-[#3A3A3A] rounded-sm" />
        </div>

      </div>
    </div>
  );
}