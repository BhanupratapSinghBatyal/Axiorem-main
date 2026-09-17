import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Updates or schedules a new tier for the active workspace.
 */
const changeSubscriptionTier = async (workspaceId, targetTier) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/payments/subscriptions/${workspaceId}/change-tier`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ targetTier }),
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to modify subscription plan tier.');
  }

  return res.json();
};

/**
 * Schedules a subscription pause via the backend.
 */
const pauseSubscription = async (workspaceId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/payments/subscriptions/${workspaceId}/pause-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({}),
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to schedule subscription pause.');
  }

  return res.json();
};

/**
 * Resumes a paused or pending subscription modification via the backend.
 */
const resumeSubscription = async (workspaceId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/payments/subscriptions/${workspaceId}/resume-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({}),
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to resume subscription.');
  }

  return res.json();
};

/**
 * Cancels the subscription entirely via the backend API.
 */
const cancelSubscription = async (workspaceId) => {
  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/payments/subscriptions/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ workspaceId }),
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.details || 'Failed to cancel subscription.');
  }

  return res.json();
};

export function useSubscriptionActions() {
  const queryClient = useQueryClient();
  const personalWorkspaceId = useAuthStore((state) => state.user?.personalWorkspaceId);

  const changeTierMutation = useMutation({
    mutationFn: (targetTier) => {
      if (!personalWorkspaceId) throw new Error('No personal workspace ID found.');
      return changeSubscriptionTier(personalWorkspaceId, targetTier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['workspace', 'billing', personalWorkspaceId],
        exact: false,
        refetchType: 'active'
      });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: () => {
      if (!personalWorkspaceId) throw new Error('No personal workspace ID found.');
      return pauseSubscription(personalWorkspaceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['workspace', 'billing', personalWorkspaceId],
        exact: false,
        refetchType: 'active'
      });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: () => {
      if (!personalWorkspaceId) throw new Error('No personal workspace ID found.');
      return resumeSubscription(personalWorkspaceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['workspace', 'billing', personalWorkspaceId],
        exact: false,
        refetchType: 'active'
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => {
      if (!personalWorkspaceId) throw new Error('No personal workspace ID found.');
      return cancelSubscription(personalWorkspaceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['workspace', 'billing', personalWorkspaceId],
        exact: false,
        refetchType: 'active'
      });
    },
  });

  return {
    changeTier: changeTierMutation.mutate,
    isChangingTier: changeTierMutation.isPending,
    changeTierError: changeTierMutation.error,

    pause: pauseMutation.mutate,
    isPausing: pauseMutation.isPending,
    pauseError: pauseMutation.error,
    
    resume: resumeMutation.mutate,
    isResuming: resumeMutation.isPending,
    resumeError: resumeMutation.error,
    
    cancel: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
    cancelError: cancelMutation.error,
  };
}