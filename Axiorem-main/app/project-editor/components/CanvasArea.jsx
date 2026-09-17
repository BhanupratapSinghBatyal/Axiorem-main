// src/components/CanvasArea.jsx

import React from 'react';
import { Plus, Layers } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import CoverPageBuilder from './content-builders/CoverPageBuilder';
import AccordionBuilder from './content-builders/AccordionBuilder';
import InformationWallBuilder from './content-builders/InformationWallBuilder';
import DocumentationBuilder from './content-builders/DocumentationBuilder';
import CoursePresentationBuilder from './content-builders/CoursePresentationBuilder';
import InteractiveQuizBuilder from './content-builders/InteractiveQuizBuilder';

const BUILDER_MAP = {
  cover_page: CoverPageBuilder,
  accordion: AccordionBuilder,
  information_wall: InformationWallBuilder,
  documentation: DocumentationBuilder,
  course_presentation: CoursePresentationBuilder,
  quiz: InteractiveQuizBuilder
};

export default function CanvasArea() {
  const { sections, activeSectionId, setAddContentOpen, brandColor } = useEditorStore();
  const activeSection = sections.find((s) => s.id === activeSectionId);

  const Builder = activeSection?.contentType ? BUILDER_MAP[activeSection.contentType] : null;

  return (
    <main className="flex-1 bg-[#212121] p-6 overflow-y-auto flex flex-col items-center min-h-0 relative">
      {!sections?.length || (activeSection && !activeSection.contentType) ? (
        <div className="max-w-md w-full text-center flex flex-col items-center p-8 bg-transparent my-auto select-none">
          <div className="w-12 h-12 bg-[#2A2A2A] border border-slate-700 rounded-sm flex items-center justify-center mb-4 text-slate-300">
            <Layers className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-1">
            {!sections?.length ? "Canvas Uninitialized" : "Empty Blueprint Selected"}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-6">
            {!sections?.length 
              ? "Append primary module sequence to initialize structure."
              : "Specify structural layout parameters to mount interface."}
          </p>
          <button 
            type="button"
            onClick={() => setAddContentOpen(true)} 
            className="h-9 px-4 bg-[#1b365d] hover:bg-[#24477a] text-white rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-blue-900"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Blueprint Section</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {Builder ? (
            <Builder 
              key={activeSection.id} 
              sectionId={activeSection.id} 
              section={activeSection} 
              data={activeSection.data}
              brandColor={brandColor} 
            />
          ) : (
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select a valid section to begin editing.</div>
          )}
        </div>
      )}
    </main>
  );
}