import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

const NavigationFooter = () => {
  const sections = useEditorStore((state) => state.sections) || [];
  const activeSectionId = useEditorStore((state) => state.activeSectionId);
  const setActiveSectionId = useEditorStore((state) => state.setActiveSectionId);

  const currentIndex = sections.findIndex((section) => section.id === activeSectionId);

  const isPrevDisabled = currentIndex <= 0;
  const isNextDisabled = currentIndex === -1 || currentIndex >= sections.length - 1;

  const handlePrev = () => {
    if (!isPrevDisabled) {
      setActiveSectionId(sections[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (!isNextDisabled) {
      setActiveSectionId(sections[currentIndex + 1].id);
    }
  };

  return (
    <footer className="w-full bg-[#d8d8d8] border-t border-[#b4b4b4] px-12 py-3 flex justify-end items-center gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-[#1f2937] tracking-wider uppercase bg-gradient-to-b from-[#ffffff] via-[#eaeaea] to-[#d4d4d4] border border-[#a3a3a3] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.15)] hover:from-[#f5f5f5] hover:to-[#c8c8c8] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-75 cursor-pointer"
      >
        <span className="text-[10px]">▲</span>
        <span>PREV</span>
      </button>

      <button
        type="button"
        onClick={handleNext}
        disabled={isNextDisabled}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-[#1f2937] tracking-wider uppercase bg-gradient-to-b from-[#ffffff] via-[#eaeaea] to-[#d4d4d4] border border-[#a3a3a3] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.15)] hover:from-[#f5f5f5] hover:to-[#c8c8c8] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-75 cursor-pointer"
      >
        <span>NEXT</span>
        <span className="text-[10px]">▲</span>
      </button>
    </footer>
  );
};

export default NavigationFooter;