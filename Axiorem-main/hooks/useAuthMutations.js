import { useMutation } from '@tanstack/react-query';
import { checkIdentityRequest, registerUserRequest } from '../app/services/authService';
import { useAuthStore } from '../store/useAuthStore'; 

export const useAuthMutations = () => {
  // Extract setSession to map payload targets to the persistent state architecture
  const setSession = useAuthStore((state) => state.setSession);

  // Hook 1: Handle checking identity during initial load/login
  const checkIdentityMutation = useMutation({
    mutationFn: checkIdentityRequest,
    onSuccess: (data) => {
      if (data.isExistingUser && data.payload) {
        // Pass the structural payload wrapper block directly into setSession
        setSession(data.payload);
      }
    },
  });

  // Hook 2: Handle full onboarding setup pipeline completion
  const registerUserMutation = useMutation({
    mutationFn: registerUserRequest,
    onSuccess: (data) => {
      // FIXED: Aligns data mapping to pass the nested payload object matching store parsing schema
      if (data && data.payload) {
        setSession(data.payload);
      }
    },
  });

  return {
    checkIdentity: checkIdentityMutation,
    registerUser: registerUserMutation,
  };
};