import { useMutation, useQueryClient } from '@tanstack/react-query';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const reportActionError = (setFeedbackMessage, error, fallbackMessage) => {
  if (!setFeedbackMessage) return;

  setFeedbackMessage({
    type: 'error',
    text: error?.message || fallbackMessage,
  });
};

const executeWorkspaceLeave = async (workspaceId) => {
  if (!workspaceId) throw new Error('Missing path parameter: workspaceId');

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to opt out of workspace.');
  }

  return res.json();
};

const executeMembershipTermination = async ({ workspaceId, membershipId }) => {
  if (!workspaceId || !membershipId) throw new Error('Missing required path parameters');

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/members/${membershipId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to terminate membership.');
  }

  return res.json();
};

const executePromotion = async ({ workspaceId, membershipId }) => {
  if (!workspaceId || !membershipId) throw new Error('Missing required path parameters');

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/members/${membershipId}/promote`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to promote member.');
  }

  return res.json();
};

const executeDemotion = async ({ workspaceId, membershipId }) => {
  if (!workspaceId || !membershipId) throw new Error('Missing required path parameters');

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/members/${membershipId}/demote`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Failed to demote member.');
  }

  return res.json();
};

export function useWorkspaceActions(setFeedbackMessage) {
  const queryClient = useQueryClient();

  const leaveMutation = useMutation({
    mutationFn: executeWorkspaceLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', 'active'] });
    },
    onError: (error) => {
      reportActionError(setFeedbackMessage, error, 'Failed to opt out of workspace.');
    }
  });

  const terminateMutation = useMutation({
    mutationFn: executeMembershipTermination,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'members', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', 'metrics', variables.workspaceId] });
    },
    onError: (error) => {
      reportActionError(setFeedbackMessage, error, 'Failed to terminate membership.');
    }
  });

  const promoteMutation = useMutation({
    mutationFn: executePromotion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'members', variables.workspaceId] });
    },
    onError: (error) => {
      reportActionError(setFeedbackMessage, error, 'Failed to promote member.');
    }
  });

  const demoteMutation = useMutation({
    mutationFn: executeDemotion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'members', variables.workspaceId] });
    },
    onError: (error) => {
      reportActionError(setFeedbackMessage, error, 'Failed to demote member.');
    }
  });

  return {
    leaveWorkspace: leaveMutation.mutateAsync,
    terminateMember: terminateMutation.mutateAsync,
    promoteMember: promoteMutation.mutateAsync,
    demoteMember: demoteMutation.mutateAsync,
    isProcessing: 
      leaveMutation.isPending || 
      terminateMutation.isPending || 
      promoteMutation.isPending || 
      demoteMutation.isPending
  };
}