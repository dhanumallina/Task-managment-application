'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { BarChart2, CheckCircle2, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: async () => {
      const res = await api.get('/users/stats');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-80 rounded-xl skeleton" />
        ))}
      </div>
    );
  }

  const byPriority = stats?.byPriority || { low: 0, medium: 0, high: 0, urgent: 0 };
  const byStatus = stats?.byStatus || { pending: 0, 'in-progress': 0, completed: 0, archived: 0 };

  // Data for charts
  const priorityData = [
    { name: 'Low', count: byPriority.low, fill: '#16A34A' },
    { name: 'Medium', count: byPriority.medium, fill: '#FBBF24' },
    { name: 'High', count: byPriority.high, fill: '#F59E0B' },
    { name: 'Urgent', count: byPriority.urgent, fill: '#DC2626' },
  ];

  const statusData = [
    { name: 'Pending', value: byStatus.pending, color: '#FEF3C7' },
    { name: 'In Progress', value: byStatus['in-progress'], color: '#E0F2FE' },
    { name: 'Completed', value: byStatus.completed, color: '#DCFCE7' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#92400E]">Insights & Analytics</h2>
        <p className="text-sm text-[#78716C]">Granular metrics tracking overall work performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Spread Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority Spread</CardTitle>
            <CardDescription>Number of tasks sorted by importance levels.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#A8A29E' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#A8A29E' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(217,119,6,0.12)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Allocation</CardTitle>
            <CardDescription>Division of workflow states across active actions.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} stroke="#D97706" strokeWidth={1} strokeOpacity={0.15} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="space-y-2">
                {statusData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-[#D97706]/15" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-bold text-[#92400E]">{d.name}</span>
                    <span className="text-xs text-[#78716C] font-semibold">({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

