import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const fetchWorkspaceSummary = async (workspaceId) => {
  if (!workspaceId) throw new Error('Missing path parameter: workspaceId');
  
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/summary`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    cache: 'no-store'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to fetch workspace summary');
  }
  
  return res.json();
};

const fetchActiveWorkspaces = async () => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/active`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    cache: 'no-store'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to fetch active workspaces');
  }
  
  return res.json();
};

const fetchWorkspaceMembers = async (workspaceId, queryParam = '') => {
  if (!workspaceId) throw new Error('Missing path parameter: workspaceId');
  
  const url = new URL(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/members/search`);
  if (queryParam) {
    url.searchParams.append('query', queryParam);
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    cache: 'no-store'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to fetch workspace members');
  }
  
  return res.json();
};

export function useOrganizationData(searchTerm = '') {
  const queryClient = useQueryClient();
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const workspaces = useAuthStore((state) => state.workspaces);

  const activeWorkspacesQuery = useQuery({
    queryKey: ['workspaces', 'active'],
    queryFn: fetchActiveWorkspaces,
    enabled: isAuthenticated,
    staleTime: 10000,
  });

  const rawActiveWorkspacesList = activeWorkspacesQuery.data?.payload || activeWorkspacesQuery.data || [];

  const targetId = user?.lastAccessedWorkspaceId || 
                   user?.personalWorkspaceId || 
                   rawActiveWorkspacesList.find(w => w.isLastAccessed)?.workspaceId || 
                   rawActiveWorkspacesList.find(w => w.isLastAccessed)?.id || 
                   rawActiveWorkspacesList[0]?.workspaceId ||
                   rawActiveWorkspacesList[0]?.id;
                   
  const rawWorkspace = (workspaces || []).find((ws) => ws.organizationId === targetId || ws.id === targetId || ws.workspaceId === targetId) || workspaces?.[0] || null;

  const workspaceId = targetId || 
                      rawWorkspace?.workspaceId || 
                      rawWorkspace?.id || 
                      rawWorkspace?.organizationId || 
                      '';

  const summaryQueryKey = ['workspace', 'summary', workspaceId];

  const summaryQuery = useQuery({
    queryKey: summaryQueryKey,
    queryFn: () => fetchWorkspaceSummary(workspaceId),
    enabled: !!workspaceId && isAuthenticated,
    staleTime: 10000,
  });

  const membersQuery = useQuery({
    queryKey: ['workspace', 'members', workspaceId, searchTerm],
    queryFn: () => fetchWorkspaceMembers(workspaceId, searchTerm),
    enabled: !!workspaceId && isAuthenticated,
    staleTime: 10000,
  });

  const syncSummaryMutation = useMutation({
    mutationFn: async () => {
      if (!workspaceId || !isAuthenticated) return null;
      return await fetchWorkspaceSummary(workspaceId);
    },
    onSuccess: (responseData) => {
      if (!responseData) return;
      queryClient.setQueryData(summaryQueryKey, responseData);
    }
  });

  const rawSummaryData = summaryQuery.data?.payload || summaryQuery.data;
  const rawMembersData = membersQuery.data?.payload || membersQuery.data || [];

  // CRITICAL FIX: Match the exact property access expected by your React View component
  const normalizedWorkspace = rawSummaryData
    ? {
        workspaceId: rawSummaryData.workspaceId || rawSummaryData.id,
        name: rawSummaryData.name || rawSummaryData.organizationName || "Default Workspace",
        status: rawSummaryData.status,
        isPersonal: rawSummaryData.isPersonal,
        subscriptionTier: rawSummaryData.subscriptionTier,
        billingPlan: rawSummaryData.billingPlan,
        canExportScorm: rawSummaryData.canExportScorm,
        // Match both `metricsSnapshot` and sub-properties directly mapped inside the backend payload
        metricsSnapshot: {
          activeMembers: rawSummaryData.metricsSnapshot?.activeMembers ?? rawSummaryData.metrics?.activeMembers ?? rawSummaryData.activeMembers ?? 0,
          activeAdmins: rawSummaryData.metricsSnapshot?.activeAdmins ?? rawSummaryData.metrics?.activeAdmins ?? rawSummaryData.activeAdmins ?? 0,
          totalProjects: rawSummaryData.metricsSnapshot?.totalProjects ?? rawSummaryData.metrics?.totalProjects ?? rawSummaryData.totalProjects ?? 0,
          resourcesSaved: rawSummaryData.metricsSnapshot?.resourcesSaved ?? rawSummaryData.metrics?.resourcesSaved ?? rawSummaryData.resourcesSaved ?? 0
        },
        metadata: rawSummaryData.metadata || {
          establishedAt: null,
          lastModifiedAt: null
        }
      }
    : null;

  return {
    workspace: normalizedWorkspace,
    activeWorkspaces: rawActiveWorkspacesList,
    members: rawMembersData,
    isLoading: (!workspaceId && activeWorkspacesQuery.isLoading) || summaryQuery.isLoading || membersQuery.isLoading,
    isActiveWorkspacesLoading: activeWorkspacesQuery.isLoading,
    isMembersLoading: membersQuery.isLoading,
    isError: summaryQuery.isError || activeWorkspacesQuery.isError || membersQuery.isError,
    error: summaryQuery.error || activeWorkspacesQuery.error || membersQuery.error,
    isSyncing: syncSummaryMutation.isPending,
    syncSummary: syncSummaryMutation.mutate
  };
}