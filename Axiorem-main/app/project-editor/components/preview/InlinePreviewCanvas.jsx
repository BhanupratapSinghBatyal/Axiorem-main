'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useCoursePresentationStore } from '../content-builders/store/useCoursePresentationStore';
import CoverPageView from './templates/CoverPageView';
import AccordionPageView from './templates/AccordionPageView';
import InformationWallView from './templates/InformationWallView';
import InteractiveQuizzView from './templates/InteractiveQuizzView';
import DocumentationToolView from './templates/DocumentationToolView';
import CoursePresentationView from './templates/CoursePresentationView';
import { SourceTooltipProvider } from './SourceTooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PREVIEW_MAP = {
  cover_page: CoverPageView,
  'root-cover-page': CoverPageView,
  accordion: AccordionPageView,
  information_wall: InformationWallView,
  documentation: DocumentationToolView,
  quiz: InteractiveQuizzView,
  course_presentation: CoursePresentationView,
};

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

export default function InlinePreviewCanvas() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const isPreviewModeActive = useEditorStore((state) => state.isPreviewModeActive);
  const sections = useEditorStore((state) => state.sections) || [];
  const activeSectionId = useEditorStore((state) => state.activeSectionId);
  const setActiveSectionId = useEditorStore((state) => state.setActiveSectionId);
  const globalBrandColor = useEditorStore((state) => state.brandColor);
  const candidateInstructions = useEditorStore((state) => state.candidateInstructions);

  const initializeCoursePresentationStore = useCoursePresentationStore((state) => state.initializeStore);

  const coverSection = useMemo(() => {
    return sections.find(
      (s) => s.id === 'root-cover-page' || s.contentType === 'cover_page' || s.type === 'cover'
    );
  }, [sections]);

  const coverData = coverSection?.data || {};

  const globalCoverBackgroundUrl = 
    coverData.backgroundUrl || 
    coverData.coverBackgroundUrl || 
    coverData.backgroundImage || 
    coverData.bgImage || 
    '';

  const resolvedBrandColor = globalBrandColor || coverData.brandColor || '#1a688a';

  const totalSections = sections.length;
  const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
  const activeSection = sections[currentIndex >= 0 ? currentIndex : 0];

  useEffect(() => {
    if (isPreviewModeActive && currentIndex === -1 && sections.length > 0) {
      setActiveSectionId(sections[0].id);
    }
  }, [currentIndex, sections, isPreviewModeActive, setActiveSectionId]);

  useEffect(() => {
    if (isPreviewModeActive && activeSection?.contentType === 'course_presentation') {
      initializeCoursePresentationStore(activeSection.id, activeSection.data || {});
    }
  }, [isPreviewModeActive, activeSection, initializeCoursePresentationStore]);

  useEffect(() => {
    if (!isPreviewModeActive || !containerRef.current) return;

    const updateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const computedStyle = window.getComputedStyle(container);
      const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
      const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

      const availableWidth = Math.max(0, container.clientWidth - paddingX);
      const availableHeight = Math.max(0, container.clientHeight - paddingY);

      const scaleX = availableWidth / CANVAS_WIDTH;
      const scaleY = availableHeight / CANVAS_HEIGHT;

      const calculatedScale = Math.max(0.1, Math.min(scaleX, scaleY, 1));
      setScale(calculatedScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [isPreviewModeActive, activeSection]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setActiveSectionId(sections[currentIndex - 1].id);
    }
  }, [currentIndex, sections, setActiveSectionId]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalSections - 1) {
      setActiveSectionId(sections[currentIndex + 1].id);
    }
  }, [currentIndex, totalSections, sections, setActiveSectionId]);

  useEffect(() => {
    if (!isPreviewModeActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewModeActive, handlePrev, handleNext]);

  if (!isPreviewModeActive) {
    return null;
  }

  const PreviewComponent = activeSection ? PREVIEW_MAP[activeSection.contentType] : null;

  return (
    <div className="fixed inset-0 top-[57px] w-full h-[calc(100vh-57px)] flex flex-col bg-[#212121] font-sans z-[100] animate-in fade-in duration-150">
      <div 
        ref={containerRef}
        className="flex-1 w-full bg-slate-500/10 flex items-center justify-center p-4 md:p-6 overflow-hidden relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 flex items-center justify-start pl-6 z-40 pointer-events-none">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            aria-label="Previous slide"
            className={`p-4 rounded-full bg-slate-900/60 text-white shadow-xl backdrop-blur-md transition-all border border-slate-700/50 pointer-events-auto ${
              currentIndex <= 0 
                ? "opacity-0 cursor-not-allowed transform -translate-x-4" 
                : "opacity-70 hover:opacity-100 hover:bg-slate-900 hover:scale-105 active:scale-95"
            }`}
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <SourceTooltipProvider>
          {PreviewComponent ? (
            <div
              className="pointer-events-auto shrink-0 transition-transform duration-100 ease-out shadow-2xl rounded-xl overflow-hidden"
              style={{
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              <PreviewComponent
                title={activeSection?.title}
                sectionId={activeSection?.id}
                section={activeSection}
                brandColor={resolvedBrandColor}
                data={{
                  ...activeSection?.data,
                  brandColor: activeSection?.data?.brandColor || resolvedBrandColor,
                  coverBackgroundUrl: activeSection?.data?.coverBackgroundUrl || globalCoverBackgroundUrl,
                  backgroundImage: activeSection?.data?.backgroundImage || globalCoverBackgroundUrl,
                  backgroundTint: activeSection?.data?.backgroundTint || `${resolvedBrandColor}cc`,
                  candidateInstructions: candidateInstructions,
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full max-w-5xl max-h-[85vh] bg-white border border-slate-200 shadow-2xl rounded-xl flex flex-col items-center justify-center p-12 text-center select-none">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 text-slate-400 font-mono text-xs">
                ?
              </div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                Preview Template Unmapped
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                The content layout type <code className="bg-slate-100 px-1 py-0.5 rounded text-red-500 font-mono font-bold">{activeSection?.contentType || 'NULL'}</code> has not yet been registered into the canvas pipeline map.
              </p>
            </div>
          )}
        </SourceTooltipProvider>

        <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-end pr-6 z-40 pointer-events-none">
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= totalSections - 1}
            aria-label="Next slide"
            className={`p-4 rounded-full bg-slate-900/60 text-white shadow-xl backdrop-blur-md transition-all border border-slate-700/50 pointer-events-auto ${
              currentIndex >= totalSections - 1 
                ? "opacity-0 cursor-not-allowed transform translate-x-4" 
                : "opacity-70 hover:opacity-100 hover:bg-slate-900 hover:scale-105 active:scale-95"
            }`}
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}