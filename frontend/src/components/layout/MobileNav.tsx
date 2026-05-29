'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Calendar, Bell, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Alerts', href: '/notifications', icon: Bell },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-[#D97706]/10 flex items-center justify-around px-4 z-40 pb-safe shadow-lg">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
        const Icon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 py-1 w-12',
              isActive
                ? 'text-[#D97706] scale-105'
                : 'text-[#A8A29E] hover:text-[#92400E]'
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

