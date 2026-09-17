import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEditorStore } from '../../app/project-editor/store/useEditorStore.js';
import { serializeEditorDocument } from './serializers/documentSerializer.js';
import { BACKEND_BASE_URL, handleJsonResponse, resolveProjectId } from './utils/projectUtils.js';

/* ==========================================================================
   API REQUEST FUNCTIONS
   ========================================================================== */

const publishProjectRequest = async (projectId, payload) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  const data = await handleJsonResponse(res, 'Failed to publish project');
  return data.data;
};

const unpublishProjectRequest = async (projectId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}/unpublish`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  const data = await handleJsonResponse(res, 'Failed to unpublish project');
  return data.data;
};

const fetchPublishStatusRequest = async (projectId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}/publish-status`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  const data = await handleJsonResponse(res, 'Failed to fetch publish status');
  return data.data;
};

/* ==========================================================================
   MUTATION EXECUTORS
   ========================================================================== */

const performPublish = async () => {
  const projectId = resolveProjectId();
  if (!projectId) {
    throw new Error('Cannot publish project: Project ID is missing from editor state.');
  }

  const stateSnapshot = useEditorStore.getState();
  const serializedDocument = serializeEditorDocument(stateSnapshot);

  return publishProjectRequest(projectId, serializedDocument);
};

const performUnpublish = async () => {
  const projectId = resolveProjectId();
  if (!projectId) {
    throw new Error('Cannot unpublish project: Project ID is missing from editor state.');
  }

  return unpublishProjectRequest(projectId);
};

/* ==========================================================================
   REACT HOOKS
   ========================================================================== */

/**
 * Publishes the current serialized editor state.
 */
export function usePublishProject() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: performPublish,
    onSuccess: (updatedProject) => {
      if (!updatedProject) return;

      queryClient.setQueryData(['project', updatedProject.id], updatedProject);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-publish-status', updatedProject.id] });
      queryClient.invalidateQueries({ queryKey: ['project-history', updatedProject.id] });

      const store = useEditorStore.getState();
      if (typeof store.markSaved === 'function') {
        store.markSaved({
          updatedAt: updatedProject.updatedAt,
          version: updatedProject.editorVersion
        });
      }
    }
  });

  return {
    publishProject: mutation.mutateAsync,
    isPublishing: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error?.message || null,
    data: mutation.data,
    status: mutation.status
  };
}

/**
 * Unpublishes the current project document.
 */
export function useUnpublishProject() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: performUnpublish,
    onSuccess: (updatedProject) => {
      if (!updatedProject) return;

      queryClient.setQueryData(['project', updatedProject.id], updatedProject);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-publish-status', updatedProject.id] });

      const store = useEditorStore.getState();
      if (typeof store.markSaved === 'function') {
        store.markSaved({
          updatedAt: updatedProject.updatedAt,
          version: updatedProject.editorVersion
        });
      }
    }
  });

  return {
    unpublishProject: mutation.mutateAsync,
    isUnpublishing: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error?.message || null,
    data: mutation.data,
    status: mutation.status
  };
}

/**
 * Fetches current publication metadata for a given project.
 */
export function usePublishStatus(projectId) {
  const targetProjectId = projectId || resolveProjectId();

  const query = useQuery({
    queryKey: ['project-publish-status', targetProjectId],
    queryFn: () => fetchPublishStatusRequest(targetProjectId),
    enabled: Boolean(targetProjectId)
  });

  return {
    statusData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch
  };
}