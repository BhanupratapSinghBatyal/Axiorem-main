'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Check, X, Award, AlertTriangle, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEditorStore } from '../../../store/useEditorStore';
import { SourceHoverTarget } from '../SourceTooltip';
import BoldText from '../BoldText';

function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') return '#ffffff';

  const cleanHex = hexColor.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#0f172a' : '#ffffff';
}

export default function InteractiveQuizzView({ sectionId, title, section, data = {} }) {
  const storeBrandColor = useEditorStore((s) => s.brandColor);
  const sections = useEditorStore((state) => state.sections) || [];
  const setActiveSectionId = useEditorStore((state) => state.setActiveSectionId);

  // Section position determination (matches builder navigation)
  const currentSectionIndex = useMemo(
    () => sections.findIndex((s) => s.id === (sectionId || section?.id)),
    [sections, sectionId, section?.id]
  );

  const prevSection = useMemo(
    () => (currentSectionIndex > 0 ? sections[currentSectionIndex - 1] : null),
    [sections, currentSectionIndex]
  );

  const nextSection = useMemo(
    () => (currentSectionIndex !== -1 && currentSectionIndex < sections.length - 1 ? sections[currentSectionIndex + 1] : null),
    [sections, currentSectionIndex]
  );

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

  const coverSection = useMemo(() => {
    return sections.find(
      (s) => s.id === 'root-cover-page' || s.contentType === 'cover_page' || s.type === 'cover'
    );
  }, [sections]);

  const coverData = coverSection?.data || {};

  const brandColor = storeBrandColor || coverData.brandColor || section?.data?.brandColor || data.brandColor || '#1a688a';

  const rawBgImage = 
    section?.data?.backgroundImage || 
    coverData.backgroundUrl || 
    coverData.bgImage || 
    data.backgroundImage || 
    '';

  const bgTint = section?.data?.backgroundTint || data.backgroundTint || `${brandColor}cc`;

  const bgImageUrl = typeof rawBgImage === 'object' && rawBgImage !== null
    ? (rawBgImage.url || rawBgImage.src || '')
    : String(rawBgImage || '');

  const calculatedTextColor = useMemo(() => getContrastColor(bgTint), [bgTint]);

  const { 
    sectionTitle,
    shuffleQuestions = false,
    randomize = false,
    revealResults,
    showResults,
    timeLimit = 0,
    passingScore = 80,
    revealAnswers = false
  } = data;

  const shouldRevealResults = revealResults ?? showResults ?? true;

  const isRandomEnabled = shuffleQuestions || randomize;
  const originalQuestions = data.questions || [];

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [quizEnded, setQuizEnded] = useState(false);
  const [endReason, setEndReason] = useState(null);

  useEffect(() => {
    if (isRandomEnabled && originalQuestions.length > 0) {
      const shuffled = [...originalQuestions].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
    } else {
      setShuffledQuestions([...originalQuestions]);
    }
  }, [originalQuestions, isRandomEnabled]);

  useEffect(() => {
    if (timeLimit > 0 && timeRemaining > 0 && !quizEnded) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setEndReason('timeout');
            setQuizEnded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLimit, timeRemaining, quizEnded]);

  const totalQuestions = shuffledQuestions.length;
  const activeQuestion = shuffledQuestions[currentSlideIndex];

  const scoreMetrics = useMemo(() => {
    let earnedPoints = 0;
    let totalPossiblePoints = 0;

    shuffledQuestions.forEach((q) => {
      const points = typeof q.points === 'number' ? q.points : 1;
      totalPossiblePoints += points;

      if (q.type === 'mcq') {
        const correctAnswers = q.correctAnswers || [];
        const userSelections = selectedAnswers[q.id];

        if (correctAnswers.length > 1) {
          const userArr = Array.isArray(userSelections) ? userSelections : [];
          const isMatch = 
            userArr.length === correctAnswers.length &&
            userArr.every((idx) => correctAnswers.includes(idx));
          if (isMatch) earnedPoints += points;
        } else {
          if (userSelections === correctAnswers[0]) earnedPoints += points;
        }
      }
    });

    const percentage = totalPossiblePoints > 0 ? Math.round((earnedPoints / totalPossiblePoints) * 100) : 0;
    const isPassed = percentage >= passingScore;

    return { earnedPoints, totalPossiblePoints, percentage, isPassed };
  }, [shuffledQuestions, selectedAnswers, passingScore]);

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < totalQuestions - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleSubmitQuiz = () => {
    setEndReason('submitted');
    setQuizEnded(true);
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (quizEnded) return;

    setSelectedAnswers((prev) => {
      const targetQuestion = shuffledQuestions.find((q) => q.id === questionId);
      const correctAnswers = targetQuestion?.correctAnswers || [];
      const allowsMultiple = correctAnswers.length > 1;

      if (allowsMultiple) {
        const currentSelections = Array.isArray(prev[questionId]) ? prev[questionId] : [];
        const newSelections = currentSelections.includes(optionIndex)
          ? currentSelections.filter((idx) => idx !== optionIndex)
          : [...currentSelections, optionIndex];

        return { ...prev, [questionId]: newSelections };
      } else {
        return { ...prev, [questionId]: optionIndex };
      }
    });
  };

  const handleTextChange = (questionId, value) => {
    if (quizEnded) return;

    setTextAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <SourceHoverTarget as="section" source={section?.source} className="relative w-full h-full min-h-full flex flex-col rounded-none overflow-hidden font-sans border-none shadow-none isolate flex-1">
      
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 pointer-events-none"
        style={{
          backgroundImage: bgImageUrl ? `url("${bgImageUrl}")` : 'none',
          backgroundColor: '#0f172a',
        }}
      />

      <div 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none transition-colors duration-300"
        style={{ backgroundColor: bgTint }}
      />

      <div className="relative z-20 w-full h-full flex flex-col flex-1 justify-between text-slate-100">
        
        <header className="border-b border-white/10 px-8 py-6 md:px-12 md:py-8 flex flex-col gap-4 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 
              style={{ color: calculatedTextColor }}
              className="text-3xl md:text-4xl font-extrabold bg-transparent tracking-tight border-none p-0 m-0 leading-tight"
            >
              <BoldText>{title || sectionTitle || "Interactive Quiz"}</BoldText>
            </h1>

            <div className="flex items-center gap-3">
              {timeLimit > 0 && (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-none text-sm md:text-base font-mono font-semibold border backdrop-blur-md ${
                  quizEnded 
                    ? 'bg-red-500/20 text-red-200 border-red-400/30' 
                    : 'bg-black/40 border-white/10 text-slate-200'
                }`}>
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0" />
                  <span>{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-none text-sm md:text-base font-mono font-semibold bg-black/40 border border-white/10 text-slate-200 shrink-0">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0" />
                <span>Pass: {passingScore}%</span>
              </span>
            </div>
          </div>
        </header>

        <div className="px-8 py-6 md:px-12 md:py-10 flex-1 min-h-0 flex flex-col justify-start relative overflow-y-auto">
          {quizEnded ? (
            <div className="max-w-3xl w-full mx-auto flex flex-col items-center justify-center text-center p-8 md:p-12">
              {!shouldRevealResults ? (
                <>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 border-2 border-white/20 rounded-none flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>

                  <h2 
                    style={{ color: calculatedTextColor }}
                    className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4"
                  >
                    Thank You
                  </h2>

                  <p 
                    style={{ color: calculatedTextColor }}
                    className="text-lg md:text-xl font-medium max-w-xl opacity-90 leading-relaxed"
                  >
                    Your evaluation responses have been submitted successfully.
                  </p>
                </>
              ) : endReason === 'timeout' ? (
                <>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500/20 border-2 border-red-500/40 rounded-none flex items-center justify-center mb-6">
                    <Clock className="w-10 h-10 md:w-12 md:h-12 text-red-400" />
                  </div>

                  <h2 
                    style={{ color: calculatedTextColor }}
                    className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4"
                  >
                    Time Expired
                  </h2>

                  <p 
                    style={{ color: calculatedTextColor }}
                    className="text-lg md:text-xl font-medium max-w-xl opacity-90 leading-relaxed"
                  >
                    The allocated timeframe for this assessment session has concluded and your current inputs have been recorded.
                  </p>
                </>
              ) : scoreMetrics.isPassed ? (
                <>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-none flex items-center justify-center mb-6">
                    <Award className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" />
                  </div>

                  <h2 
                    style={{ color: calculatedTextColor }}
                    className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4"
                  >
                    Assessment Passed
                  </h2>

                  <p 
                    style={{ color: calculatedTextColor }}
                    className="text-lg md:text-xl font-medium max-w-xl opacity-90 leading-relaxed mb-6"
                  >
                    Congratulations. You have successfully met the required proficiency benchmark for this evaluation.
                  </p>

                  <div className="inline-flex items-center gap-6 border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-md px-8 py-4 rounded-none">
                    <div className="text-center">
                      <span className="block text-xs uppercase font-mono text-emerald-300/70 tracking-widest">Score</span>
                      <span className="text-3xl font-black font-mono text-emerald-400">{scoreMetrics.percentage}%</span>
                    </div>
                    <div className="h-8 w-px bg-emerald-500/30" />
                    <div className="text-center">
                      <span className="block text-xs uppercase font-mono text-emerald-300/70 tracking-widest">Required</span>
                      <span className="text-3xl font-black font-mono text-emerald-100">{passingScore}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500/20 border-2 border-red-500/40 rounded-none flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-400" />
                  </div>

                  <h2 
                    style={{ color: calculatedTextColor }}
                    className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4"
                  >
                    Assessment Unsuccessful
                  </h2>

                  <p 
                    style={{ color: calculatedTextColor }}
                    className="text-lg md:text-xl font-medium max-w-xl opacity-90 leading-relaxed mb-6"
                  >
                    The calculated performance metrics fall below the defined passing threshold.
                  </p>

                  <div className="inline-flex items-center gap-6 border border-red-500/30 bg-red-950/40 backdrop-blur-md px-8 py-4 rounded-none">
                    <div className="text-center">
                      <span className="block text-xs uppercase font-mono text-red-300/70 tracking-widest">Score</span>
                      <span className="text-3xl font-black font-mono text-red-400">{scoreMetrics.percentage}%</span>
                    </div>
                    <div className="h-8 w-px bg-red-500/30" />
                    <div className="text-center">
                      <span className="block text-xs uppercase font-mono text-red-300/70 tracking-widest">Required</span>
                      <span className="text-3xl font-black font-mono text-red-100">{passingScore}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : totalQuestions === 0 || !activeQuestion ? (
            <div className="py-24 text-center flex flex-col items-center gap-3">
              <span className="text-sm md:text-base font-semibold uppercase tracking-wider opacity-80" style={{ color: calculatedTextColor }}>
                No Evaluation Nodes Mapped
              </span>
              <p className="text-sm opacity-70" style={{ color: calculatedTextColor }}>
                No assessment elements compiled for this section.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl w-full mx-auto flex flex-col justify-center relative gap-8">
              
              <div className="flex items-center justify-between text-sm md:text-base font-semibold text-slate-300 border-b border-white/10 pb-4">
                <span className="font-mono text-sm md:text-base" style={{ color: calculatedTextColor }}>
                  Question {currentSlideIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-80" style={{ color: calculatedTextColor }}>
                  Type: {activeQuestion.type === 'mcq' ? 'Multiple Choice' : 'Text Block'}
                </span>
              </div>

              <SourceHoverTarget source={activeQuestion.source} className="w-full min-w-0 bg-white rounded-none text-slate-900 p-8 md:p-10 shadow-2xl border border-slate-200 flex flex-col justify-between overflow-visible">
                <div className="w-full">
                  <h2 className="w-full min-w-0 text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug mb-3 wrap-break-word whitespace-normal">
                    <BoldText>{activeQuestion.title || "Untitled Assessment Query"}</BoldText>
                  </h2>

                  {activeQuestion.question && (
                    <p className="text-base md:text-lg font-normal text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">
                      <BoldText>{activeQuestion.question}</BoldText>
                    </p>
                  )}

                  {activeQuestion.points !== undefined && activeQuestion.points !== null && (
                    <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider text-slate-600 mb-6">
                      <span>Points:</span>
                      <span className="text-slate-900 font-mono font-extrabold text-sm">{activeQuestion.points}</span>
                    </div>
                  )}

                  {activeQuestion.mediaUrl && activeQuestion.mediaType && (
                    <div className="w-full min-w-0 mb-6 border border-slate-200 bg-black/5 overflow-hidden flex items-center justify-center">
                      {activeQuestion.mediaType === 'image' && (
                        <img
                          src={activeQuestion.mediaUrl}
                          alt="Question media"
                          className="max-w-full max-h-72 object-contain"
                        />
                      )}
                      {activeQuestion.mediaType === 'video' && (
                        <video
                          src={activeQuestion.mediaUrl}
                          controls
                          className="max-w-full max-h-72 w-full object-contain"
                        />
                      )}
                      {activeQuestion.mediaType === 'audio' && (
                        <audio
                          src={activeQuestion.mediaUrl}
                          controls
                          className="w-full p-4"
                        />
                      )}
                    </div>
                  )}

                  {activeQuestion.type === 'mcq' ? (
                    <div className="w-full flex flex-col gap-3.5">
                      {(activeQuestion.options || []).map((option, idx) => {
                        const allowsMultiple = (activeQuestion.correctAnswers || []).length > 1;
                        const currentSelections = selectedAnswers[activeQuestion.id];
                        const isSelected = allowsMultiple
                          ? (Array.isArray(currentSelections) && currentSelections.includes(idx))
                          : currentSelections === idx;
                        const isCorrect = (activeQuestion.correctAnswers || []).includes(idx);
                        const showFeedback = revealAnswers && (
                          (allowsMultiple && Array.isArray(currentSelections) && currentSelections.length > 0) ||
                          (!allowsMultiple && currentSelections !== undefined)
                        );

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectOption(activeQuestion.id, idx)}
                            className={`w-full p-4 md:p-5 rounded-none border text-left text-base md:text-lg font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'border-slate-900 text-slate-900 bg-slate-900/5'
                                : 'border-slate-200 text-slate-700 hover:border-slate-400 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-6 h-6 rounded-none border flex items-center justify-center shrink-0 transition-all ${
                                isSelected
                                  ? 'border-slate-900 bg-slate-900 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                              </div>
                              <span className={isSelected ? 'font-bold text-slate-900' : 'text-slate-800'}>
                                <BoldText>{option || `Option ${idx + 1}`}</BoldText>
                              </span>
                            </div>

                            {showFeedback && (
                              <div className="ml-3 shrink-0">
                                {isCorrect ? (
                                  <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                                ) : isSelected ? (
                                  <X className="w-5 h-5 text-red-600 stroke-[3]" />
                                ) : null}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-3">
                      <textarea
                        rows={5}
                        value={textAnswers[activeQuestion.id] || ''}
                        onChange={(e) => handleTextChange(activeQuestion.id, e.target.value)}
                        placeholder="Type response parameters..."
                        className="w-full border border-slate-200 rounded-none p-4 text-base md:text-lg font-medium focus:outline-none focus:border-slate-900 bg-transparent text-slate-900 placeholder:text-slate-300 resize-none leading-relaxed"
                      />
                      {(activeQuestion.minCharacters > 0 || activeQuestion.maxCharacters) && (
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                          <span>Min: {activeQuestion.minCharacters || 0}</span>
                          <span>Max: {activeQuestion.maxCharacters || 'Uncapped'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </SourceHoverTarget>
            </div>
          )}
        </div>

        <footer className="border-t border-white/10 px-8 py-3 md:px-12 md:py-4 flex items-center justify-between bg-black/30 shrink-0">
          <span className="text-sm md:text-base font-mono text-slate-300 font-bold">
            {!quizEnded && totalQuestions > 0 ? `${currentSlideIndex + 1} / ${totalQuestions}` : '0 / 0'}
          </span>

          <div className="flex items-center gap-3">
            {!quizEnded && currentSlideIndex === 0 && (
              <button
                type="button"
                disabled={!prevSection}
                onClick={handlePrevSection}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 rounded-none transition-all disabled:opacity-30 disabled:hover:bg-white/10 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous Section
              </button>
            )}

            {!quizEnded && currentSlideIndex === totalQuestions - 1 && totalQuestions > 0 && (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="px-5 py-3 md:py-3.5 rounded-none border border-emerald-400/30 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 transition-all font-mono font-bold text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <span>Submit</span>
                <Send className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              disabled={quizEnded || currentSlideIndex === 0}
              onClick={handlePrevSlide}
              className="p-3 md:p-3.5 rounded-none border border-white/10 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              type="button"
              disabled={quizEnded || currentSlideIndex === totalQuestions - 1 || totalQuestions === 0}
              onClick={handleNextSlide}
              className="p-3 md:p-3.5 rounded-none border border-white/10 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {quizEnded && (
              <button
                type="button"
                disabled={!nextSection}
                onClick={handleNextSection}
                className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2.5 rounded-none transition-all disabled:opacity-30 disabled:hover:bg-white/10 cursor-pointer"
              >
                Next Section <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </footer>
      </div>
    </SourceHoverTarget>
  );
}