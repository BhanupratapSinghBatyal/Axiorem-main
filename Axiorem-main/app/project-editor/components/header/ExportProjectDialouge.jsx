// src/app/project-editor/components/header/ExportProjectDialogue.jsx

import React, { useEffect } from 'react';

import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Package,
  X,
} from 'lucide-react';

export default function ExportProjectDialogue({
  isOpen,
  onClose,
  onExport,
  isExporting = false,
  isSuccess = false,
  error = null,
  progress = null,
  projectName = 'Untitled Project',
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (
        event.key === 'Escape' &&
        !isExporting
      ) {
        onClose?.();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    isOpen,
    isExporting,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  const progressMessage =
    progress?.message ||
    progress ||
    (isExporting
      ? 'Preparing your export...'
      : null);

  const handleExport = async () => {
    if (isExporting) {
      return;
    }

    try {
      await onExport?.();
    } catch {
      /*
       * Export state and errors are owned by
       * the parent export hook.
       */
    }
  };

  const handleClose = () => {
    if (isExporting) {
      return;
    }

    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-project-dialog-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-xs border border-[#2F2F2F] bg-[#181818] p-6 shadow-2xl transition-all"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="h-4 w-4 text-blue-400" />

            <h2
              id="export-project-dialog-title"
              className="text-sm font-medium uppercase tracking-wider text-white"
            >
              Export Project
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isExporting}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xs text-slate-400 transition-colors hover:bg-[#262626] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close export dialog"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Project metadata */}
        <div className="mt-5 space-y-4">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Project
            </span>

            <p className="truncate text-sm font-normal text-white">
              {projectName}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Format
            </span>

            <p className="text-sm font-normal text-slate-300">
              SCORM 1.2 Package (.zip)
            </p>
          </div>

          {/* Active export progress */}
          {isExporting && (
            <div className="flex items-center gap-2.5 pt-2 text-blue-400">
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />

              <p className="truncate text-xs font-normal">
                {progressMessage}
              </p>
            </div>
          )}

          {/* Successful export */}
          {isSuccess && !isExporting && (
            <div className="flex items-center gap-2 pt-2 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />

              <p className="text-xs font-normal">
                Export complete. Download started.
              </p>
            </div>
          )}

          {/* Export failure */}
          {error && !isExporting && (
            <div className="flex items-start gap-2 pt-2 text-rose-400">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />

              <p className="break-words text-xs font-normal text-rose-300">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isExporting}
            className="rounded-xs px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-[#242424] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSuccess
              ? 'Close'
              : 'Cancel'}
          </button>

          {!isSuccess && (
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 rounded-xs bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Export
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}