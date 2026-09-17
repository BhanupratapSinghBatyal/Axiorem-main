import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Initiates a payment method update session via Dodo Payments.
 * Retrieves workspace ID from AuthStore automatically.
 */
const updatePaymentMethod = async () => {
  // Retrieve workspaceId from the store inside the function to ensure current state
  const state = useAuthStore.getState();
  const workspaceId = state.user?.personalWorkspaceId;

  if (!workspaceId) {
    throw new Error('No personal workspace ID found. User may not be authenticated.');
  }

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/payments/subscriptions/${workspaceId}/update-payment-method`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // No body needed as returnUrl is handled by the backend environment variable
    body: JSON.stringify({}), 
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to initialize payment method update.');
  }

  return res.json();
};

export function usePaymentMethodMutation() {
  return useMutation({
    mutationFn: updatePaymentMethod,
    onSuccess: (data) => {
      // The backend returns a paymentLink which the component should use to redirect the user
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      }
    },
  });
}