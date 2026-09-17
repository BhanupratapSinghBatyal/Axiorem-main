'use client';

import React, { useEffect, useMemo } from 'react';
import { useAssetActions } from '../../../../hooks/useAssetActions';
import { useCoursePresentationStore } from './store/useCoursePresentationStore';
import { useEditorStore } from '../../store/useEditorStore';
import { uploadEditorAsset } from './utils/uploadEditorAsset';
import { Upload, X, Loader2, Play, Music, Image as ImageIcon } from 'lucide-react';
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

function RenderMediaPreview({ url }) {
  if (!url) return null;
  
  const cleanUrl = url.split('?')[0].toLowerCase();
  
  const isVideo = cleanUrl.match(/\.(mp4|webm|ogg|mov|m4v)$/i) || url.includes('/video/');
  const isAudio = cleanUrl.match(/\.(mp3|wav|ogg|aac|m4a|flac)$/i) || url.includes('/audio/');

  if (isVideo) {
    return (
      <video 
        src={url} 
        controls 
        className="w-full h-full object-contain bg-black/5" 
      />
    );
  }

  if (isAudio) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 rounded-sm">
        <Music className="w-8 h-8 text-slate-500 mb-2" />
        <audio src={url} controls className="w-full max-w-xs" />
      </div>
    );
  }

  return (
    <img 
      src={url} 
      alt="Media Content" 
      className="w-full h-full object-contain" 
    />
  );
}

