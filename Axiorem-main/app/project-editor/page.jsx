// src/app/project-editor/page.jsx
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Header from './components/header/index';
import SidebarOutline from './components/SidebarOutline';
import CanvasArea from './components/CanvasArea';
import InlinePreviewCanvas from './components/preview/InlinePreviewCanvas';
import UnsavedChangesModal from './components/UnsavedChangesModal';
import { useEditorStore } from './store/useEditorStore';
import ProjectEditorHydrator from './ProjectEditorHydrator';

function EditorLayout() {
  const isPreviewModeActive = useEditorStore((state) => state.isPreviewModeActive);
  const isDirty = useEditorStore((state) => state.isDirty);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);

  // 1. Native tab/window close or hard refresh (Triggers standard browser dialog)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 2. Intercept Browser Back/Forward button clicks
  useEffect(() => {
    if (!isDirty) return;

    // Push dummy history entry so back button hits popstate instead of leaving immediately
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e) => {
      if (isDirty) {
        // Re-push history entry to lock history position
        window.history.pushState(null, '', window.location.href);
        setPendingUrl('BACK_NAVIGATION');
        setShowExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDirty]);

  const handleConfirmLeave = () => {
    setShowExitModal(false);
    useEditorStore.getState().setIsDirty(false);

    if (pendingUrl === 'BACK_NAVIGATION') {
      window.history.go(-2); // Navigate past dummy push state
    } else if (pendingUrl) {
      window.location.href = pendingUrl;
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="w-full h-screen h-[100dvh] flex flex-col bg-[#f9fbfd] text-[#1f1f1f] font-sans antialiased overflow-hidden relative">
      <Header />
      
      <div className="flex flex-1 w-full min-h-0 overflow-hidden relative">
        {!isPreviewModeActive && <SidebarOutline />}
        
        <div className="flex-1 flex flex-col min-h-0 relative bg-[#f0f4f9]">
          <CanvasArea />
        </div>
      </div>

      <InlinePreviewCanvas />

      <UnsavedChangesModal
        isOpen={showExitModal}
        onCancel={() => {
          setShowExitModal(false);
          setPendingUrl(null);
        }}
        onConfirmLeave={handleConfirmLeave}
      />
    </div>
  );
}

export default function Page() {
  useEffect(() => {
    document.title = "Axiorem: Project Editor";
  }, []);

  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center bg-[#212121] text-white text-xs uppercase tracking-wider font-semibold">
          Initializing Editor...
        </div>
      }
    >
      <ProjectEditorHydrator>
        <EditorLayout />
      </ProjectEditorHydrator>
    </Suspense>
  );
}