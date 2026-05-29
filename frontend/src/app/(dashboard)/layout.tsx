'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { MobileNav } from '../../components/layout/MobileNav';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FFF8E7] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#D97706]" />
        <h2 className="text-[#92400E] font-semibold text-lg animate-pulse">Checking credentials...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // redirecting
  }

  return (
    <div className="flex min-h-screen bg-[#FFF8E7]">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar />
        
        {/* Page content wrapper */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile nav bottom bar */}
      <MobileNav />
    </div>
  );
}

