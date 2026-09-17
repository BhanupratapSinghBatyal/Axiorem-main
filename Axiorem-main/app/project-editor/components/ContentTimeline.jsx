// components/editor/ContentTimeline.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Move, AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

export default function ContentTimeline() {
  const {
    sections,
    activeSectionId,
    setActiveSectionId,
    deleteSection,
    appendNewContentNode,
    setAddContentOpen,
    reorderSections,
    isPreviewModeActive,
    toast,
    clearToast
  } = useEditorStore();
  
  const [isOpen, setIsOpen] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (activeSectionId && scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-section-id="${activeSectionId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeSectionId]);

  const handleAppendEmptySection = () => {
    appendNewContentNode(null, 'Untitled Slide');
    setAddContentOpen(true);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updatedSections = [...sections];
    const [draggedItem] = updatedSections.splice(draggedIndex, 1);
    updatedSections.splice(targetIndex, 0, draggedItem);
    
    setDraggedIndex(targetIndex);
    reorderSections(updatedSections);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleKeyDown = (e) => {
    if (!sections.length) return;

    const currentIndex = sections.findIndex((s) => s.id === activeSectionId);

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
          setActiveSectionId(sections[currentIndex + 1].id);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          setActiveSectionId(sections[currentIndex - 1].id);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  useEffect(() => {
    const handleKeyDownWrapper = (e) => handleKeyDown(e);
    window.addEventListener('keydown', handleKeyDownWrapper);
    return () => window.removeEventListener('keydown', handleKeyDownWrapper);
  }, [isOpen, sections, activeSectionId, setActiveSectionId]);

  if (!sections?.length) return null;

  return (
    <>
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-sm shadow-lg text-white text-xs font-bold uppercase tracking-wider ${
            toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-[#1b365d]' : 'bg-[#3A3A3A]'
          }`}>
            {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-white" />}
            {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            {toast.type === 'info' && <Info className="w-3.5 h-3.5 text-white" />}
            <span>{toast.message}</span>
            <button onClick={clearToast} className="ml-2 text-white/70 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Open Timeline Toggle Mechanism */}
      <div className={`absolute bottom-4 z-40 transition-all duration-300 left-6 ${
        isOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'
      }`}>
        <button type="button" onClick={() => setIsOpen(true)} className="h-9 px-4 bg-[#1b365d] hover:bg-[#2a4a7a] text-white rounded-sm text-[10px] font-bold flex items-center gap-2 cursor-pointer shadow-md uppercase tracking-wider">
          <ChevronUp className="w-4 h-4 stroke-2" /> <span>Open Content Timeline ({sections.length})</span>
        </button>
      </div>

      {/* Main Bar Wrapper Element */}
      <div className={`absolute bottom-0 left-0 right-0 bg-[#292929] shadow-lg px-6 py-2 flex items-center gap-4 h-32 transition-transform duration-300 z-40 text-white antialiased ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex flex-col items-center pr-4 border-r border-slate-700 h-full shrink-0 justify-center">
          <button type="button" onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 rounded-sm hover:bg-slate-700 cursor-pointer transition-colors">
            <ChevronDown className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold uppercase text-slate-400 mt-1 tracking-wider">Timeline</span>
        </div>

        <div ref={scrollContainerRef} className="flex-1 flex items-center gap-3 overflow-x-auto h-full py-1">
          {sections.map((sec, index) => (
            <div
              key={sec.id}
              data-section-id={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative w-44 h-24 rounded-sm p-3 cursor-grab active:cursor-grabbing shrink-0 group transition-all ${
                draggedIndex === index ? 'opacity-40 scale-95' : ''
              } ${
                activeSectionId === sec.id ? 'bg-[#1b365d] text-white shadow-md' : 'bg-[#3A3A3A] text-white'
              }`}
            >
              <div className="w-full flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className={activeSectionId === sec.id ? 'text-slate-300' : 'text-slate-400'}>#{String(index + 1).padStart(2, '0')}</span>
                <Move className={`w-3 h-3 opacity-0 group-hover:opacity-100 ${activeSectionId === sec.id ? 'text-white' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1 flex flex-col justify-center overflow-hidden mt-1">
                <span className="text-xs font-bold truncate block uppercase tracking-wider">{sec.title || "Untitled"}</span>
                <span className={`text-[9px] uppercase font-semibold mt-0.5 tracking-wider truncate block ${activeSectionId === sec.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {sec.contentType ? sec.contentType.replace('_', ' ') : 'Unassigned Layout'}
                </span>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); deleteSection(sec.id); }} className={`absolute bottom-2 right-2 p-1 opacity-0 group-hover:opacity-100 cursor-pointer ${activeSectionId === sec.id ? 'text-slate-300 hover:text-red-300' : 'text-slate-400'}`}>
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAppendEmptySection} className="w-40 h-24 rounded-sm border-2 border-dashed border-slate-600 bg-transparent flex flex-col items-center justify-center shrink-0 hover:bg-slate-700/40 cursor-pointer transition-colors text-slate-400 hover:text-white">
            <Plus className="w-4 h-4 stroke-2" />
            <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">Append</span>
          </button>
        </div>
      </div>
    </>
  );
}