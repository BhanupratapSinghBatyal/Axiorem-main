import React, { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../../store/useEditorStore';
import { useSaveDraft } from '../../../../hooks/projects/useSaveDraft';
import { usePublishProject } from '../../../../hooks/projects/usePublishActions';

export default function SaveProjectDialog({ isOpen, isPublishedMode = false, onClose }) {
  const { saveDraft, isSaving: isSavingDraft, isError: isDraftError, error: draftError } = useSaveDraft();
  const { publishProject, isPublishing, isError: isPublishError, error: publishError } = usePublishProject();

  const isProcessing = isPublishedMode ? isPublishing : isSavingDraft;
  const isError = isPublishedMode ? isPublishError : isDraftError;
  const error = isPublishedMode ? publishError : draftError;

  const {
    id,
    name,
    brandColor,
    sections,
  } = useEditorStore(
    useShallow((state) => ({
      id: state.projectId,
      name: state.projectName,
      brandColor: state.brandColor,
      sections: state.sections,
    }))
  );

  const quizSections = useMemo(() => {
    return (sections || [])
      .filter((s) => s.contentType === 'quiz')
      .map((s) => ({
        id: s.id,
        title: s.title || s.data?.sectionTitle || 'Untitled Assessment',
        revealAnswers: s.data?.revealAnswers ?? true,
        revealResults: s.data?.revealResults ?? true,
        passingScore: s.data?.passingScore ?? 80,
        timeLimit: s.data?.timeLimit ?? 0,
        shuffleQuestions: s.data?.shuffleQuestions ?? false,
        questionCount: Array.isArray(s.data?.questions) ? s.data.questions.length : 0,
      }));
  }, [sections]);

  if (!isOpen) return null;

  const handleCommitSave = async () => {
    try {
      if (isPublishedMode) {
        await publishProject();
      } else {
        await saveDraft();
      }
      useEditorStore.getState().setIsDirty(false);
      onClose();
    } catch {
      // Managed by hooks
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-white antialiased">
      <div className="bg-[#3A3A3A] rounded-sm shadow-lg w-full max-w-3xl p-6 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header Section */}
        <div className="space-y-1.5 shrink-0">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {isPublishedMode ? 'Publish Project' : 'Save Changes'}
          </h3>
          <p className="text-xs text-slate-300 uppercase tracking-wider font-medium">
            {isPublishedMode
              ? 'Are you sure you want to publish this version of your project?'
              : 'Are you sure you want to save the project details listed below?'}
          </p>
        </div>

        {/* 2-Column Grid Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-1 overflow-y-auto pr-1">
          {/* Left Column: Top Level Course Configs */}
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold text-slate-300 block tracking-wider pb-1.5 border-b border-slate-600/60">
              Course Configurations
            </span>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">
                Project Name
              </span>
              <span className="text-sm font-medium text-white block truncate mt-0.5">
                {name || 'Untitled Project'}
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">
                Brand Color
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-4 h-4 rounded-full border border-white/20 inline-block shrink-0"
                  style={{ backgroundColor: brandColor }}
                />
                <span className="text-sm font-mono text-slate-200">
                  {brandColor}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">
                Total Sections
              </span>
              <span className="text-sm font-medium text-white block mt-0.5">
                {sections?.length || 0}
              </span>
            </div>
          </div>

          {/* Right Column: Quiz Specific Configs */}
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold text-slate-300 block tracking-wider pb-1.5 border-b border-slate-600/60">
              Assessment Configurations ({quizSections.length})
            </span>

            {quizSections.length === 0 ? (
              <span className="text-xs text-slate-400 italic block">
                No assessment sections configured.
              </span>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {quizSections.map((quiz, index) => (
                  <div
                    key={quiz.id || index}
                    className="bg-[#2D2D2D] p-3 rounded-sm space-y-2.5 border border-slate-600/40"
                  >
                    <div className="flex items-center justify-between border-b border-slate-600/40 pb-1.5">
                      <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                        {quiz.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {quiz.questionCount} {quiz.questionCount === 1 ? 'Question' : 'Questions'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                          Time Limit
                        </span>
                        <span className="text-xs font-medium text-white block mt-0.5">
                          {quiz.timeLimit > 0 ? `${quiz.timeLimit} mins` : 'Disabled'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                          Passing Score
                        </span>
                        <span className="text-xs font-medium text-white block mt-0.5">
                          {quiz.passingScore}%
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                          Reveal Answers
                        </span>
                        <span className="text-xs font-medium text-white block mt-0.5">
                          {quiz.revealAnswers ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                          Reveal Results
                        </span>
                        <span className="text-xs font-medium text-white block mt-0.5">
                          {quiz.revealResults ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Feedback Display */}
        {isError && (
          <div className="p-2.5 bg-red-900/50 border border-red-700 rounded-sm text-xs text-red-200 font-medium shrink-0">
            {error || `An error occurred while ${isPublishedMode ? 'publishing' : 'saving'}.`}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 text-xs font-bold uppercase tracking-wider pt-2 border-t border-slate-600/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-slate-300 hover:bg-slate-600 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCommitSave}
            disabled={isProcessing}
            className="px-4 py-2 bg-[#1b365d] hover:bg-[#2a4a7a] text-white rounded-sm transition-colors cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isProcessing
                ? isPublishedMode
                  ? 'Publishing...'
                  : 'Saving...'
                : isPublishedMode
                ? 'Publish'
                : 'Save'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}