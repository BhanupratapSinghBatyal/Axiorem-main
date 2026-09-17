"use client";

import React from 'react';

export default function BillingSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#212121] text-white antialiased animate-pulse">
      <div className="w-full space-y-6">

        {/* Header */}
        <header className="space-y-2">
          <div className="h-6 w-32 bg-[#3A3A3A] rounded-sm" />
          <div className="h-3 w-80 sm:w-96 bg-[#3A3A3A] rounded-sm" />
        </header>

        {/* Plan Overview Section */}
        <section className="space-y-4">
          <div className="h-4 w-32 bg-[#3A3A3A] rounded-sm" />

          <div className="bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-slate-600 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-600 rounded-sm" />
                <div className="h-4 w-32 bg-slate-600 rounded-sm" />
                <div className="h-3 w-56 bg-slate-600 rounded-sm" />
              </div>
              <div className="h-8 w-28 bg-slate-600 rounded-sm" />
            </div>

            {/* Middle row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#3A3A3A]">
              <div className="space-y-2">
                <div className="h-3 w-28 bg-slate-600 rounded-sm" />
                <div className="h-4 w-20 bg-slate-600 rounded-sm" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-600 rounded-sm" />
                <div className="h-4 w-24 bg-slate-600 rounded-sm" />
              </div>
            </div>

            {/* Bottom action row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-[#252525] border-t border-slate-600 gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-36 bg-slate-600 rounded-sm" />
                <div className="h-3 w-3/4 bg-slate-600 rounded-sm" />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="h-7 w-32 bg-slate-600 rounded-sm" />
                <div className="h-7 w-32 bg-slate-600 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Banner notification block */}
          <div className="h-10 w-full bg-[#1b365d]/50 rounded-sm" />
        </section>

        {/* Payment Method Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1">
            <div className="h-4 w-36 bg-[#3A3A3A] rounded-sm" />
            <div className="h-3 w-64 bg-[#3A3A3A] rounded-sm" />
          </div>

          <div className="bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-slate-600 gap-4">
              <div className="flex items-center gap-4">
                <div className="h-3 w-24 bg-slate-600 rounded-sm" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-slate-600 rounded-sm" />
                  <div className="h-3 w-32 bg-slate-600 rounded-sm" />
                </div>
              </div>
              <div className="h-8 w-36 bg-slate-600 rounded-sm" />
            </div>

            <div className="p-5 flex items-center gap-4 max-w-xl">
              <div className="h-3 w-24 bg-slate-600 rounded-sm shrink-0" />
              <div className="h-8 w-full bg-[#212121] rounded-sm border border-slate-600" />
            </div>
          </div>
        </section>

        {/* Billing History Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="h-4 w-32 bg-[#3A3A3A] rounded-sm" />
            <div className="flex items-center gap-2">
              <div className="h-7 w-24 bg-[#3A3A3A] rounded-sm" />
              <div className="h-7 w-20 bg-[#3A3A3A] rounded-sm" />
            </div>
          </div>

          <div className="bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden">
            <div className="p-4 bg-slate-700/40 border-b border-slate-600 flex items-center justify-between">
              <div className="h-3 w-full bg-slate-600/60 rounded-sm" />
            </div>
            <div className="divide-y divide-slate-600">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-4">
                  <div className="h-3.5 w-full bg-slate-600/40 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700">
          <div className="h-3 w-64 bg-[#3A3A3A] rounded-sm" />
          <div className="h-3 w-80 bg-[#3A3A3A] rounded-sm" />
        </footer>

      </div>
    </div>
  );
}