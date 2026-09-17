'use client';

import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useAssetActions } from '../../../../hooks/useAssetActions';
import { Upload, X, Image as ImageIcon, Palette, Loader2 } from 'lucide-react';
import NavigationFooter from '../NavigationFooter';

export default function CoverPageBuilder() {
  const store = useEditorStore();
  const logoInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const subheadingRef = useRef(null);
  const titleRef = useRef(null);

  const { uploadAsset } = useAssetActions();

  // Root state resolution
  const rootCoverNode = store.sections?.find(s => s.id === "root-cover-page") || {};
  const coverData = rootCoverNode.data || {};

  const candidateInstructions = store.candidateInstructions || "";
  const brandColor = coverData.brandColor || "#1a688a";
  const logoUrl = coverData.logoUrl || "";
  const backgroundUrl = coverData.backgroundUrl || "";

  // Target scoped optimistic upload state targets
  const logoUploadState = store.activeUploads?.["root-cover-page_logoUrl"];
  const bgUploadState = store.activeUploads?.["root-cover-page_backgroundUrl"];

  // Dynamic Textarea Auto-Resizer
  const adjustTextareaHeight = (element) => {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight(subheadingRef.current);
  }, [candidateInstructions]);

  useEffect(() => {
    adjustTextareaHeight(titleRef.current);
  }, [rootCoverNode.title]);

  const updateCoverField = (field, value) => {
    store.updateSectionData("root-cover-page", { [field]: value });
    if (field === "brandColor") {
      store.setBrandColor(value);
    }
  };

  const handleRemoveMedia = (field, assetIdField) => {
    const existingAssetId = coverData[assetIdField];
    if (existingAssetId) {
      store.queueAssetForDeletion(existingAssetId);
    }
    updateCoverField(field, "");
    updateCoverField(assetIdField, null);
  };

  const handleFileChange = async (e, field, assetIdField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    await store.uploadAssetOptimistic({
      file,
      sectionId: "root-cover-page",
      targetField: field,
      assetIdField,
      uploadAssetFn: uploadAsset
    });
  };

  return (
    <div className="w-full flex items-center justify-center overflow-hidden py-4">
      <div className="w-[1280px] h-[720px] shrink-0 flex flex-col font-sans overflow-hidden select-none relative border border-slate-200 rounded-sm shadow-inner bg-slate-900 scale-75 origin-center my-[-90px] mx-[-160px]">
        
        {/* Background Image Layer (Full Cover) */}
        <div className="absolute inset-0 z-0 overflow-hidden group/bg">
          {backgroundUrl && (
            <img 
              src={backgroundUrl} 
              alt="Course Background" 
              className={`w-full h-full object-cover select-none pointer-events-none transition-opacity ${bgUploadState?.uploading ? 'opacity-30' : 'opacity-100'}`}
            />
          )}

          {/* Dynamic Translucent Brand Overlay */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none transition-colors duration-300 opacity-65" 
            style={{ backgroundColor: brandColor }} 
          />

          {/* Global Loading Indicator for Background Upload */}
          {bgUploadState?.uploading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm gap-4">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
              <div className="w-48 bg-slate-800 h-2 rounded-sm overflow-hidden border border-slate-700">
                <div className="bg-white h-full transition-all duration-150" style={{ width: `${bgUploadState.progress}%` }} />
              </div>
              <span className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">Uploading Background {bgUploadState.progress}%</span>
            </div>
          )}
        </div>

        {/* Top Left Area: Brand Accent Trigger & Logo Node */}
        <div className="absolute top-10 left-10 z-30 flex items-center gap-6">
          
          {/* Color Picker Overlay Badge */}
          <div className="relative group cursor-pointer">
            <div className="px-5 py-3 bg-white/90 hover:bg-white text-slate-800 rounded-sm shadow-md backdrop-blur-md transition-all flex items-center gap-2.5 text-sm font-semibold">
              <Palette className="w-5 h-5 shrink-0" style={{ color: brandColor }} />
              <span className="text-xs font-bold leading-none">Theme</span>
            </div>
            <input
              type="color"
              value={brandColor}
              onChange={(e) => updateCoverField("brandColor", e.target.value)}
              className="absolute inset-0 w-full h-full p-0 m-0 border-0 cursor-pointer opacity-0"
            />
          </div>

          {/* Logo Interactive Slot */}
          <div className="h-16 flex items-center group/logo relative">
            {logoUrl ? (
              <div className="relative h-full max-w-[240px] flex items-center px-4 py-2 rounded-sm bg-white/10 backdrop-blur-xs">
                <img 
                  src={logoUrl} 
                  alt="Company Logo" 
                  className={`max-h-full object-contain transition-opacity ${logoUploadState?.uploading ? 'opacity-40' : 'opacity-100'}`} 
                />
                
                {logoUploadState?.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-sm">
                    <Loader2 className="w-5 h-5 text-slate-700 animate-spin" />
                  </div>
                )}

                {!logoUploadState?.uploading && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia("logoUrl", "logoUrlAssetId")}
                    className="absolute -top-2.5 -right-2.5 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover/logo:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                disabled={logoUploadState?.uploading}
                onClick={() => logoInputRef.current?.click()}
                className="h-12 px-5 bg-white/90 backdrop-blur-md border border-white/50 rounded-sm shadow-md hover:bg-white transition-colors flex items-center gap-2.5 text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {logoUploadState?.uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600 shrink-0" />
                ) : (
                  <Upload className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <span className="leading-none">{logoUploadState?.uploading ? `${logoUploadState.progress}%` : 'Add Logo'}</span>
              </button>
            )}
            <input 
              ref={logoInputRef}
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileChange(e, "logoUrl", "logoUrlAssetId")} 
              className="hidden" 
            />
          </div>
        </div>

        {/* Main Structural Stage Layout */}
        <div className="relative flex-1 w-full z-20 flex flex-col justify-between pt-28">
          
          {/* Banner Title Container */}
          <div className="w-full mt-4 bg-white/95 backdrop-blur-md border-y border-white/40 shadow-2xl py-8 sm:py-10 px-8 sm:px-16 flex justify-center transition-all duration-150">
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="relative w-full flex flex-col items-center">
                <textarea
                  ref={titleRef}
                  rows={1}
                  value={rootCoverNode.title || ""}
                  onChange={(e) => {
                    store.updateSectionTitle("root-cover-page", e.target.value);
                    adjustTextareaHeight(e.target);
                  }}
                  placeholder="Enter Content Title..."
                  className="w-full text-center text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight bg-transparent border-b-2 border-slate-200 focus:border-slate-800 pb-3 focus:outline-none transition-colors placeholder:text-slate-300 resize-none overflow-hidden whitespace-pre-wrap"
                />
                <div 
                  className="h-[3px] transition-all duration-300 mt-[-3px]" 
                  style={{ backgroundColor: brandColor, width: rootCoverNode.title ? '100%' : '0%' }} 
                />
              </div>
            </div>
          </div>

          {/* Auto-Expanding Subtitle Area */}
          <div className="w-full flex justify-center my-auto pt-8 px-8">
            <div className="w-full max-w-2xl px-6 flex flex-col items-center">
              <textarea
                ref={subheadingRef}
                rows={1}
                value={candidateInstructions}
                onChange={(e) => {
                  store.setCandidateInstructions(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                placeholder="Click to add subheadings, course descriptions, or candidate directives regarding time allocation, navigation rules, or passing thresholds..."
                className="w-full text-center text-xl sm:text-2xl font-semibold leading-relaxed p-3 bg-transparent border-none focus:outline-none focus:ring-0 transition-all resize-none overflow-hidden whitespace-pre-wrap text-white placeholder:text-slate-300 drop-shadow-lg"
              />
            </div>
          </div>

          {/* Integrated Navigation Footer */}
          <div className="w-full z-40">
            <NavigationFooter 
              onPrev={() => store.navigatePrev?.()} 
              onNext={() => store.navigateNext?.()} 
            />
          </div>

        </div>

        {/* Bottom Right Floating Action Layer */}
        <div className="absolute bottom-16 right-10 z-50 pointer-events-auto">
          {!bgUploadState?.uploading && (
            backgroundUrl ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => bgInputRef.current?.click()}
                  className="bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-sm shadow-lg backdrop-blur-sm flex items-center gap-2.5 transition-colors cursor-pointer border border-slate-700/50"
                >
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span className="leading-none">Replace Background</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia("backgroundUrl", "backgroundUrlAssetId")}
                  className="bg-red-600/90 hover:bg-red-600 text-white p-3 rounded-sm shadow-lg backdrop-blur-sm transition-colors cursor-pointer flex items-center justify-center"
                >
                  <X className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => bgInputRef.current?.click()}
                className="bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-sm shadow-lg backdrop-blur-sm flex items-center gap-2.5 border border-slate-700/50 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="leading-none">Add Background Image</span>
              </button>
            )
          )}
          <input 
            ref={bgInputRef}
            type="file" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, "backgroundUrl", "backgroundUrlAssetId")} 
            className="hidden" 
          />
        </div>

      </div>
      
    </div>
  );
}