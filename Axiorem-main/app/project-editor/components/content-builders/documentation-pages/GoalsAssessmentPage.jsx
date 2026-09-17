import React from 'react';
import { useDocumentationStore } from '../store/useDocumentationStore';

export default function GoalsAssessmentPage({ brandColor = "#1a688a" }) {
  const currentPageIndex = useDocumentationStore((s) => s.currentPageIndex);
  const pageTitle = useDocumentationStore((s) => s.pages[currentPageIndex]?.title || '');

  const {
    goalsAssessmentFormData = {},
    updateGoalsAssessmentFormData,
    setPageTitle
  } = useDocumentationStore();

  const handleUpdate = (key, value) => {
    updateGoalsAssessmentFormData(key, value);
    if (key === 'title') {
      setPageTitle(value);
    }
  };

  const titleVal = pageTitle || 'Goals Assessment Page Title';
  const descriptionVal = goalsAssessmentFormData.description || 'Some Description Text';
  const lowRatingVal = goalsAssessmentFormData.lowRating || 'Learned Little';
  const mediumRatingVal = goalsAssessmentFormData.mediumRating || 'Learned Something';
  const highRatingVal = goalsAssessmentFormData.highRating || 'Learned a Lot';
  const noGoalsTextVal = goalsAssessmentFormData.noGoalsText || 'No goals have been added for Project Goals yet.';
  const goalHeaderVal = goalsAssessmentFormData.goalHeader || 'Goals';
  const ratingHeaderVal = goalsAssessmentFormData.ratingHeader || 'Rating';

  return (
    <div className="w-full bg-white text-slate-800">
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
            Goals Assessment Page Title
          </div>
        </div>

        {/* Description Input */}
        <div className="w-full group/desc relative mt-1">
          <input
            type="text"
            value={descriptionVal}
            onChange={(e) => handleUpdate('description', e.target.value)}
            placeholder="Enter configuration description text..."
            className="w-full text-base font-normal text-slate-700 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 py-1 focus:outline-none transition-all placeholder:text-slate-300"
          />
          <div className="absolute -top-4 left-0 opacity-0 group-focus-within/desc:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            Description Workspace Block
          </div>
        </div>

        {/* Ratings Legend Container */}
        <div className="w-full flex items-center bg-[#f8f9fa] border-y border-slate-200 py-2.5 px-4 text-sm text-slate-800 gap-6 mt-1">
          <span className="font-semibold text-slate-500 text-xs tracking-wider uppercase select-none shrink-0">
            Possible Ratings
          </span>
          
          <div className="flex flex-wrap items-center gap-6 flex-1">
            {/* Low Rating */}
            <div className="flex items-center gap-1.5 group/low relative">
              <span className="text-amber-400 font-bold text-sm select-none">★</span>
              <input
                type="text"
                value={lowRatingVal}
                onChange={(e) => handleUpdate('lowRating', e.target.value)}
                placeholder="Low rating text..."
                className="bg-transparent font-medium text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-all pb-0.5"
                style={{ width: `${Math.max((lowRatingVal?.length || 0) * 8 + 16, 90)}px` }}
              />
              <div className="absolute -top-4 left-0 opacity-0 group-focus-within/low:opacity-100 transition-opacity text-[8px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
                Low Rating Constraints
              </div>
            </div>

            {/* Medium Rating */}
            <div className="flex items-center gap-1.5 group/medium relative">
              <span className="text-amber-400 font-bold text-sm select-none">★★</span>
              <input
                type="text"
                value={mediumRatingVal}
                onChange={(e) => handleUpdate('mediumRating', e.target.value)}
                placeholder="Medium rating text..."
                className="bg-transparent font-medium text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-all pb-0.5"
                style={{ width: `${Math.max((mediumRatingVal?.length || 0) * 8 + 16, 120)}px` }}
              />
              <div className="absolute -top-4 left-0 opacity-0 group-focus-within/medium:opacity-100 transition-opacity text-[8px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
                Medium Rating Constraints
              </div>
            </div>

            {/* High Rating */}
            <div className="flex items-center gap-1.5 group/high relative">
              <span className="text-amber-400 font-bold text-sm select-none">★★★</span>
              <input
                type="text"
                value={highRatingVal}
                onChange={(e) => handleUpdate('highRating', e.target.value)}
                placeholder="High rating text..."
                className="bg-transparent font-medium text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-all pb-0.5"
                style={{ width: `${Math.max((highRatingVal?.length || 0) * 8 + 16, 90)}px` }}
              />
              <div className="absolute -top-4 left-0 opacity-0 group-focus-within/high:opacity-100 transition-opacity text-[8px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
                High Rating Constraints
              </div>
            </div>
          </div>
        </div>

        {/* Table Representation */}
        <div className="w-full flex flex-col border border-slate-100 rounded-xl overflow-hidden mt-1">
          {/* Header Row */}
          <div className="w-full flex bg-[#f1f3f4] border-b border-slate-200 py-3 px-4 font-bold text-slate-900 text-sm">
            <div className="flex-[3] group/gh relative text-left">
              <input
                type="text"
                value={goalHeaderVal}
                onChange={(e) => handleUpdate('goalHeader', e.target.value)}
                placeholder="Goal header..."
                className="bg-transparent font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-all w-full"
              />
              <div className="absolute -top-4 left-0 opacity-0 group-focus-within/gh:opacity-100 transition-opacity text-[8px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
                Goal Section Header Label
              </div>
            </div>
            <div className="flex-[2] group/rh relative text-left pl-4">
              <input
                type="text"
                value={ratingHeaderVal}
                onChange={(e) => handleUpdate('ratingHeader', e.target.value)}
                placeholder="Rating header..."
                className="bg-transparent font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-all w-full"
              />
              <div className="absolute -top-4 left-4 opacity-0 group-focus-within/rh:opacity-100 transition-opacity text-[8px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
                Rating Column Header Label
              </div>
            </div>
          </div>

          {/* Content Rows */}
          <div className="w-full flex flex-col divide-y divide-slate-100 py-1">
            <div className="w-full flex py-3.5 px-4 text-sm text-slate-700 items-center">
              <div className="flex-[3] text-left">Added Goal 1 by the user in goals page</div>
              <div className="flex-[2] text-left pl-4 flex gap-0.5 text-xs text-amber-400 select-none">
                ★ ★ <span className="text-slate-200">★</span>
              </div>
            </div>
            <div className="w-full flex py-3.5 px-4 text-sm text-slate-700 items-center">
              <div className="flex-[3] text-left">Added Goal 2 by the user in goals page</div>
              <div className="flex-[2] text-left pl-4 flex gap-0.5 text-xs text-amber-400 select-none">
                ★ ★ ★
              </div>
            </div>
          </div>
        </div>

        {/* Fallback View */}
        <div className="w-full group/nogoal relative border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/40 mt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Fallback Empty State Preview
          </span>
          <textarea
            rows={1}
            value={noGoalsTextVal}
            onChange={(e) => handleUpdate('noGoalsText', e.target.value)}
            placeholder="Enter empty state fallback context..."
            className="w-full text-sm font-normal text-slate-400 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-white p-1 rounded focus:outline-none transition-all resize-none placeholder:text-slate-300"
          />
          <div className="absolute -top-4 left-0 opacity-0 group-focus-within/nogoal:opacity-100 transition-opacity text-[9px] font-black tracking-wider text-blue-500 uppercase pointer-events-none whitespace-nowrap">
            No Goals Fallback Context Label
          </div>
        </div>

      </div>
    </div>
  );
}