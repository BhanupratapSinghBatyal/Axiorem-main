'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Trash2, Upload, X, Image, Video, Music, Loader2, AlertCircle } from 'lucide-react';
import { useAssetActions } from '../../../../../hooks/useAssetActions';
import { useEditorStore } from '../../../store/useEditorStore';
import { useQuizzStore } from '../store/useQuizzStore';
import { uploadEditorAsset } from '../utils/uploadEditorAsset';

export default function TextualCell({ question: q }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressPercent, setUploadProgressPercent] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const { uploadAsset } = useAssetActions();
  const projectId = useEditorStore((state) => state.projectId);

  const activeQuestionId = useQuizzStore((s) => s.activeQuestionId);
  const setActiveQuestionId = useQuizzStore((s) => s.setActiveQuestionId);
  const deleteQuestion = useQuizzStore((s) => s.deleteQuestion);
  const updateQuestionField = useQuizzStore((s) => s.updateQuestionField);
  const changeQuestionType = useQuizzStore((s) => s.changeQuestionType);
  const updateTextualConstraints = useQuizzStore((s) => s.updateTextualConstraints);

  const fileInputRef = useRef(null);
  const activeBlobUrlRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const revokeActiveBlob = useCallback(() => {
    if (activeBlobUrlRef.current && activeBlobUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (activeBlobUrlRef.current && activeBlobUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
    };
  }, []);

  const isActive = activeQuestionId === q?.id;
  const mediaType = q?.mediaType || null;
  const mediaUrl = q?.mediaUrl || null;

  const minChars = q?.minCharacters ?? 0;
  const maxChars = q?.maxCharacters ?? 1000;

  const handleMediaToggle = (type) => {
    revokeActiveBlob();
    setUploadError(null);
    if (mediaType === type) {
      updateQuestionField(q.id, 'mediaType', null);
      updateQuestionField(q.id, 'mediaUrl', null);
      updateQuestionField(q.id, 'mediaAssetId', null);
    } else {
      updateQuestionField(q.id, 'mediaType', type);
      updateQuestionField(q.id, 'mediaUrl', null);
      updateQuestionField(q.id, 'mediaAssetId', null);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    revokeActiveBlob();
    setUploadError(null);

    const previewUrl = URL.createObjectURL(file);
    activeBlobUrlRef.current = previewUrl;
    updateQuestionField(q.id, 'mediaUrl', previewUrl);

    setIsUploading(true);
    setUploadProgressPercent(0);

    try {
      const uploadedAsset = await uploadEditorAsset({
        file,
        projectId,
        uploadAsset,
        setUploadProgress: (arg1, arg2) => {
          const raw = typeof arg2 === 'number' ? arg2 : arg1;
          const val = typeof raw === 'number' ? raw : parseFloat(raw);
          const sanitized = Number.isNaN(val) ? 0 : Math.min(100, Math.max(0, Math.round(val)));
          setUploadProgressPercent(sanitized);
        },
        clearUploadProgress: () => setUploadProgressPercent(100),
        label: 'Quiz Media Asset',
      });

      const resolvedUrl = uploadedAsset?.url || uploadedAsset?.uploadUrl || '';
      const resolvedAssetId = uploadedAsset?.assetId || uploadedAsset?.id || null;

      if (resolvedUrl) {
        revokeActiveBlob();
        updateQuestionField(q.id, 'mediaUrl', resolvedUrl);
        updateQuestionField(q.id, 'mediaAssetId', resolvedAssetId);
      } else {
        throw new Error('Asset upload failed to return remote URL.');
      }
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
      revokeActiveBlob();
      updateQuestionField(q.id, 'mediaUrl', null);
      updateQuestionField(q.id, 'mediaAssetId', null);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeMedia = (e) => {
    e.stopPropagation();
    revokeActiveBlob();
    setUploadError(null);
    updateQuestionField(q.id, 'mediaUrl', null);
    updateQuestionField(q.id, 'mediaType', null);
    updateQuestionField(q.id, 'mediaAssetId', null);
  };

  const handleMinCharsChange = (val) => {
    const parsed = Math.max(0, parseInt(val, 10) || 0);
    const validMax = Math.max(parsed, maxChars);
    updateTextualConstraints(q.id, parsed, validMax);
  };

  const handleMaxCharsChange = (val) => {
    const parsed = Math.max(1, parseInt(val, 10) || 1);
    const validMin = Math.min(minChars, parsed);
    updateTextualConstraints(q.id, validMin, parsed);
  };

  const handleWeightChange = (e) => {
    const parsed = parseInt(e.target.value, 10);
    updateQuestionField(q.id, 'points', Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
  };

  if (!isMounted) {
    return (
      <div className="w-full text-slate-900 font-sans">
        <div className="w-full bg-white rounded-none p-6 border border-slate-200 flex flex-col gap-4">
          <div className="h-6 w-full bg-slate-100 rounded-none animate-pulse" />
          <div className="h-12 w-full bg-slate-50 rounded-none animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 font-sans select-none">
      <div 
        onClick={() => !isActive && setActiveQuestionId(q.id)}
        className={`w-full bg-white rounded-none p-6 border transition-all flex flex-col gap-5 relative ${
          isActive ? 'border-slate-900 shadow-xl ring-1 ring-slate-900' : 'border-slate-200'
        }`}
      >
        {isActive && (
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex bg-slate-100 p-0.5 rounded-none border border-slate-200">
              <button 
                type="button" 
                onClick={() => changeQuestionType(q.id, 'mcq')} 
                className={`px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  q.type === 'mcq' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Choice
              </button>
              <button 
                type="button" 
                onClick={() => changeQuestionType(q.id, 'textual')} 
                className={`px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  q.type === 'textual' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Text Block
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>Points:</span>
                <input 
                  type="number" 
                  value={q.points ?? 0} 
                  onChange={handleWeightChange} 
                  className="w-10 bg-transparent text-center text-slate-900 font-bold font-mono focus:outline-none" 
                  min="0" 
                />
              </div>
              <button 
                type="button" 
                onClick={() => deleteQuestion(q.id)} 
                className="p-1.5 rounded-none text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-1" onClick={(e) => isActive && e.stopPropagation()}>
          <input 
            type="text" 
            value={q.title ?? ''} 
            disabled={!isActive}
            onChange={(e) => updateQuestionField(q.id, 'title', e.target.value)} 
            placeholder="Question Heading" 
            className="w-full text-xl font-bold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-300 placeholder:font-normal leading-tight" 
          />
        </div>

        <div className="w-full flex flex-col gap-3" onClick={(e) => isActive && e.stopPropagation()}>
          {isActive && (
            <div className="flex bg-slate-100 p-0.5 rounded-none border border-slate-200 w-fit gap-0.5">
              {['image', 'video', 'audio'].map((type) => (
                <button 
                  key={type} 
                  type="button" 
                  disabled={!isActive} 
                  onClick={(e) => { e.stopPropagation(); handleMediaToggle(type); }} 
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    mediaType === type ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {type === 'image' && <Image className="w-3 h-3" />}
                  {type === 'video' && <Video className="w-3 h-3" />}
                  {type === 'audio' && <Music className="w-3 h-3" />}
                  {type}
                </button>
              ))}
            </div>
          )}
          
          {mediaType && (
            <div className="w-full border border-dashed border-slate-300 rounded-none bg-slate-50 p-4 relative flex flex-col items-center justify-center">
              {isUploading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                  <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
                  <span className="text-xs font-mono font-semibold text-slate-900">
                    Uploading {uploadProgressPercent}%
                  </span>
                  <div className="w-32 h-1 bg-slate-200 rounded-none overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 transition-all duration-150" 
                      style={{ width: `${uploadProgressPercent}%` }} 
                    />
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="w-full mb-2 p-2.5 bg-red-50 border border-red-200 rounded-none text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="flex-1 font-medium leading-tight">{uploadError}</span>
                </div>
              )}

              {mediaUrl ? (
                <div className="relative w-full max-h-52 flex items-center justify-center overflow-hidden bg-black/5 border border-slate-200">
                  {isActive && (
                    <button 
                      type="button" 
                      onClick={removeMedia} 
                      className="absolute top-2 right-2 p-1.5 bg-slate-900 text-white hover:bg-red-600 transition-colors z-10 shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {mediaType === 'image' && (
                    <img src={mediaUrl} alt="Uploaded asset" className="max-w-full max-h-52 object-contain" />
                  )}
                  {mediaType === 'video' && (
                    <video 
                      src={mediaUrl} 
                      controls 
                      preload="metadata" 
                      playsInline 
                      className="max-w-full max-h-52 w-full object-contain" 
                    />
                  )}
                  {mediaType === 'audio' && (
                    <audio 
                      src={mediaUrl} 
                      controls 
                      preload="metadata" 
                      className="w-full px-4 py-2" 
                    />
                  )}
                </div>
              ) : (
                <div 
                  onClick={() => isActive && !isUploading && fileInputRef.current?.click()} 
                  className={`flex flex-col items-center justify-center py-6 w-full ${
                    isActive ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'
                  } transition-colors`}
                >
                  <Upload className="w-5 h-5 text-slate-400 mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Select {mediaType} file to upload
                  </span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept={`${mediaType}/*`} 
                className="hidden" 
              />
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-2" onClick={(e) => isActive && e.stopPropagation()}>
          <textarea 
            value={q.question ?? ''} 
            disabled={!isActive}
            rows={2}
            onChange={(e) => updateQuestionField(q.id, 'question', e.target.value)} 
            className="w-full text-sm font-normal text-slate-700 bg-transparent focus:outline-none placeholder:text-slate-300 resize-none leading-relaxed" 
            placeholder="Enter question prompt or description..." 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4" onClick={(e) => isActive && e.stopPropagation()}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Min Characters</label>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-none">
              <input 
                type="number" 
                value={minChars} 
                disabled={!isActive}
                onChange={(e) => handleMinCharsChange(e.target.value)} 
                className="w-full bg-transparent text-xs font-bold font-mono text-slate-900 focus:outline-none" 
                min="0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Max Characters</label>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-none">
              <input 
                type="number" 
                value={maxChars} 
                disabled={!isActive}
                onChange={(e) => handleMaxCharsChange(e.target.value)} 
                className="w-full bg-transparent text-xs font-bold font-mono text-slate-900 focus:outline-none" 
                min="1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}