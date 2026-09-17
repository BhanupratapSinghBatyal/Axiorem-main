// src/hooks/useOrganizationProjectData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deserializeEditorDocument } from './projects/serializers/documentSerializer';

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

const fetchOrganizationProjectsList = async ({ page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/organization/projects?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch organization projects (${res.status})`);
  }

  return res.json();
};

const fetchProjectById = async (id) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch project (${res.status})`);
  }

  const payload = await res.json();
  return deserializeEditorDocument(payload.data);
};

const deleteProjectApi = async (id) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete project (${res.status})`);
  }

  return res.json();
};

const duplicateProjectApi = async (id) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${id}/duplicate`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to duplicate project (${res.status})`);
  }

  return res.json();
};

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export function useOrganizationProjectData({ activeTab = 'projects', page = 1, limit = 20 } = {}) {
  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.max(Number(limit) || 20, 1);

  const projectsQuery = useQuery({
    queryKey: ['organization-projects', { page: currentPage, limit: currentLimit }],
    queryFn: () => fetchOrganizationProjectsList({ page: currentPage, limit: currentLimit }),
    enabled: activeTab === 'projects',
    staleTime: 1000 * 60 * 5,
  });

  const projectsData = (projectsQuery.data?.items || []).map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    sectionCount: project.sectionCount,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    publishedAt: project.publishedAt,
    createdBy: project.createdBy,
    date: formatDate(project.updatedAt || project.createdAt),
    size: `${project.sectionCount ?? 0} sections`,
  }));

  return {
    projects: projectsData,
    totalProjects: projectsQuery.data?.total ?? projectsData.length,
    page: projectsQuery.data?.page ?? currentPage,
    limit: projectsQuery.data?.limit ?? currentLimit,
    totalPages: projectsQuery.data?.totalPages ?? 1,
    hasPreviousPage: projectsQuery.data?.hasPreviousPage ?? (currentPage > 1),
    hasNextPage: projectsQuery.data?.hasNextPage ?? false,
    isLoading: activeTab === 'projects' && projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error?.message || null,
    refetchProjects: projectsQuery.refetch,
    query: projectsQuery,
  };
}

export function useOrganizationProject(id) {
  const projectQuery = useQuery({
    queryKey: ['organization-project', id],
    queryFn: () => fetchProjectById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });

  return {
    project: projectQuery.data || null,
    isLoading: projectQuery.isLoading,
    isError: projectQuery.isError,
    error: projectQuery.error?.message || null,
    refetch: projectQuery.refetch,
    query: projectQuery,
  };
}

export function useOrganizationProjectActions() {
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-projects'] });
      queryClient.invalidateQueries({ queryKey: ['library-projects'] });
    },
  });

  const duplicateProjectMutation = useMutation({
    mutationFn: duplicateProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-projects'] });
      queryClient.invalidateQueries({ queryKey: ['library-projects'] });
    },
  });

  return {
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending,
    deleteError: deleteProjectMutation.error?.message || null,

    duplicateProject: duplicateProjectMutation.mutateAsync,
    isDuplicating: duplicateProjectMutation.isPending,
    duplicateError: duplicateProjectMutation.error?.message || null,
  };
}