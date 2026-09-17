import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

/**
 * Dispatches project creation payload to backend.
 * Personal workspace assignment is resolved server-side.
 */
const dispatchCreateProject = async (payload) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.details || data?.error || 'Failed to create new project.');
  }

  return data.data;
};
export function useCreateProject() {
  const queryClient = useQueryClient();
  const personalWorkspaceId = useAuthStore((state) => state.user?.personalWorkspaceId);

  const createMutation = useMutation({
    mutationFn: async (payload = {}) => {
      // Construct project creation payload. Workspace assignment is resolved by the backend.
      const createPayload = {
        name: payload.name ?? 'Untitled Project',
        description: payload.description ?? '',
        brandColor: payload.brandColor,
        templateId: payload.templateId ?? null,
      };

      return dispatchCreateProject(createPayload);
    },
    onSuccess: (newProject) => {
      // 1. Direct Cache Hydration: Populate query cache for immediate editor rendering
      if (newProject?.id) {
        queryClient.setQueryData(['project', newProject.id], newProject);
      }

      // 2. Invalidate personal workspace list since all new projects begin as personal drafts
      if (personalWorkspaceId) {
        queryClient.invalidateQueries({ queryKey: ['projects', personalWorkspaceId] });
      }
    }
  });

  const status = createMutation.isPending
    ? 'creating'
    : createMutation.isError
      ? 'error'
      : createMutation.isSuccess
        ? 'success'
        : 'idle';

  return {
    createProject: createMutation.mutateAsync,
    status,
    isCreating: createMutation.isPending,
    error: createMutation.error?.message || null,
    isSuccess: createMutation.isSuccess,
    data: createMutation.data
  };
}