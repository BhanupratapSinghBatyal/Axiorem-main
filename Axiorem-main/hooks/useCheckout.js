import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore.js';
import { useShallow } from 'zustand/react/shallow';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Execute Upstream Checkout Session Creation
 * SECURITY: Mandates cookie transmission across subdomains via credentials parameter.
 */
const createCheckoutSession = async ({ tier, quantity, personalWorkspaceId }) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/payments/checkout/retry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ tier, quantity, personalWorkspaceId })
    });

    const data = await res.json();
    
    if (!res.ok) {
      return {
        success: false,
        error: data?.error || 'An error occurred while establishing secure gateway session protocols.'
      };
    }
    
    return data;
  } catch (err) {
    return {
      success: false,
      error: 'Network connectivity or protocol negotiation failure encountered.'
    };
  }
};

export function useCheckout() {
  const currentUser = useAuthStore(useShallow((state) => state.user));
  const queryClient = useQueryClient();

  const checkoutMutation = useMutation({
    mutationFn: async ({ tier, quantity = 1 }) => {
      const personalWorkspaceId = currentUser?.personalWorkspaceId;

      if (!personalWorkspaceId) {
        return { 
          success: false, 
          error: 'Missing identity mapping context. Personal workspace token could not be resolved.' 
        };
      }

      if (!tier) {
        return { success: false, error: 'Subscription target tier designation parameter is required.' };
      }

      return createCheckoutSession({ tier, quantity, personalWorkspaceId });
    },
    onSuccess: (data) => {
      if (data && data.success === false) {
        const personalWorkspaceId = currentUser?.personalWorkspaceId;
        if (personalWorkspaceId) {
          queryClient.invalidateQueries({ queryKey: ['workspace', personalWorkspaceId] });
          queryClient.invalidateQueries({ queryKey: ['organization', personalWorkspaceId] });
        }
        return;
      }

      const target = data?.payload || data || {};
      const { success, checkoutUrl } = target;
      
      if (success && checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    }
  });

  const resolvedErrorMessage = checkoutMutation.data?.success === false 
    ? checkoutMutation.data.error 
    : (checkoutMutation.error?.message || null);

  return {
    executeCheckout: async (variables) => {
      const response = await checkoutMutation.mutateAsync(variables);
      if (response && response.success === false) {
        // Handle the error gracefully by returning the error message
        return { success: false, error: response.error };
      }
      return response;
    },
    isProcessing: checkoutMutation.isPending,
    checkoutError: resolvedErrorMessage
  };
}