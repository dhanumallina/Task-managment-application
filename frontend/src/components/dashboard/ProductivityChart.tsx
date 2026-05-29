'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Sparkles } from 'lucide-react';

interface ChartPoint {
  _id: string; // date string YYYY-MM-DD
  created: number;
  completed: number;
}

interface ProductivityChartProps {
  data: ChartPoint[];
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  // Format data points for graph representation
  const chartData = data.map((d) => {
    const formattedDate = new Date(d._id).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return {
      date: formattedDate,
      Created: d.created,
      Completed: d.completed,
    };
  });

  const placeholderData = [
    { date: 'Mon', Created: 2, Completed: 1 },
    { date: 'Tue', Created: 4, Completed: 3 },
    { date: 'Wed', Created: 3, Completed: 2 },
    { date: 'Thu', Created: 6, Completed: 4 },
    { date: 'Fri', Created: 5, Completed: 5 },
    { date: 'Sat', Created: 2, Completed: 2 },
    { date: 'Sun', Created: 1, Completed: 1 },
  ];

  const activeData = chartData.length > 0 ? chartData : placeholderData;

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Productivity Insights</CardTitle>
          <CardDescription>Visual analysis of tasks created vs. completed</CardDescription>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-[#FEF3C7] border border-[#D97706]/10 px-2 py-1 rounded-md text-[#92400E] font-bold">
          <Sparkles className="w-3 h-3 text-[#F59E0B]" />
          <span>Real-time Sync</span>
        </div>
      </CardHeader>
      
      <CardContent className="h-80 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '11px', fill: '#A8A29E', fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              style={{ fontSize: '11px', fill: '#A8A29E', fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(217,119,6,0.12)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#1C1917',
              }}
            />
            <Area
              type="monotone"
              dataKey="Created"
              stroke="#F59E0B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCreated)"
            />
            <Area
              type="monotone"
              dataKey="Completed"
              stroke="#16A34A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCompleted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

