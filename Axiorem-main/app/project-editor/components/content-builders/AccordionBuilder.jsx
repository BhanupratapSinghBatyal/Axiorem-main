'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useAccordionStore } from './store/useAccordionStore';
import { useEditorStore } from '../../store/useEditorStore';
import NavigationFooter from '../NavigationFooter';

/**
 * Calculates relative luminance using W3C WCAG 2.1 formulas
 * and computes contrast ratio to determine text color over the brand background.
 */
function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') {
    return '#ffffff';
  }

  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance < 0.35 ? '#ffffff' : '#0f172a';
}

export default function AccordionBuilder({ data, sectionId, section }) {
  const [mounted, setMounted] = useState(false);

  const {
    moduleTitle,
    panels,
    activePanelId,
    initializeStore,
    setModuleTitle,
    setActivePanelId,
    updatePanel,
    insertPanel,
    deletePanel,
    appendPanel
  } = useAccordionStore();

  const editorStore = useEditorStore();
  const storeBrandColor = useEditorStore((state) => state.brandColor);
  const sections = useEditorStore((state) => state.sections) || [];

  const coverSection = sections.find((s) => s.id === 'root-cover-page' || s.contentType === 'cover_page');
  const coverData = coverSection?.data || {};
  const coverBackgroundUrl = coverData.backgroundUrl || '';

  const titleRef = useRef(null);
  const brandColor = storeBrandColor || coverData.brandColor || '#1a688a';

  // Compute contrast color specifically for the module/section title
  const titleTextColor = useMemo(() => getContrastColor(brandColor), [brandColor]);

  const [openItemId, setOpenItemId] = useState(null);
  const prevPanelsLengthRef = useRef(0);
  const prevPanelsIdsRef = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sectionId) {
      const payload = data || section?.data || {};
      initializeStore(sectionId, payload);
    }
  }, [sectionId, data, section, initializeStore]);

  useEffect(() => {
    if (!mounted || !panels || panels.length === 0) return;

    if (openItemId === null) {
      const initialId = panels[0]?.id ?? 'panel_0';
      setOpenItemId(initialId);
    } else if (panels.length > prevPanelsLengthRef.current) {
      const lastKnownIds = prevPanelsIdsRef.current || [];
      const absoluteNewItem = panels.find((p) => !lastKnownIds.includes(p.id));

      if (absoluteNewItem) {
        setOpenItemId(absoluteNewItem.id);
        setActivePanelId(absoluteNewItem.id);
      } else {
        const latestId = panels[panels.length - 1]?.id ?? 'panel_0';
        setOpenItemId(latestId);
        setActivePanelId(latestId);
      }
    }

    prevPanelsLengthRef.current = panels.length;
    prevPanelsIdsRef.current = panels.map((p) => p.id);
  }, [panels, openItemId, setActivePanelId, mounted]);

  useEffect(() => {
    const textarea = titleRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [moduleTitle]);

  const toggleItem = useCallback(
    (id) => {
      setOpenItemId((prev) => (prev === id ? null : id));
      setActivePanelId(id);
    },
    [setActivePanelId]
  );

  const handleInsert = (e, currentId, position) => {
    e.stopPropagation();
    e.preventDefault();
    insertPanel(currentId, position);
  };

  if (!mounted) {
    return (
      <div className="w-full flex items-center justify-center overflow-hidden py-4">
        <div className="w-[1280px] h-[720px] bg-slate-900 border border-slate-200 rounded-sm shadow-inner scale-75 origin-center my-[-90px] mx-[-160px]" />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center overflow-hidden py-4">
      <div className="w-[1280px] h-[720px] shrink-0 flex flex-col justify-between font-sans overflow-hidden select-none relative border border-slate-200 rounded-sm shadow-inner scale-75 origin-center my-[-90px] mx-[-160px]">
        
        {/* Cover Background Layer */}
        {coverBackgroundUrl ? (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: `url(${coverBackgroundUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-0" />
        )}

        {/* Selected Overlay Color Tint */}
        <div
          className="absolute inset-0 w-full h-full opacity-65 z-10 transition-colors duration-300"
          style={{ backgroundColor: brandColor }}
        />

        {/* Outer Content Layout Container (Scoped Padding) */}
        <div className="relative z-20 w-full flex-1 flex flex-col justify-between pt-12 px-12 pb-4 overflow-hidden min-h-0">
          
          {/* Section Title: Width ~80% with left margin */}
          <div className="self-start w-[80%] ml-6">
            <textarea
              ref={titleRef}
              rows={1}
              maxLength={120}
              value={moduleTitle || ''}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="Enter Section Title..."
              style={{ color: titleTextColor }}
              className="w-full text-3xl font-extrabold tracking-tight leading-tight bg-transparent border-none outline-none resize-none focus:ring-0 p-0 m-0 whitespace-normal break-words overflow-hidden placeholder:opacity-50"
            />
            <div
              className="w-16 h-[4px] mt-0 rounded-full"
              style={{ backgroundColor: titleTextColor }}
            />
          </div>

          {/* Single Column Scrollable Feed */}
          <div className="w-[90%] mx-auto flex-1 flex flex-col min-h-0 mt-6 overflow-hidden">
            
            <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar min-h-0">
              {panels && panels.length > 0 ? (
                <div className="w-full flex flex-col gap-4">
                  {panels.map((panel, index) => {
                    const itemId = panel.id !== undefined && panel.id !== null ? panel.id : `panel_${index}`;
                    const isOpen = openItemId === itemId;

                    return (
                      <div key={itemId} className="relative w-full shrink-0">
                        
                        {/* Insertion Target Top */}
                        {activePanelId === panel.id && (
                          <div className="w-full h-4 relative group/insert-top -my-2 z-50">
                            <div className="absolute inset-0 flex items-center opacity-0 group-hover/insert-top:opacity-100 transition-opacity">
                              <div className="w-full h-0.5" style={{ backgroundColor: brandColor }} />
                              <button
                                type="button"
                                onClick={(e) => handleInsert(e, panel.id, 'above')}
                                className="absolute left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-white font-bold text-[10px] uppercase tracking-wider rounded-sm shadow-md flex items-center gap-1 hover:brightness-110 transition-all cursor-pointer z-50"
                                style={{ backgroundColor: brandColor }}
                              >
                                <Plus className="w-3 h-3 stroke-[2.5]" /> Add Panel Above
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Accordion Card Container with Near Sharp Radius */}
                        <div
                          onClick={() => setActivePanelId(panel.id)}
                          className="w-full bg-white rounded-sm border border-white/60 shadow-lg overflow-hidden transition-all text-left"
                        >
                          <div
                            onClick={() => toggleItem(itemId)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer group focus:outline-none"
                          >
                            <div className="flex-1 flex items-center gap-3 min-w-0 pr-4">
                              <span className="text-xs font-bold text-slate-400 font-mono shrink-0">
                                #{String(index + 1).padStart(2, '0')}
                              </span>
                              {/* Accordion Title: Scaled up 20% to text-xl */}
                              <input
                                type="text"
                                value={panel.title || ''}
                                placeholder="Untitled Accordion Item Title"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updatePanel(panel.id, 'title', e.target.value)}
                                className="w-full bg-transparent font-bold text-xl text-slate-900 focus:outline-none placeholder:text-slate-300 border-none p-0 focus:ring-0 text-left"
                              />
                            </div>

                            <div
                              className="shrink-0 flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {panels.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => deletePanel(panel.id)}
                                  className="p-1 rounded-sm text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                              <div
                                className="ml-1 cursor-pointer"
                                onClick={() => toggleItem(itemId)}
                              >
                                {isOpen ? (
                                  <Minus
                                    className="w-5 h-5 transition-transform"
                                    style={{ color: brandColor }}
                                  />
                                ) : (
                                  <Plus
                                    className="w-5 h-5 transition-transform"
                                    style={{ color: brandColor }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`grid transition-all duration-200 ease-in-out overflow-hidden ${
                              isOpen
                                ? 'grid-rows-[1fr] opacity-100 pb-5 px-6'
                                : 'grid-rows-[0fr] opacity-0 px-6'
                            }`}
                          >
                            <div className="overflow-hidden border-t border-slate-100 pt-3">
                              {/* Accordion Body Text: Scaled up 20% to text-lg */}
                              <textarea
                                rows={3}
                                value={panel.content || ''}
                                placeholder="Click to edit descriptions..."
                                onChange={(e) => updatePanel(panel.id, 'content', e.target.value)}
                                className="w-full text-lg text-slate-600 font-normal leading-relaxed bg-transparent border border-transparent hover:border-slate-200 focus:border-slate-300 focus:bg-slate-50/50 p-2 rounded-sm focus:outline-none transition-all placeholder:text-slate-300 resize-none whitespace-pre-wrap overflow-hidden text-left"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Insertion Target Bottom */}
                        {activePanelId === panel.id && (
                          <div className="w-full h-4 relative group/insert-bottom -my-2 z-50">
                            <div className="absolute inset-0 flex items-center opacity-0 group-hover/insert-bottom:opacity-100 transition-opacity">
                              <div className="w-full h-0.5" style={{ backgroundColor: brandColor }} />
                              <button
                                type="button"
                                onClick={(e) => handleInsert(e, panel.id, 'below')}
                                className="absolute left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-white font-bold text-[10px] uppercase tracking-wider rounded-sm shadow-md flex items-center gap-1 hover:brightness-110 transition-all cursor-pointer z-50"
                                style={{ backgroundColor: brandColor }}
                              >
                                <Plus className="w-3 h-3 stroke-[2.5]" /> Add Panel Below
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full bg-white/90 rounded-sm p-8 text-center text-sm text-slate-400 font-mono border border-dashed border-slate-200 shadow-md">
                  No Accordion Items Added
                </div>
              )}
            </div>

            {/* Bottom Append Control */}
            <div className="w-full flex justify-center pt-4 shrink-0">
              <button
                type="button"
                onClick={appendPanel}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-sm border border-white/80 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" style={{ color: brandColor }} /> Append New Row
              </button>
            </div>

          </div>

        </div>

        {/* Unpadded Edge-to-Edge Navigation Footer Container */}
        <div className="w-full z-40 relative shrink-0 p-0 m-0">
          <NavigationFooter 
            onPrev={() => editorStore.navigatePrev?.()} 
            onNext={() => editorStore.navigateNext?.()} 
          />
        </div>

      </div>
    </div>
  );
}