import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditorStore } from '../../app/project-editor/store/useEditorStore.js';
import { serializeEditorDocument } from './serializers/documentSerializer.js';

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

/**
 * Dispatches serialized project draft updates to the primary API endpoint.
 */
const saveProjectDraftRequest = async (projectId, payload) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  const contentType = res.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const textError = await res.text();
    throw new Error(`Server Error (${res.status}): ${textError || res.statusText}`);
  }

  if (!res.ok) {
    throw new Error(data?.details || data?.error || `Failed to save project draft (${res.status}).`);
  }

  return data.data;
};

/**
 * Encapsulated save pipeline function.
 */
const performSaveDraft = async () => {
  const stateSnapshot = useEditorStore.getState();

  // Primary: resolve projectId from Zustand state
  let projectId = stateSnapshot.projectId || stateSnapshot.id;

  // Fallback: resolve directly from browser URL query string
  if (!projectId && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    projectId = urlParams.get('id');

    if (projectId) {
      stateSnapshot.setProjectId(projectId);
    }
  }

  if (!projectId) {
    throw new Error('Cannot save draft: Project ID is missing from editor state.');
  }

  const serializedDocument = serializeEditorDocument(stateSnapshot);

  return saveProjectDraftRequest(projectId, serializedDocument);
};

export function useSaveDraft() {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: performSaveDraft,
    onSuccess: (updatedProject) => {
      if (!updatedProject) return;

      // 1. Hydrate individual project detail cache
      queryClient.setQueryData(['project', updatedProject.id], updatedProject);

      // 2. Invalidate top-level project collection query cache
      queryClient.invalidateQueries({ queryKey: ['projects'] });

      // 3. Commit strict server metadata snapshot back to session state if handler exists
      const store = useEditorStore.getState();
      if (typeof store.markSaved === 'function') {
        store.markSaved({
          updatedAt: updatedProject.updatedAt,
          version: updatedProject.version
        });
      }
    }
  });

  return {
    saveDraft: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isSuccess: saveMutation.isSuccess,
    isError: saveMutation.isError,
    error: saveMutation.error?.message || null,
    data: saveMutation.data,
    status: saveMutation.status
  };
}