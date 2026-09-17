// hooks/useVerifyInvitation.js
import { useQuery } from '@tanstack/react-query';

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

export function useVerifyInvitation(token) {
  return useQuery({
    queryKey: ['invitation-verify', token],
    queryFn: async () => {
      if (!token) throw new Error("Token string absent.");

      // Hits the newly mounted public path segment
      const res = await fetch(`${BACKEND_BASE_URL}/api/v1/users/invitations/verify?token=${token}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Validation sequence rejected by target host.');
      }
      return data.payload;
    },
    enabled: !!token,
    retry: false
  });
}