'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Bell, 
  Settings, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  Flame
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#FFFBF0] border-r border-[#D97706]/10 p-5 gradient-sidebar">
      {/* Product Name & Brand */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#D97706] text-white shadow-warm-md">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <span className="font-bold text-xl text-[#92400E] tracking-tight">Lumio</span>
      </div>

      {/* Profile Overview Card */}
      {user && (
        <div className="mb-6 p-3 bg-white/70 backdrop-blur-md rounded-xl border border-[#D97706]/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#D97706]/20 flex items-center justify-center font-bold text-[#D97706] text-sm overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-[#92400E] truncate">{user.name}</h4>
            <div className="flex items-center gap-1 text-[10px] text-[#A8A29E]">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              <span>7 Day Streak</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-[#D97706] text-white shadow-warm-md hover:bg-[#B45309]'
                  : 'text-[#78716C] hover:bg-[#FEF3C7] hover:text-[#92400E]'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-[#D97706]/10 pt-4 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-[#78716C] hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent font-semibold"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

