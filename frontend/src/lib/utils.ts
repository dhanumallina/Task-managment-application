// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '…';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isOverdue(dueDate: string | Date | undefined): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'medium':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'high':
      return 'bg-orange-50 text-orange-700 border-orange-100';
    case 'urgent':
      return 'bg-red-50 text-red-700 border-red-100 animate-pulse';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'todo':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'in-progress':
    case 'in_progress':
      return 'bg-sky-50 text-sky-700 border-sky-100';
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-100';
    case 'archived':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
