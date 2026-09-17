'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Plus, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { useAssetActions } from '../../../../hooks/useAssetActions';
import { useInformationWallStore } from './store/useInformationWallStore';
import { useEditorStore } from '../../store/useEditorStore';
import { uploadEditorAsset } from './utils/uploadEditorAsset';
import NavigationFooter from '../NavigationFooter';

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

function getValidImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;

  try {
    return new URL(value).href;
  } catch {
    return null;
  }
}

export default function InformationWallBuilder({ sectionId, section }) {
  const { uploadAsset } = useAssetActions();
  const setUploadProgress = useEditorStore((state) => state.setUploadProgress);
  const clearUploadProgress = useEditorStore((state) => state.clearUploadProgress);

  const projectId = useEditorStore((state) => state.projectId);
  const storeBrandColor = useEditorStore((state) => state.brandColor);
  const sections = useEditorStore((state) => state.sections) || [];

  const coverSection = useMemo(() => {
    return sections.find(
      (s) => s.id === 'root-cover-page' || s.contentType === 'cover_page' || s.type === 'cover'
    );
  }, [sections]);

  const coverData = coverSection?.data || {};

  const {
    sectionTitle,
    headline,
    panels,
    textColor: storeTextColor,
    backgroundImage: storeBgImage,
    backgroundTint: storeBgTint,
    initializeStore,
    handleTitleChange,
    handleHeadlineChange,
    updatePanelField,
    deletePanel,
    appendPanel
  } = useInformationWallStore();

  const brandColor = storeBrandColor || coverData.brandColor || section?.data?.brandColor || '#1a688a';
  
  const rawBgImage = 
    storeBgImage || 
    section?.data?.backgroundImage || 
    coverData.backgroundUrl || 
    coverData.bgImage || 
    '';
    
  const bgTint = storeBgTint || section?.data?.backgroundTint || `${brandColor}cc`;

  const bgImageUrl = typeof rawBgImage === 'object' && rawBgImage !== null
    ? (rawBgImage.url || rawBgImage.src || '')
    : String(rawBgImage || '');

  const calculatedTextColor = useMemo(() => getContrastColor(bgTint), [bgTint]);
  const titleTextColor = useMemo(() => getContrastColor(brandColor), [brandColor]);

  // Dynamic SVG Grid Texture Data URL reacting to the computed text contrast color
  const gridTextureUrl = useMemo(() => {
    const strokeColor = calculatedTextColor === '#ffffff' 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(15, 23, 42, 0.15)';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="${strokeColor}" stroke-width="1"/></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [calculatedTextColor]);

  const fileInputRefs = useRef(new Map());
  const [activePanelId, setActivePanelId] = useState(null);
  const [uploadingPanels, setUploadingPanels] = useState({});
  const [failedPanels, setFailedPanels] = useState(() => new Set());

  useEffect(() => {
    if (sectionId && section?.data) {
      initializeStore(sectionId, section.data);
    }
  }, [sectionId, section?.data, initializeStore]);

  useEffect(() => {
    if (panels.length > 0 && (!activePanelId || !panels.some((p) => p.id === activePanelId))) {
      setActivePanelId(panels[0].id);
    }
  }, [panels, activePanelId]);

  const handleImageUpload = async (panelId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPanels((prev) => ({ ...prev, [panelId]: true }));

    try {
      const uploadedAsset = await uploadEditorAsset({
        file,
        projectId,
        uploadAsset,
        setUploadProgress,
        clearUploadProgress,
        label: `Information Wall Panel Image (${panelId})`,
      });

      const resolvedUrl =
        uploadedAsset?.url || uploadedAsset?.downloadUrl || uploadedAsset?.uploadUrl || '';
      const resolvedAssetId = uploadedAsset?.assetId || uploadedAsset?.id || null;

      if (resolvedUrl) {
        setFailedPanels((current) => {
          const next = new Set(current);
          next.delete(panelId);
          return next;
        });
        updatePanelField(panelId, 'imageUrl', resolvedUrl);
        updatePanelField(panelId, 'assetId', resolvedAssetId);
      }
    } catch (error) {
      console.error(`Asset upload failed for panel ID ${panelId}:`, error);
    } finally {
      setUploadingPanels((prev) => ({ ...prev, [panelId]: false }));
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveImage = (panelId, e) => {
    e.stopPropagation();
    const panel = panels.find((p) => p.id === panelId);
    if (panel?.assetId) {
      useEditorStore.getState().queueAssetForDeletion?.(panel.assetId);
    }
    updatePanelField(panelId, 'imageUrl', '');
    updatePanelField(panelId, 'assetId', null);
  };

  const handleDeletePanel = (panelId, e) => {
    e.stopPropagation();
    fileInputRefs.current.delete(panelId);
    deletePanel(panelId);
  };

  return (
    <div className="relative w-full max-w-[1280px] mx-auto flex flex-col font-sans rounded-none overflow-hidden transition-all duration-300 isolate">
      {/* Layer 1: Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 pointer-events-none"
        style={{
          backgroundImage: bgImageUrl ? `url("${bgImageUrl}")` : 'none',
          backgroundColor: '#0f172a',
        }}
      />

      {/* Layer 2: Tint Overlay */}
      <div 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none transition-colors duration-300"
        style={{ backgroundColor: bgTint }}
      />

      {/* Main Section */}
      <section className="relative z-20 w-full p-4 md:p-12 flex-1">
        <div className="w-full flex flex-col gap-12">
          
          {/* Header */}
          <header className="w-full max-w-[800px] mx-auto text-center flex flex-col items-center gap-4">
            <div className="relative inline-block w-full">
              <label htmlFor={`heading-${sectionId}`} className="sr-only">Section Heading</label>
              <input
                id={`heading-${sectionId}`}
                type="text"
                value={sectionTitle || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter Section Title..."
                style={{ color: titleTextColor }}
                className="w-full text-center text-3xl font-extrabold tracking-tight leading-tight bg-transparent focus:outline-none placeholder:text-current placeholder:opacity-80 border-none p-0 focus:ring-0"
              />
              <div 
                className="mx-auto mt-3 h-1.5 w-24 rounded-none transition-colors duration-300" 
                style={{ backgroundColor: titleTextColor }} 
              />
            </div>
            
            <label htmlFor={`subheadline-${sectionId}`} className="sr-only">Sub-headline</label>
            <input
              id={`subheadline-${sectionId}`}
              type="text"
              value={headline || ''}
              onChange={(e) => handleHeadlineChange(e.target.value)}
              placeholder="Enter sub-headline text..."
              style={{ color: calculatedTextColor }}
              className="w-full text-center text-base md:text-xl font-medium bg-transparent focus:outline-none placeholder:text-current placeholder:opacity-75 border-none p-0 focus:ring-0"
            />
          </header>

          {/* Panel Stream */}
          <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-16 md:gap-24">
            {panels.length > 0 ? (
              panels.map((panel, index) => {
                const isEven = index % 2 === 0;
                const isActive = activePanelId === panel.id;
                const isUploading = Boolean(uploadingPanels[panel.id]);
                const imageUrl = getValidImageUrl(panel.imageUrl);
                const hasImage = Boolean(imageUrl) && !failedPanels.has(panel.id);

                return (
                  <article key={panel.id} className="w-full group relative">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActivePanelId(panel.id)}
                      onKeyDown={(e) => e.key === 'Enter' && setActivePanelId(panel.id)}
                      className={`w-full flex flex-col lg:flex-row items-center gap-8 md:gap-12 transition-all duration-300 relative ${
                        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      }`}
                    >
                      {/* Controls */}
                      <div className="absolute -top-3 right-2 z-20 flex items-center gap-2">
                        {panels.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeletePanel(panel.id, e)}
                            className="p-2 bg-white/90 hover:bg-red-600 text-slate-600 hover:text-white rounded-full shadow-lg backdrop-blur-md transition-all duration-200"
                            aria-label="Delete panel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Media Node */}
                      <div className="w-full lg:w-1/2 aspect-[4/3] rounded-md overflow-hidden bg-slate-900/5 border border-white/20 shadow-2xl relative flex items-center justify-center shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => {
                            if (el) fileInputRefs.current.set(panel.id, el);
                            else fileInputRefs.current.delete(panel.id);
                          }}
                          onChange={(e) => handleImageUpload(panel.id, e)}
                          className="hidden"
                          id={`file-input-${panel.id}`}
                        />

                        {isUploading ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-black/20 text-white">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-xs font-semibold">Uploading Asset...</span>
                          </div>
                        ) : hasImage ? (
                          <div className="w-full h-full relative group/img">
                            <img
                              src={imageUrl}
                              alt={panel.altText || 'Panel preview'}
                              onError={() => setFailedPanels((current) => new Set(current).add(panel.id))}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                            />
                            {isActive && (
                              <button
                                type="button"
                                onClick={(e) => handleRemoveImage(panel.id, e)}
                                className="absolute top-3 left-3 p-2 bg-black/60 hover:bg-red-600 text-white backdrop-blur-md rounded-lg transition-all shadow-md"
                                aria-label="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRefs.current.get(panel.id)?.click();
                            }}
                            style={{
                              backgroundImage: gridTextureUrl,
                              backgroundRepeat: 'repeat',
                              backgroundSize: '24px 24px',
                            }}
                            className="w-full h-full flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 transition-colors duration-200"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white/40 flex items-center justify-center shadow-md mb-2 backdrop-blur-md text-slate-800">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-90" style={{ color: calculatedTextColor }}>
                              Upload Asset
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Content Fields */}
                      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4">
                        <div>
                          <label htmlFor={`title-${panel.id}`} className="sr-only">Panel Title</label>
                          <input
                            id={`title-${panel.id}`}
                            type="text"
                            value={panel.title || ''}
                            disabled={!isActive}
                            onChange={(e) => updatePanelField(panel.id, 'title', e.target.value)}
                            placeholder="Panel Title"
                            style={{ color: calculatedTextColor }}
                            className="w-full text-3xl font-extrabold tracking-tight leading-tight bg-transparent focus:outline-none placeholder:text-current placeholder:opacity-75 border-none p-0 focus:ring-0 text-left"
                          />
                        </div>

                        <div>
                          <label htmlFor={`info-${panel.id}`} className="sr-only">Panel Description</label>
                          <textarea
                            id={`info-${panel.id}`}
                            value={panel.infoText || ''}
                            disabled={!isActive}
                            rows={4}
                            onChange={(e) => updatePanelField(panel.id, 'infoText', e.target.value)}
                            placeholder="Type panel description..."
                            style={{ color: calculatedTextColor }}
                            className="w-full text-sm md:text-base font-normal bg-transparent focus:outline-none placeholder:text-current placeholder:opacity-75 resize-none leading-relaxed border-none p-0 focus:ring-0 text-left"
                          />
                        </div>

                        {isActive && (
                          <div className="pt-3 border-t border-white/20 flex flex-col gap-1">
                            <label htmlFor={`alt-${panel.id}`} className="text-[10px] font-bold uppercase tracking-wider opacity-80" style={{ color: calculatedTextColor }}>
                              Accessibility / Alt Text
                            </label>
                            <input
                              id={`alt-${panel.id}`}
                              type="text"
                              value={panel.altText || ''}
                              onChange={(e) => updatePanelField(panel.id, 'altText', e.target.value)}
                              placeholder="Describe image for screen readers..."
                              style={{ color: calculatedTextColor }}
                              className="w-full text-xs bg-transparent focus:outline-none placeholder:text-current placeholder:opacity-75 border-none p-0 focus:ring-0"
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  </article>
                );
              })
            ) : (
              <div className="py-16 text-center text-sm font-medium opacity-80 border-2 border-dashed border-white/20 rounded-3xl" style={{ color: calculatedTextColor }}>
                No panels present in layout.
              </div>
            )}

            {/* Append Control */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  const id = `panel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
                  appendPanel(id);
                  setActivePanelId(id);
                }}
                style={{ borderColor: calculatedTextColor, color: calculatedTextColor }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border px-6 py-3 rounded-full transition-all duration-200 shadow-sm backdrop-blur-md"
              >
                <Plus className="w-4 h-4" />
                Add Panel
              </button>
            </div>

          </div>

          {/* Brand Accent Line */}
          <div className="w-full h-1 rounded-full shrink-0 mt-8" style={{ backgroundColor: brandColor }} />
        </div>
      </section>

      {/* Footer Container */}
      <footer className="relative z-20 w-full shrink-0">
        <NavigationFooter />
      </footer>
    </div>
  );
}