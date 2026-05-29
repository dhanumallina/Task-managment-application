'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { useAuthStore } from '../../../lib/store';
import { StatsCard } from '../../../components/dashboard/StatsCard';
import { ProductivityChart } from '../../../components/dashboard/ProductivityChart';
import { ActivityFeed } from '../../../components/dashboard/ActivityFeed';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { getPriorityColor, getStatusColor, formatDate } from '../../../lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  ArrowRight,
  Flame,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../../../components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Fetch aggregate stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await api.get('/users/stats');
      return res.data.data;
    },
  });

  // Fetch full dashboard details
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard', 'data'],
    queryFn: async () => {
      const res = await api.get('/users/dashboard');
      return res.data.data;
    },
  });

  const isLoading = statsLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="h-28 w-full rounded-xl skeleton" />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl skeleton" />
          ))}
        </div>

        {/* Analytics Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 h-80 rounded-xl skeleton" />
          <div className="col-span-1 h-80 rounded-xl skeleton" />
        </div>
      </div>
    );
  }

  const recentTasks = dashboard?.recentTasks || [];
  const upcomingDeadlines = dashboard?.upcomingDeadlines || [];
  const weeklyData = dashboard?.weeklyData || [];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Personalized Welcome Panel */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FEF3C7] via-[#FFF3B0] to-[#FFF8E7] p-6 border border-[#D97706]/15 shadow-warm-sm">
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#92400E]">
              Good day, {user?.name.split(' ')[0] ?? 'Explorer'}! 👋
            </h2>
            <p className="text-sm text-[#78716C] mt-1 max-w-xl">
              You are on a <span className="font-bold text-[#D97706]">{stats?.streak ?? 7}-day streak</span>. Your productivity score is <span className="font-bold text-[#D97706]">{stats?.productivityScore ?? 84}%</span>. Let&apos;s check what tasks need focus today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/tasks?create=true"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D97706] text-white hover:bg-[#B45309] shadow-warm-sm font-semibold transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              New Task
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats?.total ?? 0}
          description="Tasks captured in workspace"
          icon={Clock}
          trend={{ value: '+4 this week', type: 'positive' }}
        />
        <StatsCard
          title="Completed"
          value={stats?.completed ?? 0}
          description="Successfully completed tasks"
          icon={CheckCircle2}
          trend={{ value: `${stats?.completionRate ?? 0}% rate`, type: 'positive' }}
          iconClassName="bg-green-50 text-green-600 border border-green-200"
        />
        <StatsCard
          title="In Progress"
          value={stats?.inProgress ?? 0}
          description="Tasks currently being resolved"
          icon={Zap}
          trend={{ value: 'Active now', type: 'neutral' }}
          iconClassName="bg-sky-50 text-sky-600 border border-sky-200"
        />
        <StatsCard
          title="Overdue"
          value={stats?.overdue ?? 0}
          description="Tasks past target completion date"
          icon={AlertTriangle}
          trend={{ value: 'Requires focus', type: 'negative' }}
          iconClassName="bg-red-50 text-red-600 border border-red-200"
        />
      </div>

      {/* Analytics Charts & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart */}
        <ProductivityChart data={weeklyData} />

        {/* Mock Activity Logs / Streaks */}
        <ActivityFeed logs={
          recentTasks.map((t: any) => ({
            _id: t._id,
            action: `Updated task "${t.title}"`,
            entityType: 'task',
            createdAt: t.updatedAt,
          }))
        } />
      </div>

      {/* Bottom section: Recent Tasks and Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-[#92400E]">Recent Tasks</CardTitle>
            <Link href="/tasks" className="text-xs text-[#D97706] hover:underline flex items-center gap-1">
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-[#D97706]/10">
            {recentTasks.length === 0 ? (
              <p className="text-sm text-[#A8A29E] text-center py-6">No tasks found. Create your first task!</p>
            ) : (
              recentTasks.slice(0, 4).map((task: any) => (
                <div key={task._id} className="py-3.5 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1C1917] truncate">{task.title}</p>
                    <span className="text-[10px] text-[#A8A29E] font-semibold">{task.category || 'General'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#92400E]">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-[#D97706]/10">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-[#A8A29E] text-center py-6">No deadlines approaching in the next 7 days.</p>
            ) : (
              upcomingDeadlines.map((task: any) => (
                <div key={task._id} className="py-3.5 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1C1917] truncate">{task.title}</p>
                    <p className="text-[10px] text-red-500 font-bold">
                      Due: {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

