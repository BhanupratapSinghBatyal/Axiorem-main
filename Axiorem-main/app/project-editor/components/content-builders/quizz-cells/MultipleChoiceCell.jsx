'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, X, Image, Video, Music, Upload, Loader2, AlertCircle, Check } from 'lucide-react';
import { useAssetActions } from '../../../../../hooks/useAssetActions';
import { useEditorStore } from '../../../store/useEditorStore';
import { useQuizzStore } from '../store/useQuizzStore';
import { uploadEditorAsset } from '../utils/uploadEditorAsset';

export default function MultipleChoiceCell({ question: q }) {
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
  const updateOptionText = useQuizzStore((s) => s.updateOptionText);
  const addOption = useQuizzStore((s) => s.addOption);
  const deleteOption = useQuizzStore((s) => s.deleteOption);
  const toggleCorrectAnswer = useQuizzStore((s) => s.toggleCorrectAnswer);

  const fileInputRef = useRef(null);
  const activeBlobUrlRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (activeBlobUrlRef.current && activeBlobUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
    };
  }, []);

  const isActive = activeQuestionId === q.id;
  const correctAnswers = Array.isArray(q?.correctAnswers) ? q.correctAnswers : [];
  const options = Array.isArray(q?.options) ? q.options : [];

  const mediaType = q?.mediaType || null;
  const mediaUrl = q?.mediaUrl || null;

  const revokeActiveBlob = useCallback(() => {
    if (activeBlobUrlRef.current && activeBlobUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
  }, []);

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
          <div
            className="w-full flex items-center justify-between border-b border-slate-100 pb-3 gap-4"
            onClick={(e) => e.stopPropagation()}
          >
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
                  onClick={() => handleMediaToggle(type)}
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
                    <img
                      src={mediaUrl}
                      alt="Question media"
                      className="max-w-full max-h-52 object-contain"
                    />
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

        <div className="w-full flex flex-col gap-2.5" onClick={(e) => isActive && e.stopPropagation()}>
          {options.map((option, idx) => {
            const isCorrect = correctAnswers.includes(idx);
            const stableKey = `opt-${q.id}-${idx}`;

            return (
              <div
                key={stableKey}
                className={`relative w-full border p-3 flex items-center justify-between gap-3 transition-all ${
                  isCorrect
                    ? 'border-slate-900 bg-slate-900/5'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex-1 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!isActive}
                    onClick={() => toggleCorrectAnswer(q.id, idx)}
                    className={`w-5 h-5 rounded-none border flex items-center justify-center shrink-0 transition-all ${
                      isCorrect
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white hover:border-slate-900'
                    }`}
                  >
                    {isCorrect && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <input
                    type="text"
                    value={option ?? ''}
                    disabled={!isActive}
                    onChange={(e) => updateOptionText(q.id, idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className={`w-full text-sm font-medium bg-transparent focus:outline-none transition-colors ${
                      isCorrect ? 'text-slate-900 font-semibold' : 'text-slate-700'
                    }`}
                  />
                </div>

                {options.length > 1 && isActive && (
                  <button
                    type="button"
                    onClick={() => deleteOption(q.id, idx)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}

          {isActive && (
            <div className="w-full flex items-center justify-start mt-1">
              <button
                type="button"
                onClick={() => addOption(q.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 border border-slate-200 px-4 py-2 rounded-none hover:bg-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Option
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}