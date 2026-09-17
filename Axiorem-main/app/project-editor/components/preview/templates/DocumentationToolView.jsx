'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Minus, ChevronLeft, ChevronRight, Star, FileText, Download, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useDocumentationStore } from '../../content-builders/store/useDocumentationStore';
import { useEditorStore } from '../../../store/useEditorStore';
import { SourceHoverTarget } from '../SourceTooltip';
import BoldText from '../BoldText';

const getImageUrl = (element) => {
  const candidate = [element?.imageSrc, element?.imageUrl].find(
    (value) => typeof value === 'string' && value.trim()
  );
  return candidate || null;
};

export default function DocumentationToolView({ sectionId, section, brandColor = "#1a688a" }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const initializeFromEditor = useDocumentationStore(state => state.initializeFromEditor);
  const pages = useDocumentationStore(state => state.pages) || [];
  const currentPageIndex = useDocumentationStore(state => state.currentPageIndex);
  const sectionTitle = useDocumentationStore(state => state.sectionTitle);
  const navigatePrevious = useDocumentationStore(state => state.navigatePrevious);
  const navigateNext = useDocumentationStore(state => state.navigateNext);
  const setCurrentPageIndex = useDocumentationStore(state => state.setCurrentPageIndex);

  const goalsFormData = useDocumentationStore(state => state.goalsFormData);
  const goalsAssessmentFormData = useDocumentationStore(state => state.goalsAssessmentFormData);
  const documentExportFormData = useDocumentationStore(state => state.documentExportFormData);

  // Global section store integration for inter-section navigation
  const sections = useEditorStore((state) => state.sections) || [];
  const setActiveSectionId = useEditorStore((state) => state.setActiveSectionId);

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

  const isFirstPage = currentPageIndex === 0;
  const isLastPage = pages.length > 0 && currentPageIndex === pages.length - 1;

  const activePage = pages[currentPageIndex] || null;
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [isDocumentGenerated, setIsDocumentGenerated] = useState(false);

  const [userGoals, setUserGoals] = useState(["", ""]);
  const [userRatings, setUserRatings] = useState({});
  const [userInputs, setUserInputs] = useState({});

  useEffect(() => {
    if (sectionId) {
      initializeFromEditor(sectionId);
    }
  }, [sectionId, initializeFromEditor]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const computedScale = Math.max(0.55, Math.min(1.4, width / 1000));
        setScale(computedScale);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddGoal = () => setUserGoals(prev => [...prev, ""]);

  const handleRemoveGoal = (idx) => {
    setUserGoals(prev => prev.filter((_, i) => i !== idx));
    setUserRatings(prev => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  const handleGoalChange = (idx, value) => {
    setUserGoals(prev => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const handleRateGoal = (idx, rating) => {
    setUserRatings(prev => ({ ...prev, [idx]: rating }));
  };

  const handleInputChange = (elementId, value) => {
    setUserInputs(prev => ({ ...prev, [elementId]: value }));
  };

  const handlePrevSection = () => {
    if (prevSection) {
      setActiveSectionId(prevSection.id);
    }
  };

  const handleNextSection = () => {
    if (nextSection) {
      setActiveSectionId(nextSection.id);
    }
  };

  const generateAndDownloadReport = () => {
    let report = `DOCUMENTATION REPORT: ${sectionTitle || "Project Document"}\n`;
    report += `========================================\n\n`;

    pages.forEach((page, pIdx) => {
      report += `PAGE ${pIdx + 1}: ${page.title || "Untitled Section"}\n`;
      report += `----------------------------------------\n`;

      const isGoalsPage = page.type === 'goals' || page.type === 'document_goals';
      const isAssessmentPage = page.type === 'goals_assessment' || page.type === 'document_goals_assessment';

      if (isGoalsPage) {
        report += `${goalsFormData?.goalLabel || "Goal"}:\n`;
        userGoals.forEach((g, gIdx) => {
          report += `  - [${gIdx + 1}]: ${g || "Unspecified"}\n`;
        });
      } else if (isAssessmentPage) {
        report += `Evaluations:\n`;
        userGoals.forEach((g, gIdx) => {
          const rating = userRatings[gIdx] || 0;
          report += `  - ${g || "Unspecified Target"} -> Rating: ${rating}/3 Stars\n`;
        });
      } else {
        (page.elements || []).forEach((el) => {
          if (el.type === 'text') report += `${el.content || ""}\n`;
          if (el.type === 'text_input') {
            report += `${el.inputDescription || "Input"}: ${userInputs[el.id] || ""}\n`;
          }
          if (el.type === 'accordion') {
            report += `[Accordion] ${el.accordionTitle || ""}\n`;
            (el.panels || []).forEach(p => {
              report += `  > ${p.title}: ${p.content}\n`;
            });
          }
        });
      }
      report += `\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(sectionTitle || "document").toLowerCase().replace(/\s+/g, '_')}_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SourceHoverTarget
      source={section?.source}
      ref={containerRef} 
      className="w-full h-full flex bg-[#f4f5f7] font-sans overflow-hidden relative"
      style={{
        '--scale': scale,
        '--fs-h1': `${1.5 * scale}rem`,
        '--fs-h2': `${1.25 * scale}rem`,
        '--fs-body': `${0.875 * scale}rem`,
        '--fs-sub': `${0.75 * scale}rem`,
        '--pad-outer': `${1.5 * scale}rem`,
        '--gap-elem': `${1 * scale}rem`,
      }}
    >
      {/* Sidebar */}
      <div 
        className="h-full bg-[#f4f5f7] border-r border-slate-200/60 flex flex-col shrink-0 overflow-y-auto"
        style={{ 
          width: 'clamp(180px, 25%, 320px)', 
          padding: 'var(--pad-outer)' 
        }}
      >
        <div 
          className="relative inline-block self-start shrink-0" 
          style={{ marginBottom: `calc(var(--gap-elem) * 1.5)` }}
        >
          <h1 
            className="font-bold tracking-tight text-slate-950 leading-tight"
            style={{ fontSize: 'var(--fs-h1)' }}
          >
            <BoldText>{sectionTitle || "Documentation"}</BoldText>
          </h1>
          <div 
            className="absolute bottom-0 left-0 w-full"
            style={{ 
              backgroundColor: brandColor, 
              height: `${Math.max(2, 3 * scale)}px`, 
              bottom: `calc(-${0.25 * scale}rem)` 
            }} 
          />
        </div>

        <div 
          className="flex-1 w-full flex flex-col relative border-l-2 border-slate-200/80 py-2"
          style={{ 
            paddingLeft: `${1 * scale}rem`, 
            gap: `${1.25 * scale}rem` 
          }}
        >
          {pages.map((page, index) => {
            const isActive = index === currentPageIndex;
            const nodeSize = 14 * scale;
            return (
              <button
                key={page.id || index}
                type="button"
                onClick={() => {
                  setCurrentPageIndex(index);
                  if (!page.type?.toLowerCase().includes('export')) setIsDocumentGenerated(false);
                }}
                className="w-full text-left relative group cursor-pointer focus:outline-none flex items-center"
              >
                <div 
                  className="absolute rounded-full border-2 transition-all"
                  style={{ 
                    left: `calc(-${1 * scale}rem - ${nodeSize / 2 + 1}px)`,
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                    backgroundColor: isActive ? brandColor : '#cbd5e1',
                    borderColor: isActive ? 'transparent' : '#f4f5f7',
                    boxShadow: isActive ? `0 0 0 ${3 * scale}px ${brandColor}20` : undefined 
                  }}
                />
                <span 
                  className={`block transition-colors tracking-tight font-medium ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                  style={{ fontSize: 'var(--fs-sub)' }}
                >
                  <BoldText>{page.title || "Untitled Page"}</BoldText>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 h-full bg-white flex flex-col min-w-0 relative">
        {activePage ? (
          <div 
            className="flex-1 w-full overflow-y-auto flex flex-col justify-between"
            style={{ padding: 'var(--pad-outer)' }}
          >
            <SourceHoverTarget
              as="div"
              source={activePage.source}
              className="w-full max-w-5xl flex flex-col"
              style={{ gap: 'var(--gap-elem)' }}
            >
              {/* GOALS SECTION */}
              {(activePage.type === 'goals' || activePage.type === 'document_goals') && (
                <div className="w-full flex flex-col" style={{ gap: 'var(--gap-elem)' }}>
                  <h2 
                    className="font-bold tracking-tight" 
                    style={{ color: brandColor, fontSize: 'var(--fs-h2)' }}
                  >
                    <BoldText>{goalsFormData?.title || activePage.title}</BoldText>
                  </h2>
                  <p className="text-slate-800 font-normal leading-relaxed" style={{ fontSize: 'var(--fs-body)' }}>
                    <BoldText>{goalsFormData?.description || "Specify your goals for this workspace template below."}</BoldText>
                  </p>

                  <div className="w-full flex flex-col" style={{ gap: `calc(var(--gap-elem) * 0.75)` }}>
                    {userGoals.map((val, idx) => (
                      <div key={idx} className="w-full flex items-center" style={{ gap: `${0.75 * scale}rem` }}>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleGoalChange(idx, e.target.value)}
                          placeholder={goalsFormData?.placeholder || "Enter a project goal..."}
                          className="flex-1 border border-slate-300 rounded-lg bg-white focus:outline-none"
                          style={{ 
                            fontSize: 'var(--fs-body)', 
                            padding: `${0.5 * scale}rem ${0.75 * scale}rem` 
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGoal(idx)}
                          className="rounded border border-red-600 text-red-600 flex items-center justify-center font-bold hover:bg-red-50 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                          style={{ 
                            minWidth: `${2.25 * scale}rem`,
                            minHeight: `${2.25 * scale}rem`,
                            padding: `0 ${0.5 * scale}rem`,
                            fontSize: 'var(--fs-sub)',
                            lineHeight: 1
                          }}
                        >
                          {goalsFormData?.removeBtnText || "X"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="font-normal text-slate-500" style={{ fontSize: 'var(--fs-sub)' }}>
                    {goalsFormData?.counterText || "Goals Count"}: <span className="font-semibold text-slate-700">{userGoals.length}</span>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleAddGoal}
                      className="inline-flex items-center font-bold text-white rounded-lg cursor-pointer shadow-sm"
                      style={{ 
                        backgroundColor: brandColor,
                        padding: `${0.5 * scale}rem ${1 * scale}rem`,
                        fontSize: 'var(--fs-sub)',
                        gap: `${0.5 * scale}rem`
                      }}
                    >
                      {goalsFormData?.specifyBtnText || "+ Add Goal"}
                    </button>
                  </div>
                </div>
              )}

              {/* GOALS ASSESSMENT SECTION */}
              {(activePage.type === 'goals_assessment' || activePage.type === 'document_goals_assessment') && (
                <div className="w-full flex flex-col" style={{ gap: 'var(--gap-elem)' }}>
                  <h2 className="font-bold tracking-tight" style={{ color: brandColor, fontSize: 'var(--fs-h2)' }}>
                    <BoldText>{goalsAssessmentFormData?.title || activePage.title}</BoldText>
                  </h2>
                  <p className="text-slate-800 font-normal leading-relaxed" style={{ fontSize: 'var(--fs-body)' }}>
                    <BoldText>{goalsAssessmentFormData?.description || "Rate your knowledge or performance level for each specified target item."}</BoldText>
                  </p>

                  <div 
                    className="w-full bg-slate-50 border-y border-slate-200 flex flex-wrap items-center font-medium text-slate-700"
                    style={{ 
                      padding: `${0.6 * scale}rem ${1 * scale}rem`, 
                      gap: `${1.5 * scale}rem`,
                      fontSize: 'var(--fs-sub)' 
                    }}
                  >
                    <span className="text-slate-500 font-semibold tracking-wide">{goalsAssessmentFormData?.legendHeader || "Possible Ratings"}</span>
                    <div className="flex items-center" style={{ gap: `${0.3 * scale}rem` }}><Star style={{ width: `${0.9 * scale}rem`, height: `${0.9 * scale}rem` }} className="fill-amber-400 stroke-amber-400" /><span>{goalsAssessmentFormData?.lowRating || "Learned Little"}</span></div>
                    <div className="flex items-center" style={{ gap: `${0.2 * scale}rem` }}><Star style={{ width: `${0.9 * scale}rem`, height: `${0.9 * scale}rem` }} className="fill-amber-400 stroke-amber-400" /><Star style={{ width: `${0.9 * scale}rem`, height: `${0.9 * scale}rem` }} className="fill-amber-400 stroke-amber-400" /><span>{goalsAssessmentFormData?.mediumRating || "Learned Something"}</span></div>
                    <div className="flex items-center" style={{ gap: `${0.2 * scale}rem` }}><Star style={{ width: `${0.9 * scale}rem`, height: `${0.9 * scale}rem` }} className="fill-amber-400 stroke-amber-400" /><Star style={{ width: `${0.9 * scale}rem`, height: `${0.9 * scale}rem` }} className="fill-amber-400 stroke-amber-400" /><Star style={{ width: `${0.9 * scale}rem`, height: `${0.9 * scale}rem` }} className="fill-amber-400 stroke-amber-400" /><span>{goalsAssessmentFormData?.highRating || "Learned a Lot"}</span></div>
                  </div>

                  <div className="w-full flex flex-col">
                    <div 
                      className="w-full bg-slate-100/80 border-b border-slate-200 flex items-center font-bold text-slate-900 tracking-wide"
                      style={{ padding: `${0.5 * scale}rem ${1 * scale}rem`, fontSize: 'var(--fs-sub)' }}
                    >
                      <div className="flex-1">{goalsAssessmentFormData?.goalHeader || "Goals"}</div>
                      <div style={{ width: `${8 * scale}rem` }} className="text-left pl-1">{goalsAssessmentFormData?.ratingHeader || "Rating"}</div>
                    </div>

                    {userGoals.length > 0 ? (
                      userGoals.map((goal, idx) => (
                        <div 
                          key={idx} 
                          className="w-full border-b border-slate-100 flex items-center text-slate-800 hover:bg-slate-50/40"
                          style={{ padding: `${0.75 * scale}rem ${1 * scale}rem`, fontSize: 'var(--fs-body)' }}
                        >
                          <div className="flex-1 pr-6 font-medium leading-relaxed">{goal || <span className="text-slate-400 italic font-normal">Untitled Goal Entry</span>}</div>
                          <div style={{ width: `${8 * scale}rem`, gap: `${0.4 * scale}rem` }} className="flex items-center shrink-0">
                            {[1, 2, 3].map((starValue) => {
                              const isFilled = starValue <= (userRatings[idx] || 0);
                              return (
                                <button key={starValue} type="button" onClick={() => handleRateGoal(idx, starValue)} className="cursor-pointer focus:outline-none">
                                  <Star 
                                    style={{ width: `${1 * scale}rem`, height: `${1 * scale}rem` }}
                                    className={`${isFilled ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-200 fill-slate-50'}`} 
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full py-8 text-center text-slate-400 font-mono bg-slate-50/20" style={{ fontSize: 'var(--fs-sub)' }}>
                        {goalsAssessmentFormData?.noGoalsText || "No Targets Found"}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EXPORT SECTION */}
              {(activePage.type === 'document_export' || activePage.type === 'sum_export' || activePage.type?.toLowerCase().includes('export')) && (
                <div className="w-full flex flex-col" style={{ gap: 'var(--gap-elem)' }}>
                  <h2 className="font-bold tracking-tight" style={{ color: brandColor, fontSize: 'var(--fs-h2)' }}>
                    <BoldText>{documentExportFormData?.title || activePage.title}</BoldText>
                  </h2>

                  {!isDocumentGenerated ? (
                    <div className="w-full flex flex-col" style={{ gap: 'var(--gap-elem)' }}>
                      <p className="text-slate-800 font-normal leading-relaxed" style={{ fontSize: 'var(--fs-body)' }}>
                        {documentExportFormData?.description || "Export your custom dynamic responses layout data sheet immediately."}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsDocumentGenerated(true)}
                        className="inline-flex items-center self-start font-semibold text-white rounded-full shadow-md cursor-pointer"
                        style={{ 
                          backgroundColor: brandColor,
                          padding: `${0.6 * scale}rem ${1.25 * scale}rem`,
                          fontSize: 'var(--fs-body)',
                          gap: `${0.5 * scale}rem`
                        }}
                      >
                        <FileText style={{ width: `${1.1 * scale}rem`, height: `${1.1 * scale}rem` }} /> {documentExportFormData?.createBtnText || "Create document"}
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col animate-in zoom-in-95 duration-150" style={{ gap: `${0.75 * scale}rem` }}>
                      <div 
                        className="w-full bg-slate-100 border border-slate-200 rounded-t-xl flex items-center justify-between"
                        style={{ padding: `${0.6 * scale}rem ${0.8 * scale}rem` }}
                      >
                        <span className="font-bold text-slate-700 font-mono tracking-tight flex items-center gap-2" style={{ fontSize: 'var(--fs-sub)' }}>
                          <Check className="text-emerald-600 stroke-[3]" style={{ width: `${1 * scale}rem`, height: `${1 * scale}rem` }} /> {documentExportFormData?.successLabel || "EXPORT_READY.TXT"}
                        </span>
                        <div className="flex items-center" style={{ gap: `${0.5 * scale}rem` }}>
                          <button
                            type="button"
                            onClick={generateAndDownloadReport}
                            className="flex items-center font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow cursor-pointer"
                            style={{ 
                              padding: `${0.4 * scale}rem ${0.8 * scale}rem`,
                              fontSize: 'var(--fs-sub)',
                              gap: `${0.4 * scale}rem`
                            }}
                          >
                            <Download style={{ width: `${0.9 * scale}rem`, height: `${0.9 * scale}rem` }} /> {documentExportFormData?.exportBtnText || "Export text"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsDocumentGenerated(false)}
                            className="rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                            style={{ padding: `${0.4 * scale}rem` }}
                          >
                            <X style={{ width: `${1 * scale}rem`, height: `${1 * scale}rem` }} className="stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                      <div 
                        className="w-full border-x border-b border-slate-200 bg-slate-50 rounded-b-xl text-slate-800 max-h-[50vh] overflow-y-auto flex flex-col select-text"
                        style={{ padding: 'var(--pad-outer)', gap: 'var(--gap-elem)' }}
                      >
                        {pages.map((p, pIdx) => (
                          <div key={p.id || pIdx} className="flex flex-col gap-2">
                            <h4 
                              className="font-bold text-slate-900 uppercase border-l-2 pl-2" 
                              style={{ borderColor: brandColor, fontSize: 'var(--fs-body)' }}
                            >
                              {p.title}
                            </h4>
                            {p.type === 'goals' || p.type === 'document_goals' ? (
                              <ul className="list-disc pl-5 text-slate-700 flex flex-col gap-1" style={{ fontSize: 'var(--fs-sub)' }}>
                                {userGoals.map((g, i) => <li key={i}>{g || "Untitled Goal"}</li>)}
                              </ul>
                            ) : p.type === 'goals_assessment' || p.type === 'document_goals_assessment' ? (
                              <div className="flex flex-col gap-1 pl-2" style={{ fontSize: 'var(--fs-sub)' }}>
                                {userGoals.map((g, i) => <div key={i} className="text-slate-600">{g || "Target"}: {userRatings[i] || 0} Stars</div>)}
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 pl-2">
                                {(p.elements || []).map((el) => (
                                  el.type === 'text' ? <p key={el.id} className="text-slate-600 leading-relaxed" style={{ fontSize: 'var(--fs-sub)' }}>{el.content}</p> :
                                  el.type === 'text_input' ? <div key={el.id} className="font-mono text-slate-800 bg-white p-2 rounded border border-slate-100" style={{ fontSize: 'var(--fs-sub)' }}>{el.inputDescription}: {userInputs[el.id] || ""}</div> : null
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STANDARD WORKSPACE PAGE */}
              {(!activePage.type || activePage.type === 'standard' || activePage.type === 'document_standard' || (!activePage.type?.toLowerCase().includes('goals') && !activePage.type?.toLowerCase().includes('export'))) && (
                <div className="w-full flex flex-col" style={{ gap: 'var(--gap-elem)' }}>
                  <h2 className="font-bold tracking-tight" style={{ color: brandColor, fontSize: 'var(--fs-h2)' }}><BoldText>{activePage.title}</BoldText></h2>
                  {(activePage.elements || []).map((element) => {
                    if (element.type === 'text') {
                      return <SourceHoverTarget as="p" key={element.id} source={element.source} className="text-slate-800 leading-relaxed whitespace-pre-wrap" style={{ fontSize: 'var(--fs-body)' }}><BoldText>{element.content || "Sample document text block."}</BoldText></SourceHoverTarget>;
                    }
                    if (element.type === 'image') {
                      const imageUrl = getImageUrl(element);
                      if (!imageUrl) return null;
                      return (
                        <SourceHoverTarget
                          as="div"
                          source={element.source}
                          key={element.id} 
                          className="rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm"
                          style={{ 
                            width: `${11 * scale}rem`, 
                            height: `${11 * scale}rem`,
                            margin: `${0.5 * scale}rem 0` 
                          }}
                        >
                          <img src={imageUrl} alt={element.imageAlt || element.imageCaption || "Graphic Asset"} className="w-full h-full object-cover" />
                        </SourceHoverTarget>
                      );
                    }
                    if (element.type === 'text_input') {
                      return (
                        <SourceHoverTarget as="div" key={element.id} source={element.source} className="w-full flex flex-col gap-2" style={{ marginTop: `${0.5 * scale}rem` }}>
                          <label className="font-bold text-slate-900" style={{ fontSize: 'var(--fs-body)' }}>{element.inputDescription || "Input Label Header"}</label>
                          <input
                            type="text"
                            value={userInputs[element.id] || ""}
                            onChange={(e) => handleInputChange(element.id, e.target.value)}
                            placeholder={element.inputPlaceholder || "Enter terminal parameter value..."}
                            className="w-full border border-slate-300 rounded-lg bg-white focus:outline-none"
                            style={{ 
                              fontSize: 'var(--fs-body)', 
                              padding: `${0.5 * scale}rem ${0.75 * scale}rem` 
                            }}
                          />
                        </SourceHoverTarget>
                      );
                    }
                    if (element.type === 'accordion') {
                      return (
                        <SourceHoverTarget as="div" key={element.id} source={element.source} className="w-full flex flex-col" style={{ marginTop: `${0.5 * scale}rem` }}>
                          <h4 className="font-bold text-slate-900 mb-2" style={{ fontSize: 'var(--fs-body)' }}>{element.heading || "Accordion Group"}</h4>
                          {(element.panels || []).map((panel) => {
                            const isPanelOpen = openAccordionId === panel.id;
                            return (
                              <SourceHoverTarget as="div" key={panel.id} source={panel.source} className="w-full border-b border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => setOpenAccordionId(isPanelOpen ? null : panel.id)}
                                  className="w-full flex items-center justify-between text-left font-bold text-slate-900 cursor-pointer"
                                  style={{ padding: `${0.75 * scale}rem 0`, fontSize: 'var(--fs-body)' }}
                                >
                                  <span><BoldText>{panel.title || "Untitled Panel Item"}</BoldText></span>
                                  {isPanelOpen ? <Minus style={{ width: `${1 * scale}rem`, height: `${1 * scale}rem`, color: brandColor }} /> : <Plus style={{ width: `${1 * scale}rem`, height: `${1 * scale}rem`, color: brandColor }} />}
                                </button>
                                <div className={`grid transition-all duration-200 ease-in-out overflow-hidden ${isPanelOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                  <div className="overflow-hidden" style={{ paddingBottom: isPanelOpen ? `${0.75 * scale}rem` : 0 }}>
                                    <p className="text-slate-600 font-normal leading-relaxed whitespace-pre-wrap" style={{ fontSize: 'var(--fs-body)' }}><BoldText>{panel.content || "Panel context description."}</BoldText></p>
                                  </div>
                                </div>
                              </SourceHoverTarget>
                            );
                          })}
                        </SourceHoverTarget>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

            </SourceHoverTarget>

            {/* Navigation Controls matched with Builder */}
            <div 
              className="w-full flex justify-end items-center gap-2 shrink-0"
              style={{ marginTop: `calc(var(--gap-elem) * 2)` }}
            >
              {isFirstPage && (
                <button
                  type="button"
                  disabled={!prevSection}
                  onClick={handlePrevSection}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 h-10 rounded-full text-xs font-bold text-white shadow-md disabled:opacity-0 transition-all cursor-pointer enabled:hover:scale-105"
                  style={{ backgroundColor: brandColor }}
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Previous Section
                </button>
              )}

              <button
                type="button"
                disabled={currentPageIndex === 0}
                onClick={navigatePrevious}
                className="w-10 h-10 rounded-full text-white disabled:opacity-0 shadow-md transition-all cursor-pointer flex items-center justify-center enabled:hover:scale-105"
                style={{ backgroundColor: brandColor }}
              >
                <ChevronLeft style={{ width: `${1.25 * scale}rem`, height: `${1.25 * scale}rem` }} className="stroke-[2.5]" />
              </button>

              <button
                type="button"
                disabled={currentPageIndex === pages.length - 1}
                onClick={navigateNext}
                className="w-10 h-10 rounded-full text-white disabled:opacity-0 shadow-md transition-all cursor-pointer flex items-center justify-center enabled:hover:scale-105"
                style={{ backgroundColor: brandColor }}
              >
                <ChevronRight style={{ width: `${1.25 * scale}rem`, height: `${1.25 * scale}rem` }} className="stroke-[2.5]" />
              </button>

              {isLastPage && (
                <button
                  type="button"
                  disabled={!nextSection}
                  onClick={handleNextSection}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 h-10 rounded-full text-xs font-bold text-white shadow-md disabled:opacity-0 transition-all cursor-pointer enabled:hover:scale-105"
                  style={{ backgroundColor: brandColor }}
                >
                  Next Section <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>

          </div>
        ) : (
          <div 
            className="m-auto text-center text-slate-400 font-mono border border-dashed border-slate-200 rounded-2xl w-full max-w-md bg-slate-50/30"
            style={{ padding: `${3 * scale}rem`, fontSize: 'var(--fs-sub)' }}
          >
            No Workspace View Active
          </div>
        )}
      </div>

    </SourceHoverTarget>
  );
}