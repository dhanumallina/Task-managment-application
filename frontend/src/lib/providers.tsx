'use client';

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useAuthStore } from './store';
import { Loader2 } from 'lucide-react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  const { initializeAuth, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initializeAuth();
    setMounted(true);
  }, [initializeAuth]);

  if (!mounted) {
    return null; // Avoid server/client HTML hydration mismatch
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {isLoading ? (
          <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFF8E7] gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#D97706]" />
            <h2 className="text-[#92400E] font-semibold text-lg animate-pulse">Loading Lumio...</h2>
          </div>
        ) : (
          <>
            {children}
            <Toaster position="top-right" richColors />
          </>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

