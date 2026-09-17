// app/dashboard/home/ResourcePreviewModal.jsx

import React, { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";

const PREVIEW_IMAGES = [
  "/elements/resource_preview_1.png",
  "/elements/resource_preview_2.png",
];

export default function ResourcePreviewModal({ isOpen, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

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
            aria-label="Close resource preview modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Split Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/60 items-stretch flex-1 bg-[#2A2A2A]">
          {/* LEFT SECTION - Image Cross-Fade Transition */}
          <div className="relative w-full h-full min-h-[260px] overflow-hidden bg-[#171717]">
            {PREVIEW_IMAGES.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`Resource Preview ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-in-out ${
                  activeImageIndex === index ? "opacity-90 hover:opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onError={(e) => {
                  e.currentTarget.src = "/elements/analytics_preview.svg";
                }}
              />
            ))}
          </div>

          {/* RIGHT SECTION - Content & Feature Roadmap */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-6 bg-[#2A2A2A]">
            <div className="space-y-4">
              

              <h3 className="text-base font-bold tracking-wider text-white uppercase leading-snug">
                Resource upload and Sharing coming soon.
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                Resources will be your go-to section to upload and share data with members within your organization, which you can use as a knowledge base for your AI assistant to improve generation of content and stay in sync with your company's fast-paced compliance needs.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>Centralized organizational knowledge base</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>Enhanced AI context & compliance alignment</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>Seamless team-wide document distribution</span>
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