'use client';

import React, { useEffect, useState, useId, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, SlidersHorizontal, Trash2, Clock, CheckCircle2, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useQuizzStore } from './store/useQuizzStore';
import { useEditorStore } from '../../store/useEditorStore';
import MultipleChoiceCell from './quizz-cells/MultipleChoiceCell';
import TextualCell from './quizz-cells/TextualCell';

// Helper function to calculate WCAG contrast color (returns black or white)
function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') return '#ffffff';
  
  const cleanHex = hexColor.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  
  // Perceived luminance formula (YIQ)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#0f172a' : '#ffffff';
}

// Custom Accessible & Styled Checkbox Component
function CustomCheckbox({ id, checked, onChange, label }) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-slate-200 cursor-pointer select-none group">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-4 h-4 rounded-none border border-white/20 bg-black/40 transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-white/40 peer-checked:bg-white peer-checked:border-white group-hover:border-white/40" />
        <Check className="w-3 h-3 text-slate-950 absolute opacity-0 peer-checked:opacity-100 transition-opacity duration-150 stroke-[3]" />
      </div>
      <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}

export default function InteractiveQuizzBuilder({ sectionId, section }) {
  const shuffleId = useId();
  const revealAnswersId = useId();
  const revealResultsId = useId();

  // Store actions
  const initializeStore = useQuizzStore((s) => s.initializeStore);
  const setTitle = useQuizzStore((s) => s.setTitle);
  const setShuffleQuestions = useQuizzStore((s) => s.setShuffleQuestions);
  const setTimeLimit = useQuizzStore((s) => s.setTimeLimit);
  const setPassingScore = useQuizzStore((s) => s.setPassingScore);
  const setRevealAnswers = useQuizzStore((s) => s.setRevealAnswers);
  const setRevealResults = useQuizzStore((s) => s.setRevealResults);
  const addQuestion = useQuizzStore((s) => s.addQuestion);
  const deleteQuestion = useQuizzStore((s) => s.deleteQuestion);

  // Store state readouts
  const storeQuestions = useQuizzStore((s) => s.questions);
  const storeTitle = useQuizzStore((s) => s.sectionTitle);
  const storeShuffle = useQuizzStore((s) => s.shuffleQuestions);
  const storeTimeLimit = useQuizzStore((s) => s.timeLimit);
  const storePassingScore = useQuizzStore((s) => s.passingScore);
  const storeRevealAnswers = useQuizzStore((s) => s.revealAnswers);
  const storeRevealResults = useQuizzStore((s) => s.revealResults);

  const storeBrandColor = useEditorStore((s) => s.brandColor);
  const sections = useEditorStore((state) => state.sections) || [];
  const setActiveSectionId = useEditorStore((state) => state.setActiveSectionId);

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

  const [showConfig, setShowConfig] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Determine section navigation bounds
  const currentSectionIndex = useMemo(
    () => sections.findIndex((s) => s.id === sectionId),
    [sections, sectionId]
  );
  
  const prevSection = useMemo(
    () => (currentSectionIndex > 0 ? sections[currentSectionIndex - 1] : null),
    [sections, currentSectionIndex]
  );

  const nextSection = useMemo(
    () => (currentSectionIndex !== -1 && currentSectionIndex < sections.length - 1 ? sections[currentSectionIndex + 1] : null),
    [sections, currentSectionIndex]
  );

  const isFirstQuestion = currentSlideIndex === 0;
  const isLastQuestion = currentSlideIndex === storeQuestions.length - 1 && storeQuestions.length > 0;

  // Dynamic contrast color computation for the brand element button
  const configBtnTextColor = useMemo(() => getContrastColor(brandColor), [brandColor]);

  // Initialize store safely
  useEffect(() => {
    if (sectionId && section?.data) {
      initializeStore(sectionId, section.data);
    }
  }, [sectionId, section?.data, initializeStore]);

  // Sync index bounds on list changes
  useEffect(() => {
    if (storeQuestions.length > 0 && currentSlideIndex >= storeQuestions.length) {
      setCurrentSlideIndex(storeQuestions.length - 1);
    }
  }, [storeQuestions.length, currentSlideIndex]);

  const activeQuestion = storeQuestions[currentSlideIndex];

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(storeQuestions.length - 1, prev + 1));
  }, [storeQuestions.length]);

  const handlePrevSection = useCallback(() => {
    if (prevSection) {
      setActiveSectionId(prevSection.id);
    }
  }, [prevSection, setActiveSectionId]);

  const handleNextSection = useCallback(() => {
    if (nextSection) {
      setActiveSectionId(nextSection.id);
    }
  }, [nextSection, setActiveSectionId]);

  const handleAddNewQuestion = useCallback(() => {
    addQuestion();
    setCurrentSlideIndex(storeQuestions.length);
  }, [addQuestion, storeQuestions.length]);

  const handleDeleteCurrentQuestion = useCallback(() => {
    if (!activeQuestion) return;
    deleteQuestion(activeQuestion.id);
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  }, [activeQuestion, deleteQuestion]);

  const handleTimeLimitChange = (e) => {
    const parsed = parseInt(e.target.value, 10);
    setTimeLimit(Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
  };

  const handlePassingScoreChange = (e) => {
    const parsed = parseInt(e.target.value, 10);
    const sanitized = Number.isNaN(parsed) ? 0 : parsed;
    setPassingScore(Math.min(100, Math.max(0, sanitized)));
  };

  return (
    <section className="relative w-full max-w-5xl mx-auto my-6 rounded-none overflow-hidden font-sans border border-slate-800 shadow-2xl isolate">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 pointer-events-none"
        style={{
          backgroundImage: bgImageUrl ? `url("${bgImageUrl}")` : 'none',
          backgroundColor: '#0f172a',
        }}
      />

      {/* Background Tint Overlay */}
      <div 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none transition-colors duration-300"
        style={{ backgroundColor: bgTint }}
      />

      {/* Structural Glass Canvas */}
      <div className="relative z-20 w-full flex flex-col text-slate-100">
        
        {/* Header */}
        <header className="border-b border-white/10 p-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <input
              id={`heading-${sectionId}`}
              type="text"
              value={storeTitle || ''}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assessment Title"
              className="text-2xl font-bold bg-transparent text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-white/20 rounded-none px-2 py-1 -ml-2 border-none w-full max-w-xl transition-all"
            />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {storeTimeLimit > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-mono font-medium bg-black/40 border border-white/10 text-slate-200 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {storeTimeLimit}m
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-mono font-medium bg-black/40 border border-white/10 text-slate-200 whitespace-nowrap shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Pass: {storePassingScore}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowConfig((prev) => !prev)}
                style={{
                  backgroundColor: getContrastColor(brandColor),
                  color: configBtnTextColor,
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-none shadow-md border border-white/20 hover:brightness-110 active:scale-95 transition-all ${
                  showConfig ? 'ring-2 ring-white/50' : ''
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: getContrastColor(brandColor) === '#ffffff' ? brandColor : '#ffffff'}} /> <span style={{color: getContrastColor(brandColor) === '#ffffff' ? brandColor : '#ffffff'}}>Configure</span> 
              </button>
            </div>
          </div>

          {/* Inline Rules Toolbar */}
          {showConfig && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-medium">Time Limit (Min)</label>
                <input
                  type="number"
                  value={storeTimeLimit}
                  onChange={handleTimeLimitChange}
                  className="bg-black/50 border border-white/10 rounded-none px-3 py-1.5 text-slate-100 focus:outline-none focus:border-white/30 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-medium">Passing Score (%)</label>
                <input
                  type="number"
                  value={storePassingScore}
                  onChange={handlePassingScoreChange}
                  className="bg-black/50 border border-white/10 rounded-none px-3 py-1.5 text-slate-100 focus:outline-none focus:border-white/30 font-mono"
                />
              </div>

              <div className="flex flex-col justify-end py-1">
                <CustomCheckbox
                  id={shuffleId}
                  checked={storeShuffle}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  label="Shuffle Order"
                />
              </div>

              <div className="flex flex-col justify-end py-1">
                <CustomCheckbox
                  id={revealAnswersId}
                  checked={storeRevealAnswers}
                  onChange={(e) => setRevealAnswers(e.target.checked)}
                  label="Reveal Answers"
                />
              </div>

              <div className="flex flex-col justify-end py-1">
                <CustomCheckbox
                  id={revealResultsId}
                  checked={storeRevealResults}
                  onChange={(e) => setRevealResults(e.target.checked)}
                  label="Reveal Results"
                />
              </div>
            </div>
          )}
        </header>

        {/* Editor Main Canvas */}
        <div className="p-8">
          {storeQuestions.length === 0 || !activeQuestion ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <p className="text-slate-300 text-sm">No evaluation questions have been defined.</p>
              <button
                type="button"
                onClick={handleAddNewQuestion}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold px-4 py-2 rounded-none transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-white/10 pb-3">
                <span>Question {currentSlideIndex + 1} of {storeQuestions.length}</span>
                <button
                  type="button"
                  onClick={handleDeleteCurrentQuestion}
                  className="text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Question
                </button>
              </div>

              <div className="bg-white rounded-none text-slate-900 shadow-xl overflow-hidden">
                {activeQuestion.type === 'mcq' ? (
                  <MultipleChoiceCell question={activeQuestion} />
                ) : (
                  <TextualCell question={activeQuestion} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <footer className="border-t border-white/10 px-8 py-4 flex items-center justify-between bg-black/20">
          <button
            type="button"
            onClick={handleAddNewQuestion}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3.5 py-2 rounded-none transition-all"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>

          <div className="flex items-center gap-3">
            {isFirstQuestion && (
              <button
                type="button"
                disabled={!prevSection}
                onClick={handlePrevSection}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 rounded-none transition-all disabled:opacity-30 disabled:hover:bg-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous Section
              </button>
            )}

            <button
              type="button"
              disabled={currentSlideIndex === 0}
              onClick={handlePrevSlide}
              className="p-2 rounded-none border border-white/10 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400">
              {storeQuestions.length > 0 ? `${currentSlideIndex + 1} / ${storeQuestions.length}` : '0 / 0'}
            </span>
            <button
              type="button"
              disabled={currentSlideIndex === storeQuestions.length - 1 || storeQuestions.length === 0}
              onClick={handleNextSlide}
              className="p-2 rounded-none border border-white/10 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {isLastQuestion && (
              <button
                type="button"
                disabled={!nextSection}
                onClick={handleNextSection}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 rounded-none transition-all disabled:opacity-30 disabled:hover:bg-white/10"
              >
                Next Section <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}