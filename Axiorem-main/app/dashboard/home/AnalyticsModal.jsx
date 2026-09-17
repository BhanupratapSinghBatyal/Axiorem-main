// app/dashboard/home/AnalyticsModal.jsx

import React from "react";
import { X, Mail } from "lucide-react";

export default function AnalyticsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#2A2A2A]  rounded-sm shadow-2xl relative text-white antialiased overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-3.5 shrink-0 bg-[#212121]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
              Feature Coming Soon
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-sm transition-colors cursor-pointer"
            aria-label="Close analytics modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Split Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/60 items-stretch flex-1 bg-[#2A2A2A]">
          {/* LEFT SECTION - Full Bleed Image Container */}
          <div className="relative w-full h-full min-h-[260px] overflow-hidden bg-[#171717]">
            <img
              src="/elements/analytics_preview.png"
              alt="Analytics Preview"
              className="w-full h-full object-cover object-top opacity-90 transition-opacity hover:opacity-100"
              onError={(e) => {
                e.currentTarget.src = "/elements/analytics_preview.svg";
              }}
            />
          </div>

          {/* RIGHT SECTION - Content & Feature Roadmap */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-6 bg-[#2A2A2A]">
            <div className="space-y-4">
              

              <h3 className="text-base font-bold tracking-wider text-white uppercase leading-snug">
                Personal and Workspace Analytics coming soon
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                Soon you will be able to track:
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>Daily and monthly credit consumption</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>
                    Track credit consumption of members within your workspace{" "}
                    <strong className="text-slate-200 font-semibold">
                      (Admin and Owners only)
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>Your Content generation distributed by category</span>
                </li>
              </ul>
            </div>

            {/* Feature Request Footer */}
            <div className="border-t border-slate-700/60 pt-4 space-y-2">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                And a whole lot more. Drop us a mail for a feature request at:
              </p>
              <a
                href="mailto:support@axioremapp.com"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>support@axioremapp.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}