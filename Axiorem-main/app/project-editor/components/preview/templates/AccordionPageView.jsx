'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import NavigationFooter from '../../NavigationFooter';
import { SourceHoverTarget } from '../SourceTooltip';
import BoldText from '../BoldText';

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

export default function AccordionPageView({ title, section, data = {}, onPrev, onNext }) {
  const {
    brandColor = "#1a688a",
    coverBackgroundUrl = ""
  } = data;
  
  // Normalize checking structure matching store tracking schema exactly
  const items = data.panels || data.items || [];
  const moduleTitle = title || data.moduleTitle || data.title || "";

  const [openItemId, setOpenItemId] = useState(null);

  // Dynamic contrast color calculation for background overlay
  const titleTextColor = useMemo(() => getContrastColor(brandColor), [brandColor]);

  useEffect(() => {
    if (items.length > 0) {
      setOpenItemId(items[0].id !== undefined && items[0].id !== null ? items[0].id : `panel_0`);
    } else {
      setOpenItemId(null);
    }
  }, [items]);

  const toggleItem = (id) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <SourceHoverTarget source={section?.source} className="w-[1280px] h-[720px] shrink-0 flex flex-col justify-between font-sans overflow-hidden relative border border-slate-200 rounded-sm shadow-inner mx-auto">
      
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
        
        {/* Section Title: Matched width ~80% and left margin with builder */}
        <div className="self-start w-[80%] ml-6">
          <h1
            style={{ color: titleTextColor }}
            className="w-full text-3xl font-extrabold tracking-tight leading-tight whitespace-normal break-words overflow-hidden m-0 p-0"
          >
            <BoldText>{moduleTitle || "Enter Section Title..."}</BoldText>
          </h1>
          <div
            className="w-16 h-[4px] mt-0 rounded-full"
            style={{ backgroundColor: titleTextColor }}
          />
        </div>

        {/* Single Column Scrollable Feed (Fixed Width Matching Builder) */}
        <div className="w-[90%] mx-auto flex-1 flex flex-col min-h-0 mt-6 overflow-hidden">
          
          <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar min-h-0">
            {items && items.length > 0 ? (
              <div className="w-full flex flex-col gap-4">
                {items.map((panel, index) => {
                  const itemId = panel.id !== undefined && panel.id !== null ? panel.id : `panel_${index}`;
                  const isOpen = openItemId === itemId;

                  return (
                    <SourceHoverTarget as="div" key={itemId} source={panel.source} className="relative w-full shrink-0">
                      
                      {/* Standalone White Container for Each Accordion Card with Sharp Border Radius */}
                      <div className="w-full bg-white rounded-sm border border-white/60 shadow-lg overflow-hidden transition-all text-left">
                        <div
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer group focus:outline-none"
                        >
                          <div className="flex-1 flex items-center gap-3 min-w-0 pr-4">
                            <span className="text-xs font-bold text-slate-400 font-mono shrink-0">
                              #{String(index + 1).padStart(2, '0')}
                            </span>
                            {/* Accordion Title: Scaled up to text-xl matching Builder */}
                            <span className="w-full font-bold text-xl text-slate-900 border-none p-0 text-left whitespace-normal break-words">
                              <BoldText>{panel.title || panel.heading || "Untitled Accordion Item Title"}</BoldText>
                            </span>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <div className="ml-1">
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
                            {/* Accordion Body Text: Scaled up to text-lg matching Builder */}
                            <p className="w-full text-lg text-slate-600 font-normal leading-relaxed p-2 rounded-sm whitespace-pre-wrap overflow-hidden text-left break-words">
                              <BoldText>{panel.content || panel.body || "No content written for this item."}</BoldText>
                            </p>
                          </div>
                        </div>
                      </div>

                    </SourceHoverTarget>
                  );
                })}
              </div>
            ) : (
              <div className="w-full bg-white/90 rounded-sm p-8 text-center text-sm text-slate-400 font-mono border border-dashed border-slate-200 shadow-md">
                No Accordion Items Added
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Unpadded Edge-to-Edge Navigation Footer Container */}
      <div className="w-full z-40 relative shrink-0 p-0 m-0">
        <NavigationFooter 
          onPrev={onPrev} 
          onNext={onNext} 
        />
      </div>

    </SourceHoverTarget>
  );
}