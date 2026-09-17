// src/app/project-editor/ProjectEditorHydrator.jsx
"use client";

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { useProject } from '../../hooks/useLibaryData';
import { useEditorStore } from './store/useEditorStore';

export default function ProjectEditorHydrator({ children }) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  const { project, isLoading, isError, error } = useProject(projectId);
  const hydrateStore = useEditorStore((state) => state.hydrateStore);
  const setProjectId = useEditorStore((state) => state.setProjectId);

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
    }
  }, [projectId, setProjectId]);

  useEffect(() => {
    if (project && hydrateStore) {
      hydrateStore(project);
    }
  }, [project, hydrateStore]);

  if (!projectId) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#212121] text-white space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-xs uppercase tracking-wider font-semibold">
          Loading Project State...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#212121] text-red-400 space-y-3">
        <AlertCircle className="h-8 w-8" />
        <span className="text-xs uppercase tracking-wider font-semibold">
          {error || 'Failed to load project'}
        </span>
      </div>
    );
  }

  return <>{children}</>;
}