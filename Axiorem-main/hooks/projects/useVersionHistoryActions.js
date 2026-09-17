import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEditorStore } from '../../app/project-editor/store/useEditorStore.js';
import { BACKEND_BASE_URL, handleJsonResponse, resolveProjectId } from './utils/projectUtils.js';

/* ==========================================================================
   API REQUEST FUNCTIONS
   ========================================================================== */

const fetchProjectHistoryRequest = async (projectId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}/versions`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  const data = await handleJsonResponse(res, 'Failed to fetch project history');
  return data.data;
};

const fetchVersionByIdRequest = async (projectId, versionId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}/versions/${versionId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  const data = await handleJsonResponse(res, 'Failed to fetch version snapshot');
  return data.data;
};

const restoreVersionRequest = async (projectId, versionId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}/versions/${versionId}/restore`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  const data = await handleJsonResponse(res, 'Failed to restore project version');
  return data.data;
};

/* ==========================================================================
   MUTATION EXECUTORS
   ========================================================================== */

const performRestoreVersion = async (versionId) => {
  if (!versionId) {
    throw new Error('Cannot restore project: Target versionId is missing.');
  }

  const projectId = resolveProjectId();
  if (!projectId) {
    throw new Error('Cannot restore project: Project ID is missing from editor state.');
  }

  return restoreVersionRequest(projectId, versionId);
};

/* ==========================================================================
   REACT HOOKS
   ========================================================================== */

/**
 * Fetches lightweight version history items (excluding heavy snapshot payloads).
 */
export function useProjectHistory(projectId) {
  const targetProjectId = projectId || resolveProjectId();

  const query = useQuery({
    queryKey: ['project-history', targetProjectId],
    queryFn: () => fetchProjectHistoryRequest(targetProjectId),
    enabled: Boolean(targetProjectId)
  });

  return {
    history: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch
  };
}

/**
 * Fetches a single historical version snapshot for side-by-side comparison or preview.
 */
export function useVersionSnapshot(versionId, projectId) {
  const targetProjectId = projectId || resolveProjectId();

  const query = useQuery({
    queryKey: ['project-version', targetProjectId, versionId],
    queryFn: () => fetchVersionByIdRequest(targetProjectId, versionId),
    enabled: Boolean(targetProjectId && versionId)
  });

  return {
    versionSnapshot: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message || null
  };
}

/**
 * Restores a historic snapshot into the active editor state as a new draft release.
 */
export function useRestoreVersion() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (versionId) => performRestoreVersion(versionId),
    onSuccess: (updatedProject) => {
      if (!updatedProject) return;

      queryClient.setQueryData(['project', updatedProject.id], updatedProject);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-publish-status', updatedProject.id] });
      queryClient.invalidateQueries({ queryKey: ['project-history', updatedProject.id] });

      const store = useEditorStore.getState();
      if (typeof store.loadProject === 'function') {
        store.loadProject(updatedProject);
      } else if (typeof store.markSaved === 'function') {
        store.markSaved({
          updatedAt: updatedProject.updatedAt,
          version: updatedProject.editorVersion
        });
      }
    }
  });

  return {
    restoreVersion: mutation.mutateAsync,
    isRestoring: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error?.message || null,
    data: mutation.data,
    status: mutation.status
  };
}