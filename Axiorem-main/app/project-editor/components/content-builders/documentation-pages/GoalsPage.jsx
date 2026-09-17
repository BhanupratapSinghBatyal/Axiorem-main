import React from 'react';
import { Plus } from 'lucide-react';
import { useDocumentationStore } from '../store/useDocumentationStore';

export default function GoalsPage({ brandColor = "#1a688a" }) {
  const currentPageIndex = useDocumentationStore((s) => s.currentPageIndex);
  const pageTitle = useDocumentationStore((s) => s.pages[currentPageIndex]?.title || '');

  const {
    goalsFormData = {},
    updateGoalsFormData,
    setPageTitle
  } = useDocumentationStore();

  const handleUpdate = (key, value) => {
    updateGoalsFormData(key, value);
    if (key === 'title') {
      setPageTitle(value);
    }
  };

  const titleVal = pageTitle || 'Goals Page Title';
  const descriptionVal = goalsFormData.description || 'Add goals for your project work by pressing the button below. You should describe each goal in your own words. (Goals page description text)';
  const linkTextVal = goalsFormData.specifyBtnText || 'Add Goal';
  const placeholderVal = goalsFormData.placeholder || 'Some placeholder text inside input bar';
  const counterTextVal = goalsFormData.counterText || 'Goals Count:';

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-slate-800 bg-white">
      <div className="w-full flex flex-col gap-5 font-sans text-left">
        
        {/* Title Input */}
        <div className="w-full group/title relative">
          <input
            type="text"
            value={titleVal}
            onChange={(e) => handleUpdate('title', e.target.value)}
            placeholder="Enter layout title details..."
            className="w-full text-3xl font-bold tracking-tight bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 py-1 focus:outline-none transition-all placeholder:text-slate-300"
            style={{ color: brandColor }}
          />
          <div className="absolute -top-3.5 left-0 opacity-0 group-focus-within/title:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Goals Page Title Configuration
          </div>
        </div>

        {/* Description Input */}
        <div className="w-full group/desc relative mt-1">
          <textarea
            rows={2}
            value={descriptionVal}
            onChange={(e) => handleUpdate('description', e.target.value)}
            placeholder="Enter configuration description text..."
            className="w-full text-sm font-normal text-slate-700 bg-transparent border border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 p-1.5 rounded-lg focus:outline-none transition-all resize-none leading-relaxed placeholder:text-slate-300"
          />
          <div className="absolute -top-4 left-0 opacity-0 group-focus-within/desc:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Description Workspace Block
          </div>
        </div>

        {/* Define Goal Placeholder Input */}
        <div className="w-full flex items-center gap-2 mt-1 group/placeholder relative">
          <div className="flex-1 border border-slate-300 rounded-md bg-white shadow-xs px-3 py-2">
            <input
              type="text"
              value={placeholderVal}
              onChange={(e) => handleUpdate('placeholder', e.target.value)}
              placeholder="Enter clarifying text vector detail context..."
              className="w-full text-sm text-slate-400 bg-transparent focus:outline-none border-b border-transparent focus:border-blue-400 focus:text-slate-800 transition-all placeholder:text-slate-300"
            />
          </div>
          
          <div className="w-8 h-8 border border-red-700 bg-white rounded-md flex items-center justify-center shrink-0 shadow-xs select-none">
            <span className="text-red-600 font-medium text-sm">X</span>
          </div>
          <div className="absolute -top-4 left-0 opacity-0 group-focus-within/placeholder:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Define Goal Field Placeholder Text
          </div>
        </div>

        {/* Counter Input */}
        <div className="w-full flex items-center gap-1 mt-1 group/counter relative">
          <input
            type="text"
            value={counterTextVal}
            onChange={(e) => handleUpdate('counterText', e.target.value)}
            placeholder="e.g., Goals added:"
            className="text-sm font-normal text-slate-500 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 px-1 py-0.5 focus:outline-none transition-all placeholder:text-slate-300"
            style={{ width: `${Math.max(counterTextVal.length * 8, 90)}px` }}
          />
          <span className="text-sm font-normal text-slate-500 select-none">1</span>
          <div className="absolute -top-4 left-0 opacity-0 group-focus-within/counter:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Goals Added Counter Label Prefix
          </div>
        </div>

        {/* Button Text Input */}
        <div className="w-fit mt-1 group/btn relative">
          <div 
            className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded-md shadow-xs select-none transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <input
              type="text"
              value={linkTextVal}
              onChange={(e) => handleUpdate('specifyBtnText', e.target.value)}
              placeholder="e.g., Add New Goal"
              className="bg-transparent text-xs font-semibold text-white focus:outline-none border-b border-transparent focus:border-white/50 text-left placeholder:text-white/40"
              style={{ width: `${Math.max(linkTextVal.length * 7.5, 70)}px` }}
            />
          </div>
          <div className="absolute -top-4 left-0 opacity-0 group-focus-within/btn:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Add Goal Action Button Label Text
          </div>
        </div>

      </div>
    </div>
  );
}