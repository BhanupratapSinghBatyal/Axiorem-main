// src/hooks/useLibraryActions.js
import { useMutation, useQueryClient } from '@tanstack/react-query';

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

const deleteProjectApi = async (projectId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete project (${res.status})`);
  }

  return res.json();
};

const shareProjectToOrgApi = async (projectId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${projectId}/share-to-organization`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to share project to organization (${res.status})`);
  }

  return res.json();
};

export function useLibraryActions() {
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId) => deleteProjectApi(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-projects'] });
      queryClient.invalidateQueries({ queryKey: ['organization-projects'] });
    },
  });

  const shareProjectMutation = useMutation({
    mutationFn: (projectId) => shareProjectToOrgApi(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-projects'] });
      queryClient.invalidateQueries({ queryKey: ['library-projects'] });
    },
  });

  return {
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending,
    deleteError: deleteProjectMutation.error?.message || null,

    shareProjectToOrg: shareProjectMutation.mutateAsync,
    isSharing: shareProjectMutation.isPending,
    shareError: shareProjectMutation.error?.message || null,
  };
}