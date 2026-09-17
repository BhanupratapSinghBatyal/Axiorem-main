"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function RedirectingModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#3A3A3A] border border-slate-600 rounded-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <h3 className="text-lg font-bold uppercase tracking-wider text-white">Redirecting to Payment Provider</h3>
          <p className="text-sm text-slate-300 text-center">
            Please wait while we redirect you to our secure payment provider.
          </p>
        </div>
      </div>
    </div>
  );
}