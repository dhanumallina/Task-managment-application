'use client';

import { Bell, Search, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import Link from 'next/link';

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Fetch unread notification count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await api.get('/notifications/unread-count');
      return res.data.data;
    },
    enabled: !!user,
    refetchInterval: 15000, // refresh every 15s
  });

  const getPageTitle = () => {
    const segment = pathname.split('/')[1] || '';
    if (!segment) return 'Home';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#D97706]/10 bg-white/70 backdrop-blur-md px-6 sticky top-0 z-40">
      {/* Title / Breadcrumbs */}
      <div>
        <h1 className="text-lg font-bold text-[#92400E] leading-tight tracking-tight">
          {getPageTitle()}
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-[#A8A29E] mt-0.5">
          <span className="hover:text-[#D97706] cursor-pointer">Workspace</span>
          <span>/</span>
          <span className="text-[#92400E] font-medium">{getPageTitle()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Mock AI Tip Banner */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FEF3C7] border border-[#D97706]/20 text-xs text-[#92400E] font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>AI suggestion: &quot;Finish pending subtasks today!&quot;</span>
        </div>

        {/* Search */}
        <div className="relative w-48 md:w-64 hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#A8A29E]" />
          <input
            type="text"
            placeholder="Search tasks, categories..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Notifications trigger */}
        <Link href="/notifications" className="relative p-2 rounded-lg text-[#78716C] hover:bg-[#FEF3C7] hover:text-[#92400E] transition-all">
          <Bell className="w-5 h-5" />
          {unreadData && unreadData.count > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white ring-2 ring-white animate-bounce">
              {unreadData.count}
            </span>
          )}
        </Link>

        {/* User avatar display */}
        {user && (
          <Link href="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#D97706]/20 flex items-center justify-center font-bold text-[#D97706] text-xs overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

