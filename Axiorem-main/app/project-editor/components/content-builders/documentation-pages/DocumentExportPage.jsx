'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { useDocumentationStore } from '../store/useDocumentationStore';

export default function DocumentExportPage({ brandColor = "#1a688a" }) {
  const [isMounted, setIsMounted] = useState(false);

  const currentPageIndex = useDocumentationStore((s) => s.currentPageIndex);
  const pageTitle = useDocumentationStore((s) => s.pages?.[currentPageIndex]?.title ?? '');

  const {
    documentExportFormData = {},
    updateDocumentExportFormData,
    setPageTitle
  } = useDocumentationStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpdate = (key, value) => {
    updateDocumentExportFormData(key, value);
    if (key === 'title') {
      setPageTitle(value);
    }
  };

  // Safe Fallback Resolution
  const titleVal = pageTitle || 'Document Export Profile';
  const descriptionVal = documentExportFormData.description ?? 'On this page you can choose to export specific modules into a single document layout template.';
  const createBtnTextVal = documentExportFormData.createBtnText ?? 'Create Document';
  const successLabelVal = documentExportFormData.successLabel ?? 'Document generated successfully.';
  const errorTextVal = documentExportFormData.errorText ?? 'Required structural input units are missing in @pages data arrays.';

  // Render static skeleton on SSR/First Pass to prevent Hydration Mismatch
  if (!isMounted) {
    return (
      <div className="w-full text-slate-800 bg-white pt-1">
        <div className="w-full flex flex-col gap-5 font-sans">
          <div className="h-8 w-1/2 bg-slate-100 rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-slate-50 rounded animate-pulse" />
          <div className="h-24 w-full bg-slate-50 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-800 bg-white relative pt-1">
      <div className="w-full flex flex-col gap-5 font-sans text-left">
        
        {/* 1. Document Page Title Input Node */}
        <div className="w-full group/title relative pr-44">
          <input
            type="text"
            value={titleVal}
            onChange={(e) => handleUpdate('title', e.target.value)}
            placeholder="Enter document layout title details..."
            className="w-full text-2xl font-bold tracking-tight bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 py-1 focus:outline-none transition-all placeholder:text-slate-300"
            style={{ color: brandColor }}
          />
          <div className="absolute -top-3.5 left-0 opacity-0 group-focus-within/title:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Title Context Label *
          </div>
        </div>

        {/* 2. Document Page Description Paragraph Input Node */}
        <div className="w-full group/desc relative mt-1">
          <input
            type="text"
            value={descriptionVal}
            onChange={(e) => handleUpdate('description', e.target.value)}
            placeholder="Enter export page dynamic intro content string..."
            className="w-full text-base font-normal text-slate-700 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 py-1 focus:outline-none transition-all placeholder:text-slate-300"
          />
          <div className="absolute -top-4 left-0 opacity-0 group-focus-within/desc:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Description Workspace Block
          </div>
        </div>

        {/* 3. Feedback Status States Area */}
        <div className="w-full flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200/60 rounded-xl mt-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">Feedback Status Banners</span>
          
          {/* Success Box */}
          <div className="w-full flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-lg p-3 group/success relative">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <input
              type="text"
              value={successLabelVal}
              onChange={(e) => handleUpdate('successLabel', e.target.value)}
              placeholder="Enter positive submission notification feedback message..."
              className="w-full bg-transparent font-medium text-emerald-800 text-sm border-b border-transparent hover:border-emerald-200 focus:border-emerald-500 focus:outline-none transition-all py-0.5"
            />
            <div className="absolute -top-4 left-0 opacity-0 group-focus-within/success:opacity-100 transition-opacity text-[8px] font-black tracking-wider text-emerald-600 uppercase pointer-events-none whitespace-nowrap">
              Submit Success Label *
            </div>
          </div>

          {/* Error Box */}
          <div className="w-full flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-lg p-3 group/error relative">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <input
              type="text"
              value={errorTextVal}
              onChange={(e) => handleUpdate('errorText', e.target.value)}
              placeholder="Enter required variable missing constraint feedback pattern..."
              className="w-full bg-transparent font-medium text-rose-800 text-sm border-b border-transparent hover:border-rose-200 focus:border-rose-500 focus:outline-none transition-all py-0.5"
            />
            <div className="absolute -top-4 left-0 opacity-0 group-focus-within/error:opacity-100 transition-opacity text-[8px] font-black tracking-wider text-rose-600 uppercase pointer-events-none whitespace-nowrap">
              Required Input Missing Text *
            </div>
          </div>
        </div>

        {/* 4. Action Modifiers */}
        <div className="group/create relative">
          <div 
            className="px-3 py-2 w-[50%] text-white rounded-lg transition-all shadow-sm flex items-center" 
            style={{ backgroundColor: brandColor }}
          >
            <input
              type="text"
              value={createBtnTextVal}
              onChange={(e) => handleUpdate('createBtnText', e.target.value)}
              placeholder="Create label..."
              className="bg-transparent font-bold text-xs text-white border-b border-transparent hover:border-blue-300 focus:border-white focus:outline-none text-left transition-all py-0.5 placeholder:text-blue-200"
              style={{ width: `${Math.max(createBtnTextVal.length * 6.8, 110)}px` }}
            />
          </div>
          <div className="absolute -top-4 left-0 opacity-0 group-focus-within/create:opacity-100 transition-opacity text-[8px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Create Document Button Label *
          </div>
        </div>

      </div>
    </div>
  );
}