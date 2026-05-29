'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { getPriorityColor, formatDate } from '../../../lib/utils';
import { ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', 'calendar'],
    queryFn: async () => {
      const res = await api.get('/tasks', { params: { limit: 100 } });
      return res.data.data;
    },
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayIndex = getFirstDayOfMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Map tasks to dates
  const tasksByDate = React.useMemo(() => {
    if (!tasks) return {};
    const mapping: Record<number, any[]> = {};
    
    tasks.forEach((task: any) => {
      if (task.dueDate) {
        const d = new Date(task.dueDate);
        if (d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth()) {
          const dateNum = d.getDate();
          if (!mapping[dateNum]) mapping[dateNum] = [];
          mapping[dateNum].push(task);
        }
      }
    });
    
    return mapping;
  }, [tasks, currentDate]);

  const gridCells = [];
  
  // Empty slots for previous month offset
  for (let i = 0; i < firstDayIndex; i++) {
    gridCells.push(<div key={`empty-${i}`} className="h-28 border border-[#D97706]/8 bg-stone-50/30" />);
  }

  // Actual days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = tasksByDate[day] || [];
    gridCells.push(
      <div key={`day-${day}`} className="h-28 border border-[#D97706]/10 p-2 bg-white hover:bg-[#FFFBF0]/60 transition-colors flex flex-col justify-between">
        <span className="font-extrabold text-xs text-[#92400E] block">{day}</span>
        <div className="flex-1 overflow-y-auto space-y-1.5 mt-1 scrollbar-none">
          {dayTasks.map((t: any) => (
            <div
              key={t._id}
              className="text-[9px] font-bold p-1 rounded border bg-[#FFF3B0]/30 border-[#D97706]/15 text-[#92400E] truncate"
              title={t.title}
            >
              {t.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#92400E]">Calendar View</h2>
          <p className="text-sm text-[#78716C]">Visualize tasks on target due dates.</p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-[#D97706]/12 rounded-lg p-1.5 shadow-warm-sm">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-[#FEF3C7] text-[#78716C]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm text-[#92400E] min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-[#FEF3C7] text-[#78716C]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Card */}
      {isLoading ? (
        <div className="h-[450px] skeleton rounded-xl" />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Weekdays */}
            <div className="grid grid-cols-7 border-b border-[#D97706]/10 text-center font-bold text-xs text-[#78716C] bg-[#FFFBF0]/60 py-3">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {gridCells}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

