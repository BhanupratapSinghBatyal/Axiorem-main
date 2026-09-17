"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#212121]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Placeholder */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Gray Track Container */}
        <div className="w-48 h-1 bg-[#3A3A3A] rounded-full overflow-hidden relative">
          {/* Back-and-forth White Bar */}
          <div className="absolute top-0 bottom-0 w-1/3 bg-white rounded-full animate-indeterminate" />
        </div>
      </div>

      <style jsx>{`
        @keyframes indeterminate {
          0% {
            left: -35%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: -35%;
          }
        }
        .animate-indeterminate {
          animation: indeterminate 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default function SessionHydrator({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isHydrating, setIsHydrating] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  useEffect(() => {
    let isSubscribed = true;

    async function syncSessionIdentity() {
      const isPublicRoute = pathname === '/login' || pathname === '/' || pathname === '/onboarding';

      if (!isAuthenticated) {
        try {
          const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          if (!isSubscribed) return;

          if (res.ok) {
            const data = await res.json();
            setSession(data.payload || data);
            console.log("Session set successfully:", data.payload || data);

            if (isPublicRoute) {
              router.replace('/dashboard');
            }
          } else {
            clearSession();
            console.log("Session cleared due to invalid response");
            if (!isPublicRoute && pathname.startsWith('/dashboard')) {
              router.replace('/onboarding');
            }
          }
        } catch (err) {
          console.error("Critical database identity synchronization failure:", err);
          if (!isSubscribed) return;
          clearSession();
          if (!isPublicRoute && pathname.startsWith('/dashboard')) {
            router.replace('/onboarding');
          }
        }
      } else {
        if (isPublicRoute) {
          router.replace('/dashboard');
        }
      }

      if (isSubscribed) {
        setIsHydrating(false);
      }
    }

    syncSessionIdentity();

    return () => {
      isSubscribed = false;
    };
  }, [pathname, router, backendUrl, setSession, clearSession]);

  console.log("isHydrating:", isHydrating, "isLoading:", isLoading);
  
  if (isHydrating || isLoading) {
    return <LoadingScreen />;
  }

  return children;
}