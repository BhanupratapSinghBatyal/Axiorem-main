import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore.js';
import { useShallow } from 'zustand/react/shallow';

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');
const FRONTEND_BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');

const dispatchWorkspaceInvitation = async ({ workspaceId, email, role, isReusable }) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/tenant/workspaces/${workspaceId}/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, role, isReusable })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.details || data?.error || 'Failed to initiate workspace membership invitation.');
  }
  return data;
};

const dispatchAcceptInvitation = async (token) => {
  if (!token) throw new Error('Invitation token is required.');

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/users/invitations/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ token })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.details || data?.error || 'Failed to accept workspace invitation.');
  }
  return data;
};

export function useWorkspaceInvitations() {
  const queryClient = useQueryClient();
  const currentWorkspace = useAuthStore(useShallow((state) => state.getCurrentWorkspace()));
  
  const activeWorkspaceId = currentWorkspace?.id || currentWorkspace?.organizationId;
  const workspaceName = currentWorkspace?.name || 'Workspace';

  const inviteMutation = useMutation({
    mutationFn: async ({ email, role = 'MEMBER', isReusable = false }) => {
      if (!activeWorkspaceId) {
        throw new Error('Active workspace identity context could not be resolved.');
      }
      
      const responseBody = await dispatchWorkspaceInvitation({
        workspaceId: activeWorkspaceId,
        email,
        role,
        isReusable
      });

      return responseBody?.payload || responseBody;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'metrics', activeWorkspaceId] });
    }
  });

  const acceptMutation = useMutation({
    mutationFn: dispatchAcceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'pending-invitations'] });
    }
  });

  const deliveryMatrix = inviteMutation.data?.deliveryMatrix;
  const token = deliveryMatrix?.shareableLinkToken || deliveryMatrix?.token;

  // Construct absolute frontend URL targeting the UI verification pipeline
  const generatedInviteUrl = token 
    ? `${FRONTEND_BASE_URL}/invitation/verify?token=${encodeURIComponent(token)}&name=${encodeURIComponent(workspaceName)}`
    : null;

  return {
    sendInvitation: inviteMutation.mutateAsync,
    acceptInvitation: acceptMutation.mutateAsync,
    isProcessing: inviteMutation.isPending || acceptMutation.isPending,
    isAccepting: acceptMutation.isPending,
    error: inviteMutation.error?.message || acceptMutation.error?.message || null,
    isSuccess: inviteMutation.isSuccess,
    data: inviteMutation.data,
    generatedInviteUrl
  };
}