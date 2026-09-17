import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useShallow } from 'zustand/react/shallow';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Fetch Active Workspace Configuration
 * SECURITY: Strips explicit client-side identity parameters. Mandates cookie passing.
 */
const fetchActiveWorkspace = async () => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/active`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include', // Enforces transmission of HTTP-only cookies across different ports/origins
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to synchronize active workspace container');
  return res.json();
};

/**
 * Fetch Workspace Metrics Telemetry
 * SECURITY: Relies on server-side membership validation based on hydrated cookies.
 */
const fetchWorkspaceMetrics = async (workspaceId) => {
  if (!workspaceId) return null;
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/dashboard-metrics`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Crucial for cookie transmission across subdomains
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to compute dashboard metrics telemetry');
  return res.json();
};

export function useDashboardMetrics() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentWorkspace = useAuthStore(useShallow((state) => state.getCurrentWorkspace()));

  // Invalidate query key structure relying on dynamic parameter variables
  const workspaceQueryKey = ['workspace', 'active'];

  const activeWorkspaceQuery = useQuery({
    queryKey: workspaceQueryKey,
    queryFn: fetchActiveWorkspace,
    enabled: isAuthenticated,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  });

  const rawActiveData = activeWorkspaceQuery.data?.payload || activeWorkspaceQuery.data;

  const isValidApiPayload = !!(
    rawActiveData && 
    (rawActiveData.workspaceId || rawActiveData.id || rawActiveData.organizationId || rawActiveData.name || rawActiveData.organizationName)
  );

  const resolvedWorkspace = isValidApiPayload ? rawActiveData : currentWorkspace;

  const activeWorkspaceId = 
    resolvedWorkspace?.workspaceId || 
    resolvedWorkspace?.organizationId || 
    resolvedWorkspace?.id;

  const metricsQueryKey = ['workspace', 'metrics', activeWorkspaceId];

  const metricsQuery = useQuery({
    queryKey: metricsQueryKey,
    queryFn: () => fetchWorkspaceMetrics(activeWorkspaceId),
    enabled: !!activeWorkspaceId && isAuthenticated,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  });

  const syncDashboardMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) return null;
      const wsData = await fetchActiveWorkspace();
      const activeData = wsData?.payload || wsData;
      const wsId = activeData?.workspaceId || activeData?.organizationId || activeData?.id;
      
      if (!wsId) return { workspace: wsData, metrics: null };
      const metricData = await fetchWorkspaceMetrics(wsId);
      return { workspace: wsData, metrics: metricData };
    },
    onSuccess: (responseData) => {
      if (!responseData) return;
      queryClient.setQueryData(workspaceQueryKey, responseData.workspace);
      if (responseData.metrics) {
        queryClient.setQueryData(metricsQueryKey, responseData.metrics);
      }
    }
  });

  const normalizedWorkspace = resolvedWorkspace 
    ? {
        ...resolvedWorkspace,
        organizationName: resolvedWorkspace.organizationName || resolvedWorkspace.name || "Unknown Workspace"
      }
    : null;

  return {
    workspace: normalizedWorkspace,
    data: metricsQuery.data?.payload || metricsQuery.data, 
    isLoading: activeWorkspaceQuery.isLoading || metricsQuery.isLoading,
    isError: activeWorkspaceQuery.isError || metricsQuery.isError,
    error: metricsQuery.error || activeWorkspaceQuery.error,
    isSyncing: syncDashboardMutation.isPending,
    syncDashboard: syncDashboardMutation.mutate
  };
}