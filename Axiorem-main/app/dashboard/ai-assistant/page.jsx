"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Presentation, ShieldCheck, FileText, ClipboardList, Binary, SendHorizontal, Plus, X, SlidersHorizontal } from "lucide-react";
import { Mosaic, BlinkBlur, Slab, TrophySpin } from "react-loading-indicators";
import { useCreateProjectFromAssistant } from "../../../hooks/projects/useCreateProjectFromAssistant";
import { useEditorStore } from "../../project-editor/store/useEditorStore";

const LOADERS = [
  <Mosaic key="mosaic" color="#ffffff" size="large" text="" textColor="" />,
  <BlinkBlur key="blinkblur" color="#ffffff" size="large" text="" textColor="" />,
  <Slab key="slab" color="#ffffff" size="large" text="" textColor="" />,
  <TrophySpin key="trophyspin" color="#ffffff" size="large" text="" textColor="" />,
];

const formatCreditExpense = (value) => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue) || numericValue < 0) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

function Odometer({ value }) {
  const formattedStr = formatCreditExpense(value);
  const chars = formattedStr.split("");

  return (
    <span className="inline-flex items-center tabular-nums font-bold leading-none overflow-hidden">
      {chars.map((char, index) => {
        const isDigit = !isNaN(parseInt(char, 10));
        if (!isDigit) {
          return (
            <span key={`char-${index}`} className="px-[0.5px]">
              {char}
            </span>
          );
        }
        const num = parseInt(char, 10);
        return (
          <span
            key={`digit-${chars.length - index}`}
            className="relative inline-block h-[1em] overflow-hidden"
          >
            <span
              className="flex flex-col transition-transform duration-700 ease-out"
              style={{ transform: `translateY(-${num * 10}%)` }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  className="h-[1em] flex items-center justify-center leading-none"
                >
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function AiAssistantPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [presentationParams, setPresentationParams] = useState({ sectionCount: 12 });
  const [complianceParams, setComplianceParams] = useState({ questionCount: 10 });
  const [activeLoaderIndex, setActiveLoaderIndex] = useState(0);

  const { createProjectFromAssistant, cancelGeneration, isGenerating, error: generationError, latestProgress } = useCreateProjectFromAssistant();

  const titleText = "Booted up, Ready to Go";

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setActiveLoaderIndex((prevIndex) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * LOADERS.length);
        } while (nextIndex === prevIndex && LOADERS.length > 1);
        return nextIndex;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const features = [
    { id: "corporate-deck", icon: <Presentation className="w-4 h-4 text-white" />, text: "Generates heavily formatted L&D slide decks with extensive speaker notes.", label: "Corporate Training Deck" },
    { id: "compliance-assessment", icon: <ShieldCheck className="w-4 h-4 text-white" />, text: "Converts operations manuals into strict compliance tests with full legal explanations.", label: "Full Compliance Assessment Gen" },
    { id: "executive-summary", icon: <FileText className="w-4 h-4 text-white" />, text: "Condenses enterprise documentation into a crisp, high-level policy brief.", label: "Executive Summary Policy" },
    { id: "sop-extraction", icon: <ClipboardList className="w-4 h-4 text-white" />, text: "Extracts operational manuals down to actionable 10-point daily safety checklists.", label: "SOP/Checklist Extraction" },
    // { id: "jargon-simplifier", icon: <Binary className="w-4 h-4 text-white" />, text: "Translates dense legalese and enterprise prose into front-line workforce vocabulary.", label: "Jargon Simplifier" },
  ];

  const handleServiceSelect = (serviceId) => {
    if (isGenerating) return;
    setSelectedService(serviceId);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setUploadedFile(file);
    event.target.value = "";
  };

  const handleRemoveFile = () => {
    if (isGenerating) return;
    setUploadedFile(null);
  };

  const buildAssistantInput = () => {
    switch (selectedService) {
      case "compliance-assessment":
        return { questionCount: Number(complianceParams.questionCount), userPrompt: inputValue.trim() };
      case "corporate-deck":
        return { sectionCount: Number(presentationParams.sectionCount), userPrompt: inputValue.trim() };
      case "executive-summary":
      case "jargon-simplifier":
      case "sop-extraction":
        return { userPrompt: inputValue.trim() };
      default:
        throw new Error("A valid AI-assistant capability must be selected.");
    }
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!selectedService || !uploadedFile || !inputValue.trim() || isGenerating) return;

    const selectedFeature = features.find((feature) => feature.id === selectedService);
    const input = buildAssistantInput();

    const project = await createProjectFromAssistant({
      payload: {
        name: selectedFeature?.label || "Untitled Project",
        templateId: selectedService,
        file: uploadedFile,
        input,
      },
    });

    if (!project) return;
    if (!project.id) throw new Error("AI assistant generation completed without a project ID.");

    useEditorStore.getState().resetToNewDocument(project.id);
    router.push(`/project-editor?id=${project.id}`);
  };

  const isSubmitDisabled = !selectedService || !inputValue.trim() || !uploadedFile || isGenerating;
  const latestEvent = Array.isArray(latestProgress) ? latestProgress[latestProgress.length - 1] : latestProgress;
  const currentStep = latestEvent?.step ? String(latestEvent.step).replace(/_/g, " ") : "Initializing";
  const currentMessage = latestEvent?.message || "Generating project...";
  
  const dynamicCreditCost =
  latestEvent?.creditExpense ??
  latestEvent?.estimatedCreditExpense ??
  latestEvent?.creditCost ??
  latestEvent?.creditsUsed ??
  latestEvent?.credits ??
  0;

  let globalCharIndex = 0;

  return (
    <div className="w-full min-h-full flex-1 bg-[#212121] bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] text-white font-sans antialiased p-4 md:p-8 flex flex-col justify-between overflow-x-hidden">
      <style>{`
        @keyframes letterFadeIn {
          0% { opacity: 0; filter: blur(4px); transform: translateY(2px); }
          100% { opacity: 1; filter: blur(0px); transform: translateY(0px); }
        }
      `}</style>

      {isGenerating ? (
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center my-auto py-8 sm:py-12 px-4 space-y-6 sm:space-y-10 text-center animate-in fade-in duration-500">
          <div className="w-full max-w-xs sm:max-w-sm shrink-0 flex items-center justify-between border border-slate-700/60 bg-[#212121] rounded-sm px-4 py-2.5 sm:px-5 sm:py-3 shadow-md">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
              Credit Cost
            </span>
            <div className="text-base sm:text-lg text-blue-300">
              <Odometer value={dynamicCreditCost} />
            </div>
          </div>

          <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 flex items-center justify-center overflow-hidden sm:overflow-visible">
            {LOADERS.map((loader, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
                  index === activeLoaderIndex
                    ? "opacity-100 scale-100 sm:scale-150 md:scale-[2.2] z-10 blur-0"
                    : "opacity-0 scale-75 sm:scale-100 z-0 pointer-events-none blur-xs"
                }`}
              >
                {loader}
              </div>
            ))}
          </div>

          <div className="w-full max-w-md flex flex-col items-center space-y-3">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-blue-400 uppercase">{currentStep}</span>
            <div className="relative h-14 w-full flex items-center justify-center">
              <p key={currentMessage} className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed text-center transition-all duration-300">
                {currentMessage}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={cancelGeneration}
            className="text-red-400 hover:text-red-300 font-bold text-xs sm:text-sm tracking-wider uppercase border border-red-500/30 hover:border-red-400/60 bg-red-950/20 hover:bg-red-900/30 px-6 py-2.5 rounded-sm transition-colors cursor-pointer shadow-lg"
          >
            Cancel Generation
          </button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto w-full flex flex-col my-auto space-y-6">
          <header className="w-full text-center">
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl sm:text-4xl md:text-5xl font-normal italic tracking-tight text-white leading-tight px-2 text-center flex flex-wrap justify-center gap-x-2">
              {titleText.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                  {word.split("").map((char) => {
                    const charDelay = globalCharIndex * 0.035;
                    globalCharIndex++;
                    return (
                      <span
                        key={globalCharIndex}
                        style={{
                          display: "inline-block",
                          opacity: 0,
                          animation: "letterFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                          animationDelay: `${charDelay}s`,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>
          </header>

          <div className="w-full flex flex-col gap-3">
            <div className="text-left px-1">
              <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-slate-300 uppercase">Select Tool</span>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleServiceSelect(item.id)}
                  className={`rounded-sm p-3 flex flex-col justify-between space-y-2 transition-all duration-300 text-left bg-[#3A3A3A] shadow-md hover:shadow-lg disabled:opacity-60 ${selectedService === item.id ? "ring-1 ring-[#1b365d]" : ""}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.icon}
                        <h4 className="text-[11px] font-bold text-white tracking-tight uppercase truncate">{item.label}</h4>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs font-medium leading-relaxed line-clamp-2">{item.text}</p>
                  </div>
                </button>
              ))}
            </section>

            {selectedService && (
              <div className="flex flex-col pt-4 w-full max-w-4xl mx-auto transition-all duration-300">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div className="bg-[#2A2A2A] border border-[#3A3A3A] focus-within:border-slate-500 rounded-2xl sm:rounded-[28px] p-2.5 sm:p-3 shadow-xl transition-all flex flex-col gap-2.5">
                    {uploadedFile && (
                      <div className="flex items-center gap-2 bg-[#3A3A3A] px-3 py-1 rounded-full border border-slate-700/50 w-fit text-xs text-slate-200">
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[140px] sm:max-w-xs font-medium">{uploadedFile.name}</span>
                        <span className="text-[10px] text-slate-400">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                        <button type="button" disabled={isGenerating} onClick={handleRemoveFile} className="text-slate-400 hover:text-rose-400 ml-1 transition-colors disabled:opacity-50">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="w-full px-1">
                      <textarea
                        value={inputValue}
                        disabled={isGenerating}
                        onChange={(event) => setInputValue(event.target.value)}
                        rows={2}
                        placeholder="Provide Instructions..."
                        className="w-full bg-transparent text-sm font-normal text-white placeholder-slate-400 focus:outline-none resize-none leading-relaxed min-h-[44px] max-h-[140px]"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/30 sm:border-t-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={handleFileChange} className="hidden" disabled={isGenerating} />
                        <button type="button" disabled={isGenerating} onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full bg-[#3A3A3A] sm:bg-transparent hover:bg-[#3A3A3A] text-slate-300 transition-colors shrink-0 disabled:opacity-50" title={uploadedFile ? "Replace Source Document" : "Upload Source Document"}>
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {(selectedService === "corporate-deck" || selectedService === "compliance-assessment") && (
                          <div className="flex items-center gap-1.5 bg-[#3A3A3A] hover:bg-[#444444] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs text-slate-200 border border-slate-700/50 shrink-0 transition-colors">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{selectedService === "corporate-deck" ? "Sections" : "Questions"}</span>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={selectedService === "corporate-deck" ? presentationParams.sectionCount : complianceParams.questionCount}
                              disabled={isGenerating}
                              onChange={(event) => {
                                const val = event.target.value === "" ? "" : Number(event.target.value);
                                selectedService === "corporate-deck" ? setPresentationParams({ sectionCount: val }) : setComplianceParams({ questionCount: val });
                              }}
                              className="bg-transparent text-xs text-white focus:outline-none w-7 text-center font-semibold"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative group shrink-0">
                          {isSubmitDisabled && !isGenerating && (
                            <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col items-end z-50 pointer-events-none">
                              <div className="bg-[#1a1a1a] text-slate-200 text-[11px] font-medium py-1.5 px-3 rounded-md shadow-2xl border border-slate-700 whitespace-nowrap">
                                Please provide instructions and upload a source document first.
                              </div>
                            </div>
                          )}
                          <button type="submit" disabled={isSubmitDisabled} className={`p-2 rounded-full transition-all shrink-0 ${isSubmitDisabled ? "bg-[#3A3A3A] text-slate-500 cursor-not-allowed" : "bg-white text-black hover:bg-slate-200 cursor-pointer shadow-md"}`}>
                            <SendHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {generationError && (
                    <div className="text-[11px] text-red-400 bg-[#2A2A2A] rounded-2xl px-3.5 py-2 border border-red-900/50">
                      {generationError}
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}