export default function CoursePresentationBuilder({ sectionId, section, data }) {
  const store = useCoursePresentationStore();
  const editorStore = useEditorStore();
  const storeBrandColor = useEditorStore((state) => state.brandColor);
  const sections = useEditorStore((state) => state.sections) || [];
  const projectId = useEditorStore((state) => state.projectId);
  const activeUploads = useEditorStore((state) => state.activeUploads);
  const { uploadAsset } = useAssetActions();

  useEffect(() => {
    if (sectionId) {
      store.initializeStore(sectionId, data || section?.data || {});
    }
  }, [sectionId, data, section]);

  const coverSection = useMemo(() => {
    return sections.find(
      (s) => s.id === 'root-cover-page' || s.contentType === 'cover_page' || s.type === 'cover'
    );
  }, [sections]);

  const coverData = coverSection?.data || {};

  const brandColor = storeBrandColor || coverData.brandColor || section?.data?.brandColor || '#1a688a';

  const rawBgImage = 
    section?.data?.backgroundImage || 
    coverData.backgroundUrl || 
    coverData.bgImage || 
    '';
    
  const bgTint = section?.data?.backgroundTint || `${brandColor}cc`;

  const bgImageUrl = typeof rawBgImage === 'object' && rawBgImage !== null
    ? (rawBgImage.url || rawBgImage.src || '')
    : String(rawBgImage || '');

  const calculatedTextColor = useMemo(() => getContrastColor(bgTint), [bgTint]);
  const titleTextColor = useMemo(() => getContrastColor(brandColor), [brandColor]);

  const updateGlobalProgress = (key, val) => {
    useEditorStore.setState((state) => {
      const activeUploads = { ...(state.activeUploads || {}) };
      if (val === null || val === undefined) {
        delete activeUploads[key];
      } else if (typeof val === 'object') {
        activeUploads[key] = val;
      } else {
        activeUploads[key] = { progress: val, stage: 'uploading' };
      }
      return { activeUploads };
    });
  };

  const currentTemplate = store.template;
  const title = store.title;
  const subtitle = store.subtitle;
  const body = store.body;
  const bodyType = store.bodyType;
  const bodyImage = store.bodyImage;
  const bodyLeft = store.bodyLeft;
  const bodyLeftType = store.bodyLeftType;
  const bodyLeftImage = store.bodyLeftImage;
  const bodyRight = store.bodyRight;
  const bodyRightType = store.bodyRightType;
  const bodyRightImage = store.bodyRightImage;

  const handleMediaUpload = async (field, assetIdField, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    const progressKey = `${sectionId}_${field}`;

    try {
      updateGlobalProgress(progressKey, 0);

      const uploadedAsset = await uploadEditorAsset({
        file,
        projectId,
        uploadAsset,
        setUploadProgress: (pct) => updateGlobalProgress(progressKey, pct),
        clearUploadProgress: () => updateGlobalProgress(progressKey, null),
        label: 'Presentation Media Asset',
      });

      const resolvedUrl = uploadedAsset?.url || uploadedAsset?.uploadUrl || '';
      const resolvedAssetId = uploadedAsset?.assetId || uploadedAsset?.id || null;

      if (resolvedUrl) {
        store.setMediaField(field, resolvedUrl, assetIdField, resolvedAssetId);
      }
    } finally {
      updateGlobalProgress(progressKey, null);
    }
  };

  const handleMediaRemove = (field, assetIdField) => {
    store.removeMediaField(field, assetIdField);
  };

  const isLeftAligned = currentTemplate === 'title_body' || currentTemplate === 'title_two_columns';

  const renderMediaSlot = (mediaUrl, field, assetIdField) => {
    const progressKey = `${sectionId}_${field}`;
    const uploadState = activeUploads?.[progressKey];
    const isUploading = uploadState !== undefined && uploadState !== null;

    const progressPct = typeof uploadState === 'object'
      ? Number(uploadState?.progress ?? uploadState?.pct ?? 0)
      : typeof uploadState === 'number'
      ? uploadState
      : 0;

    const stageLabel = typeof uploadState === 'object' && uploadState?.stage
      ? String(uploadState.stage)
      : `Uploading ${progressPct}%`;

    return (
      <div className="w-full h-full relative flex items-center justify-center bg-slate-50/50 border border-slate-200/50 rounded-sm overflow-hidden group/media">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-4 gap-2">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-150" 
                style={{ width: `${progressPct}%` }} 
              />
            </div>
            <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider">
              {stageLabel}
            </span>
          </div>
        ) : mediaUrl ? (
          <>
            <RenderMediaPreview url={mediaUrl} />
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 opacity-0 group-hover/media:opacity-100 transition-opacity pointer-events-none">
              <label className="pointer-events-auto cursor-pointer text-xs font-medium text-white bg-slate-900/80 hover:bg-slate-900 px-2.5 py-1 rounded-xs transition-colors flex items-center gap-1.5 shadow-xs backdrop-blur-xs">
                <Upload className="w-3.5 h-3.5" />
                Replace
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={(e) => handleMediaUpload(field, assetIdField, e)}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => handleMediaRemove(field, assetIdField)}
                className="pointer-events-auto cursor-pointer text-xs font-medium text-white bg-red-600/90 hover:bg-red-600 px-2.5 py-1 rounded-xs transition-colors flex items-center gap-1.5 shadow-xs backdrop-blur-xs"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 gap-2 text-center">
            <div className="flex gap-2 text-slate-400">
              <ImageIcon className="w-4 h-4" />
              <Play className="w-4 h-4" />
              <Music className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">No Media Uploaded</div>
            <label className="cursor-pointer text-xs font-medium text-slate-700 bg-slate-200/80 hover:bg-slate-300/80 px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              Upload Media
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={(e) => handleMediaUpload(field, assetIdField, e)}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[1280px] h-[720px] shrink-0 shadow-md border border-slate-300 relative select-text flex flex-col justify-between p-0 box-border [box-shadow:0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.02)] scale-75 origin-center my-[-90px] mx-[-160px] overflow-hidden isolate">
      
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

      {/* Template Selector Control */}
      <div className="absolute top-8 left-8 z-30">
        <select
          value={currentTemplate}
          onChange={(e) => store.updateField('template', e.target.value)}
          className="text-xs font-bold text-slate-700 bg-white/90 border border-white/50 rounded-sm px-4 py-2.5 outline-none focus:border-slate-800 cursor-pointer shadow-md backdrop-blur-md transition-all"
        >
          <option value="title_subtitle">Title Slide</option>
          <option value="title_only">Section Header (Title Only)</option>
          <option value="title_body">Title and Body</option>
          <option value="title_two_columns">Title and 2 Columns</option>
        </select>
      </div>

      {/* Main Content Container with scoped padding */}
      <div className="w-full flex-1 z-20 flex flex-col min-h-0 pt-20 px-12 pb-4">
        <div className={`w-full flex-1 flex flex-col min-h-0 ${
          isLeftAligned ? 'justify-start items-start gap-3 text-left' : 'max-w-4xl mx-auto justify-center items-center text-center gap-6'
        }`}>
          <div className={`w-full border border-dashed border-transparent hover:border-slate-300/80 focus-within:border-blue-500/80 transition-all rounded-xs p-2 ${
            isLeftAligned ? 'text-left' : 'text-center'
          }`}>
            <input
              type="text"
              value={title}
              onChange={(e) => store.updateField('title', e.target.value)}
              placeholder="Click to add title"
              className={`w-full font-black tracking-tight bg-transparent focus:outline-none placeholder:text-current placeholder:opacity-50 font-sans ${
                isLeftAligned ? 'text-3xl lg:text-4xl text-left' : 'text-4xl sm:text-5xl text-center'
              }`}
              style={{ color: titleTextColor }}
            />
          </div>

          {currentTemplate === 'title_subtitle' && (
            <div className="w-full max-w-2xl border border-dashed border-transparent hover:border-slate-300/80 focus-within:border-blue-500/80 transition-all rounded-xs p-2">
              <input
                type="text"
                value={subtitle}
                onChange={(e) => store.updateField('subtitle', e.target.value)}
                placeholder="Click to add subtitle"
                className="w-full text-xl sm:text-2xl font-semibold bg-transparent text-center focus:outline-none placeholder:text-current placeholder:opacity-50 font-sans leading-relaxed drop-shadow-lg"
                style={{ color: calculatedTextColor }}
              />
            </div>
          )}

          {currentTemplate === 'title_body' && (
            <div className="w-full flex-1 border border-dashed border-transparent hover:border-slate-300/80 focus-within:border-blue-500/80 transition-all rounded-xs mt-1 relative flex flex-col group min-h-0">
              <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <select
                  value={bodyType === 'image' ? 'media' : bodyType}
                  onChange={(e) => store.updateField('bodyType', e.target.value)}
                  className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded-sm px-1.5 py-0.5 outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                >
                  <option value="text">Text Block</option>
                  <option value="media">Media Block</option>
                </select>
              </div>

              {bodyType === 'text' ? (
                <textarea
                  value={body}
                  onChange={(e) => store.updateField('body', e.target.value)}
                  placeholder="Click to add text"
                  style={{ color: calculatedTextColor }}
                  className="w-full h-full p-2 text-xl lg:text-2xl font-normal bg-transparent text-left focus:outline-none placeholder:text-current placeholder:opacity-50 font-sans resize-none leading-relaxed"
                />
              ) : (
                renderMediaSlot(bodyImage, 'bodyImage', 'bodyImageAssetId')
              )}
            </div>
          )}

          {currentTemplate === 'title_two_columns' && (
            <div className="w-full flex-1 grid grid-cols-2 gap-6 mt-1 min-h-0">
              <div className={`transition-all rounded-sm relative flex flex-col group min-h-0 ${
                bodyLeftType === 'text' 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 focus-within:border-blue-500/80 p-4 shadow-lg' 
                  : 'border border-dashed border-transparent hover:border-slate-300/80 focus-within:border-blue-500/80'
              }`}>
                <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <select
                    value={bodyLeftType === 'image' ? 'media' : bodyLeftType}
                    onChange={(e) => store.updateField('bodyLeftType', e.target.value)}
                    className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded-sm px-1.5 py-0.5 outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                  >
                    <option value="text">Text Block</option>
                    <option value="media">Media Block</option>
                  </select>
                </div>

                {bodyLeftType === 'text' ? (
                  <textarea
                    value={bodyLeft}
                    onChange={(e) => store.updateField('bodyLeft', e.target.value)}
                    placeholder="Click to add text"
                    style={{ color: calculatedTextColor }}
                    className="w-full h-full text-xl lg:text-2xl font-normal bg-transparent text-left focus:outline-none placeholder:text-current placeholder:opacity-50 font-sans resize-none leading-relaxed"
                  />
                ) : (
                  renderMediaSlot(bodyLeftImage, 'bodyLeftImage', 'bodyLeftImageAssetId')
                )}
              </div>

              <div className={`transition-all rounded-sm relative flex flex-col group min-h-0 ${
                bodyRightType === 'text' 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 focus-within:border-blue-500/80 p-4 shadow-lg' 
                  : 'border border-dashed border-transparent hover:border-slate-300/80 focus-within:border-blue-500/80'
              }`}>
                <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <select
                    value={bodyRightType === 'image' ? 'media' : bodyRightType}
                    onChange={(e) => store.updateField('bodyRightType', e.target.value)}
                    className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded-sm px-1.5 py-0.5 outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                  >
                    <option value="text">Text Block</option>
                    <option value="media">Media Block</option>
                  </select>
                </div>

                {bodyRightType === 'text' ? (
                  <textarea
                    value={bodyRight}
                    onChange={(e) => store.updateField('bodyRight', e.target.value)}
                    placeholder="Click to add text"
                    style={{ color: calculatedTextColor }}
                    className="w-full h-full text-xl lg:text-2xl font-normal bg-transparent text-left focus:outline-none placeholder:text-current placeholder:opacity-50 font-sans resize-none leading-relaxed"
                  />
                ) : (
                  renderMediaSlot(bodyRightImage, 'bodyRightImage', 'bodyRightImageAssetId')
                )}
              </div>
            </div>
          )}
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
  );
}