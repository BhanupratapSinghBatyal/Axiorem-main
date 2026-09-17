import React, { useEffect, useState, useMemo } from 'react';
import { Trash2, Plus, ChevronLeft, ChevronRight, GripHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { useDocumentationStore } from './store/useDocumentationStore';
import { useEditorStore } from '../../store/useEditorStore';
import StandardPage from './documentation-pages/StandardPage';
import GoalsPage from './documentation-pages/GoalsPage';
import GoalsAssessmentPage from './documentation-pages/GoalsAssessmentPage';
import DocumentExportPage from './documentation-pages/DocumentExportPage';

const PAGE_COMPONENTS = {
  standard: StandardPage,
  goals: GoalsPage,
  goals_assessment: GoalsAssessmentPage,
  document_export: DocumentExportPage,
};

export default function DocumentationBuilder({ sectionId, brandColor = "#1a688a" }) {
  const [isMounted, setIsMounted] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const {
    sectionTitle,
    setSectionTitle,
    headline,
    setHeadline,
    pages = [],
    currentPageIndex,
    setCurrentPageIndex,
    addPageInstance,
    deletePageInstance,
    navigatePrevious,
    navigateNext,
    updateCurrentPageType,
    reorderPages,
    initializeFromEditor
  } = useDocumentationStore();

  const sections = useEditorStore((state) => state.sections) || [];
  const setActiveSectionId = useEditorStore((state) => state.setActiveSectionId);

  // Determine global section bounds
  const currentSectionIndex = useMemo(
    () => sections.findIndex((s) => s.id === sectionId),
    [sections, sectionId]
  );

  const prevSection = useMemo(
    () => (currentSectionIndex > 0 ? sections[currentSectionIndex - 1] : null),
    [sections, currentSectionIndex]
  );

  const nextSection = useMemo(
    () => (currentSectionIndex !== -1 && currentSectionIndex < sections.length - 1 ? sections[currentSectionIndex + 1] : null),
    [sections, currentSectionIndex]
  );

  const isFirstPage = currentPageIndex === 0;
  const isLastPage = pages.length > 0 && currentPageIndex === pages.length - 1;

  useEffect(() => {
    setIsMounted(true);
    if (sectionId) {
      initializeFromEditor(sectionId);
    }
  }, [sectionId, initializeFromEditor]);

  const handleDragStart = (e, idx) => {
    e.dataTransfer.setData('text/plain', idx.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(idx);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    reorderPages(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const handleDeletePage = (idx, e) => {
    e.stopPropagation();
    deletePageInstance(idx);
  };

  const handlePrevSection = () => {
    if (prevSection) {
      setActiveSectionId(prevSection.id);
    }
  };

  const handleNextSection = () => {
    if (nextSection) {
      setActiveSectionId(nextSection.id);
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full h-[720px] bg-white border border-slate-200 rounded-sm shadow-lg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];
  const ActiveComponent = currentPage ? PAGE_COMPONENTS[currentPage.type] : null;

  return (
    <div className="w-full h-[720px] flex bg-white border border-slate-200 rounded-sm shadow-lg overflow-hidden select-none font-sans">
      
      {/* Left Navigation Sidepane */}
      <div className="w-80 h-full bg-[#f4f5f7] border-r border-slate-200 flex flex-col p-8 shrink-0 overflow-y-auto">
        <div className="w-full flex flex-col gap-8">
          
          {/* Section Title Input Block */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-fit border-b-[3px] pb-1 transition-colors focus-within:border-slate-800" style={{ borderColor: brandColor }}>
              <input
                type="text"
                value={sectionTitle || ''}
                onChange={(e) => setSectionTitle(sectionId, e.target.value)}
                placeholder="Title"
                className="w-full text-3xl font-black tracking-tight bg-transparent text-slate-900 focus:outline-none placeholder:text-slate-300"
              />
            </div>
            <input
              type="text"
              value={headline || ''}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Module Subheading Description..."
              className="w-full text-xs font-semibold text-slate-400 bg-transparent focus:outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Timeline Node Hierarchy Container */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Structure Nodes</span>
              <button
                type="button"
                onClick={addPageInstance}
                className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Add Page Section"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Dynamic Canvas Route Selector Switcher */}
            {currentPage && (
              <div className="w-full flex flex-col gap-1.5 mb-2">
                <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Current Node Type</label>
                <select
                  value={currentPage.type}
                  onChange={(e) => updateCurrentPageType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-[4px] text-xs font-bold text-slate-700 px-2.5 py-1.5 focus:outline-none focus:border-slate-400 transition-colors cursor-pointer capitalize shadow-sm"
                >
                  <option value="standard">Standard Framework</option>
                  <option value="goals">Project Goals</option>
                  <option value="goals_assessment">Metrics Evaluation</option>
                  <option value="document_export">Data Output Terminal</option>
                </select>
              </div>
            )}

            {/* Vertical Timeline Stack */}
            <div className="w-full relative flex flex-col gap-6 pl-2">
              {pages.length > 1 && (
                <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-slate-200/70" />
              )}

              {pages.map((page, idx) => {
                const isActive = idx === currentPageIndex;
                const nodeKey = page.id || `node-${idx}`;

                return (
                  <div
                    key={nodeKey}
                    onClick={() => setCurrentPageIndex(idx)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`w-full flex items-center justify-between group relative pl-8 cursor-pointer transition-opacity ${
                      draggedIndex === idx ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    {/* Visual Node Dot Terminal Indicator */}
                    <div 
                      className={`absolute left-0 w-3 h-3 rounded-full transition-all flex items-center justify-center ${
                        isActive 
                          ? 'border-[3px] bg-white w-[14px] h-[14px] -left-[1px] shadow-xs' 
                          : 'bg-slate-300 group-hover:bg-slate-400'
                      }`}
                      style={{ borderColor: isActive ? brandColor : 'transparent' }}
                    />

                    {/* Node Text & Controls Component */}
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                      <GripHorizontal className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
                      <span className={`text-sm tracking-wide truncate transition-colors ${
                        isActive ? 'font-bold text-slate-900' : 'font-medium text-slate-500 hover:text-slate-800'
                      }`}>
                        {page.title || `${page.type.replace('_', ' ')} Page Title`}
                      </span>
                    </div>

                    {pages.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeletePage(idx, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Core Content Viewport Canvas Area */}
      <div className="flex-1 h-full bg-white flex flex-col justify-between p-12 relative overflow-y-auto">
        <div className="w-full flex-1">
          {ActiveComponent ? <ActiveComponent key={currentPage.id} brandColor={brandColor} /> : null}
        </div>

        {/* Multi-Node Stepper Navigation Controls */}
        <div className="mt-2.5 justify-end flex items-center gap-2">
          {isFirstPage && (
            <button
              type="button"
              disabled={!prevSection}
              onClick={handlePrevSection}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 h-10 rounded-full text-xs font-bold text-white shadow-md disabled:opacity-20 transition-all cursor-pointer enabled:hover:scale-105"
              style={{ backgroundColor: brandColor }}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Previous Section
            </button>
          )}

          <button
            type="button"
            onClick={navigatePrevious}
            disabled={currentPageIndex === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-20 transition-all shadow-md cursor-pointer enabled:hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={navigateNext}
            disabled={currentPageIndex === pages.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-20 transition-all shadow-md cursor-pointer enabled:hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {isLastPage && (
            <button
              type="button"
              disabled={!nextSection}
              onClick={handleNextSection}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 h-10 rounded-full text-xs font-bold text-white shadow-md disabled:opacity-20 transition-all cursor-pointer enabled:hover:scale-105"
              style={{ backgroundColor: brandColor }}
            >
              Next Section <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}