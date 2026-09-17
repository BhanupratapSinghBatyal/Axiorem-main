// app/hub/[projectId]/preview/page.jsx
'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const DEV_PREVIEW_SECRET = 'dev-preview-secret-2026';

export default function Preview({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { projectId } = params;
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [previewState, setPreviewState] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment || token !== DEV_PREVIEW_SECRET) {
      router.replace('/error?type=invalid_dev_preview_token');
      return;
    }
    setIsAuthorized(true);

    // Initial storage retrieval
    const initialRawData = localStorage.getItem('dev-live-preview-matrix');
    if (initialRawData) {
      setPreviewState(JSON.parse(initialRawData));
    }

    // Cross-tab storage modification synchronization listener
    const handleStorageUpdate = (event) => {
      if (event.key === 'dev-live-preview-matrix' && event.newValue) {
        setPreviewState(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [token, router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Verification Staging Notification Banner */}
      <div className="w-full bg-amber-500 text-white text-xs font-bold py-1.5 px-4 text-center tracking-wide select-none z-50 shadow-xs">
        PREVIEW MODE — LOCAL DEV BYPASS ACTIVE (PROJECT ID: {projectId})
      </div>

      {/* Presentation Execution View Container */}
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Preview Sandbox Root</h1>
          <p className="text-sm text-slate-500 mb-4">
            Routing validations passed successfully. LocalStorage live-sync link operational.
          </p>
          <div className="text-[11px] font-mono bg-slate-50 text-slate-600 rounded-lg p-3 text-left space-y-1 border border-slate-100">
            <div>[context]: route_verified</div>
            <div>[project]: {projectId}</div>
            <div>[handshake]: authorized</div>
          </div>
        </div>

        {/* Live Raw Document Structure Inspection Terminal */}
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner min-h-[400px]">
          <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700/50 shrink-0">
            <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
              Live State JSON Terminal
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 font-medium">STREAMING ACTIVE</span>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-emerald-300 leading-relaxed selection:bg-emerald-800 selection:text-white">
            {previewState ? (
              <pre className="whitespace-pre-wrap select-text">
                {JSON.stringify(previewState, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 select-none">
                Awaiting initial content context matrix dump...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}