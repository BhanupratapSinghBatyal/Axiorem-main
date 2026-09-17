// src/hooks/useLibraryData.js
import { useQuery } from '@tanstack/react-query';
import { deserializeEditorDocument } from './projects/serializers/documentSerializer'; // Adjust relative import path as needed

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

const fetchLibraryProjectsList = async ({ page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/library/projects?${params.toString()}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch library projects (${res.status})`);
  }

  return res.json();
};

const fetchProjectById = async (id) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/projects/${id}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch project (${res.status})`);
  }

  const payload = await res.json();
  return deserializeEditorDocument(payload.data);
};

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export function useLibraryData({ activeTab = 'projects', page = 1, limit = 10 } = {}) {
  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.max(Number(limit) || 10, 1);

  const projectsQuery = useQuery({
    queryKey: ['library-projects', { page: currentPage, limit: currentLimit }],
    queryFn: () => fetchLibraryProjectsList({ page: currentPage, limit: currentLimit }),
    enabled: activeTab === 'projects',
    staleTime: 1000 * 60 * 5,
  });

  const projectsData = (projectsQuery.data?.items || []).map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    sectionCount: project.sectionCount,
    createdAt: project.createdAt, // <-- Pass original raw ISO string
    updatedAt: project.updatedAt, // <-- Pass original raw ISO string
    publishedAt: project.publishedAt,
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

export function useProject(id) {
  const projectQuery = useQuery({
    queryKey: ['project', id],
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