import React from 'react';

export default function DocumentSummary({ document }) {
  if (!document) return null;

  const { name, settings } = document;

  const {
    hasTimeLimit,
    timeLimitMinutes,
    answerRevealMode,
    requireFullscreen,
    enableAiGrading,
    candidateInstructions
  } = settings ?? {};

  const summaryRows = [
    {
      label: "Duration Limit Matrix",
      value: hasTimeLimit ? `${timeLimitMinutes} minutes` : "No Restriction",
      className: "text-white"
    },
    {
      label: "Answer Reveal Protocol",
      value: answerRevealMode ? answerRevealMode.replace(/-/g, ' ') : "Side by side",
      className: "capitalize text-white"
    },
    {
      label: "Fullscreen Restrictions",
      value: requireFullscreen ? "Active Constraint" : "Disabled",
      className: requireFullscreen ? "text-amber-400" : "text-white"
    },
    {
      label: "Automated AI Assessment",
      value: enableAiGrading ? "Enabled" : "Disabled",
      className: enableAiGrading ? "text-blue-400" : "text-white"
    }
  ];

  return (
    <div className="bg-[#212121] rounded-sm p-3 text-[10px] font-bold uppercase tracking-wider space-y-2.5 text-slate-300 max-h-48 overflow-y-auto">
      {/* Document Identifier Row */}
      <div className="flex justify-between items-start border-b border-slate-700 pb-1.5">
        <span className="text-slate-400 font-medium">Document Identifier</span>
        <span className="text-white font-bold text-right truncate max-w-[200px]">
          {name ?? 'Untitled Document'}
        </span>
      </div>

      {/* Data-Driven Settings Rows */}
      {summaryRows.map((row) => (
        <div key={row.label} className="flex justify-between items-center border-b border-slate-700 pb-1.5">
          <span className="text-slate-400 font-medium">{row.label}</span>
          <span className={`font-bold ${row.className}`}>
            {row.value}
          </span>
        </div>
      ))}

      {/* Directives Payload Block */}
      <div className="flex flex-col gap-1 pt-0.5">
        <span className="text-slate-400 font-medium">Directives Meta Payload</span>
        <p className="text-[10px] bg-[#3A3A3A] border border-slate-700 rounded-sm p-1.5 text-white font-mono normal-case tracking-normal overflow-x-auto whitespace-pre-wrap max-h-16">
          {candidateInstructions ?? '(None provided)'}
        </p>
      </div>
    </div>
  );
}