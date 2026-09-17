"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data remains fresh for 1 minute before considered stale
            staleTime: 60 * 1000, 
            // Data is entirely wiped from memory 5 minutes after going unused
            gcTime: 5 * 60 * 1000, 
            // Disables automatic refetching when the window regains focus
            refetchOnWindowFocus: false, 
            // Prevents UI loops by avoiding continuous retries on broken endpoints
            retry: 1, 
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}