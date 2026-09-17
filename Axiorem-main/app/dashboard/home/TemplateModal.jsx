// app/dashboard/home/TemplateModal.jsx

import React, { useState, useEffect } from "react";
import { X, Plus, Upload, AlertCircle, FileText } from "lucide-react";
import { Mosaic, BlinkBlur, Slab, TrophySpin } from "react-loading-indicators";

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

export default function TemplateModal({
  template,
  isOpen,
  onClose,
  cancelGeneration,
  onCancelGeneration,
  onEditTemplateSelf,
  selectedFile,
  fileInputRef,
  handleFileChange,
  handleExecuteAIFill,
  isGenerating = false,
  pipelineProgress = null,
  estimatedCreditExpense = 0,
  creditExpense = null,
  creditChargeStatus = null,
  generationError = null,
}) {
  const [activeLoaderIndex, setActiveLoaderIndex] = useState(0);

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

  if (!isOpen || !template) return null;

  const handleClose = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isGenerating) {
      const cancel = cancelGeneration || onCancelGeneration;
      cancel?.();
    } else {
      onClose?.();
    }
  };

  const latestEvent = Array.isArray(pipelineProgress)
    ? pipelineProgress[pipelineProgress.length - 1]
    : pipelineProgress;

  if (generationError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-[#2A2A2A] md:bg-black/70 md:backdrop-blur-sm">
        <div className="w-full h-full md:h-auto md:max-w-md bg-[#2A2A2A] rounded-none md:rounded-sm shadow-2xl p-5 sm:p-6 text-white flex flex-col justify-between">
          <div className="flex items-start justify-between border-b border-slate-700/60 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-wider uppercase">
                  Generation Failed
                </h3>
                <p className="text-[9px] text-slate-500 mt-1">
                  {template.title || template.name || "Template generation"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-sm transition-colors cursor-pointer"
              aria-label="Close generation error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-6 flex-1 min-h-0 flex items-center overflow-y-auto">
            <p className="text-xs text-slate-300 leading-relaxed break-words">
              {generationError}
            </p>
          </div>

          <div className="border-t border-slate-700/60 pt-3 flex justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent hover:bg-white/10 text-white font-medium text-[10px] tracking-wider uppercase px-4 py-2 rounded-sm border border-slate-600 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = latestEvent?.step
    ? String(latestEvent.step).replace(/_/g, " ")
    : "Initializing";

  const currentMessage =
    latestEvent?.message || "Initializing template generation...";

  const normalizedEstimatedCreditExpense = Number(estimatedCreditExpense ?? 0);
  const safeEstimatedCreditExpense =
    Number.isFinite(normalizedEstimatedCreditExpense) &&
    normalizedEstimatedCreditExpense >= 0
      ? normalizedEstimatedCreditExpense
      : 0;

  const normalizedCreditExpense = Number(creditExpense);
  const hasFinalCreditExpense =
    creditExpense !== null &&
    creditExpense !== undefined &&
    Number.isFinite(normalizedCreditExpense) &&
    normalizedCreditExpense >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-[#2A2A2A] md:bg-black/70 md:backdrop-blur-sm overflow-hidden md:overflow-y-auto">
      <div className="w-full h-[100dvh] md:h-auto md:max-w-4xl bg-[#2A2A2A] rounded-none md:rounded-sm shadow-2xl relative text-white antialiased overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-3 sm:px-5 sm:py-3.5 shrink-0 bg-[#212121]">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Template Selection
          </span>

          <button
            type="button"
            onClick={handleClose}
            className={
              isGenerating
                ? "text-red-400 hover:text-red-300 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase border border-red-500/30 hover:border-red-400/60 rounded-sm transition-colors cursor-pointer z-10"
                : "text-slate-400 hover:text-white p-1 rounded-sm transition-colors cursor-pointer z-10"
            }
            aria-label={
              isGenerating
                ? "Cancel project generation and close dialog"
                : "Close template dialog"
            }
          >
            {isGenerating ? "Cancel" : <X className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/60 items-stretch flex-1 min-h-0 bg-[#2A2A2A] overflow-hidden">
          {/* Left Column: Details */}
          <div className="p-3 sm:p-6 flex flex-col justify-between gap-2 sm:gap-4 flex-1 min-h-0 overflow-hidden">
            <div className="shrink-0">
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase break-words">
                {template.title || template.name}
              </h3>
            </div>

            <div className="flex-1 min-h-0 max-h-28 md:max-h-none overflow-hidden flex items-center justify-center py-1">
              <img
                src={template.src}
                alt={template.alt || template.title || "Template Preview"}
                className="w-full h-full object-contain object-center opacity-90"
              />
            </div>

            <p className="text-xs sm:text-[14.5px] text-slate-300 leading-relaxed font-normal max-h-16 sm:max-h-28 overflow-y-auto pr-1 shrink-0">
              {template.description}
            </p>
          </div>

          {/* Right Column: Actions / Loading */}
          <div className="p-3 sm:p-6 flex flex-col justify-between gap-2 sm:gap-4 relative flex-1 min-h-0 overflow-hidden">
            {isGenerating ? (
              <div className="flex-1 min-h-0 flex flex-col justify-between items-center text-center p-1 sm:p-2">
                {/* Top Row: Credit Cost Display */}
                <div className="w-full shrink-0 flex items-center justify-between border border-slate-700/60 bg-[#212121] rounded-sm px-3 py-2 sm:px-4 sm:py-3 mb-2 sm:mb-6">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                    Credit Cost
                  </span>
                  <div className="text-base sm:text-lg text-blue-300">
                    <Odometer value={safeEstimatedCreditExpense} />
                  </div>
                </div>

                {/* Loading Animation Section */}
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center space-y-3 sm:space-y-6">
                  <div className="relative w-24 h-24 sm:w-40 sm:h-40 flex items-center justify-center shrink-0">
                    {LOADERS.map((loader, index) => {
                      const isActive = index === activeLoaderIndex;

                      return (
                        <div
                          key={index}
                          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
                            isActive
                              ? "opacity-100 scale-[1.1] sm:scale-[1.3] z-10 blur-0"
                              : "opacity-0 scale-[0.95] z-0 pointer-events-none blur-xs"
                          }`}
                        >
                          {loader}
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full max-w-sm flex flex-col items-center space-y-1 sm:space-y-2 shrink-0">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                      {currentStep}
                    </span>

                    <div className="relative min-h-8 sm:min-h-10 w-full overflow-hidden flex items-center justify-center">
                      <p
                        key={currentMessage}
                        className="text-[11px] sm:text-xs text-slate-200 font-medium leading-relaxed text-center transition-all duration-300"
                      >
                        {currentMessage}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Disclaimer */}
                <div className="w-full shrink-0 border-t border-slate-700/60 pt-2 sm:pt-3 mt-2 sm:mt-4 text-right">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 tracking-normal">
                    Credits are only charged after successful project generation.
                  </span>
                </div>
              </div>
            ) : (
              <>
                {hasFinalCreditExpense && (
                  <div className="w-full shrink-0 border border-slate-700/60 bg-[#212121] rounded-sm px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-500">
                          Final Credit Expense
                        </span>

                        {creditChargeStatus && (
                          <span className="block text-[8px] uppercase tracking-wider text-slate-600 mt-1">
                            {String(creditChargeStatus).replace(/_/g, " ")}
                          </span>
                        )}
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-blue-300 tabular-nums">
                        {formatCreditExpense(normalizedCreditExpense)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={onEditTemplateSelf}
                    className="w-full bg-[#3A3A3A] hover:bg-slate-700 text-left p-2.5 sm:p-3.5 rounded-sm border border-slate-600/60 hover:border-slate-400 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-[#2A2A2A] rounded-sm shrink-0">
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2]" />
                      </div>

                      <div>
                        <h5 className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase group-hover:text-blue-200 transition-colors">
                          Manual Template Fill
                        </h5>

                        <p className="text-[9px] sm:text-[10px] text-slate-300 mt-0.5 leading-normal">
                          Start with the template and edit manually.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="relative shrink-0 flex items-center justify-center my-0.5 sm:my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700/80" />
                  </div>

                  <div className="relative bg-[#2A2A2A] px-3">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      or
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 sm:gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full flex-1 min-h-[90px] sm:min-h-[140px] border border-dashed rounded-sm p-2 sm:p-4 flex flex-col items-center justify-center gap-1 sm:gap-2 cursor-pointer transition-all group ${
                      selectedFile
                        ? "border-blue-500/80 bg-[#1b365d]/20"
                        : "border-slate-600 hover:border-slate-400 bg-[#1E1E1E]"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 shrink-0" />
                    ) : (
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-white transition-colors stroke-[1.5] shrink-0" />
                    )}

                    <div className="text-center px-2">
                      <span className="text-[11px] sm:text-xs text-slate-200 group-hover:text-white font-medium block truncate max-w-xs">
                        {selectedFile
                          ? selectedFile.name
                          : "Select or drop source document"}
                      </span>

                      <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider mt-0.5 block">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                          : "PDF, DOCX, TXT, PPTX,SPREADSHEETS"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedFile}
                    onClick={handleExecuteAIFill}
                    className={`w-full shrink-0 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase px-3 py-2.5 sm:px-4 sm:py-3 rounded-sm border transition-all ${
                      selectedFile
                        ? "bg-[#1b365d] border-blue-400 text-white hover:bg-[#24477a] cursor-pointer shadow-lg"
                        : "bg-[#222222] border-slate-700/80 text-slate-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <span>Build with AI (Costs Credits)</span>
                  </button>
                </div>

                <div className="w-full shrink-0 text-right mt-0.5 sm:mt-1">
                  <span className="text-[9px] sm:text-[10px] text-slate-400">
                    Credits are only charged after successful project generation.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}