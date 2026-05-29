import { cn, formatDate } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { PlusCircle, CheckCircle, RefreshCw, Star } from 'lucide-react';

interface ActivityLog {
  _id: string;
  action: string;
  entityType: string;
  createdAt: string;
}

interface ActivityFeedProps {
  logs: ActivityLog[];
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  const getIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('create')) return <PlusCircle className="w-4.5 h-4.5 text-amber-600" />;
    if (act.includes('complete') || act.includes('finish')) return <CheckCircle className="w-4.5 h-4.5 text-green-600" />;
    if (act.includes('update')) return <RefreshCw className="w-4.5 h-4.5 text-sky-600" />;
    return <Star className="w-4.5 h-4.5 text-stone-500" />;
  };

  const getBadgeColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('create')) return 'bg-amber-100 border border-amber-200';
    if (act.includes('complete') || act.includes('finish')) return 'bg-green-100 border border-green-200';
    if (act.includes('update')) return 'bg-sky-100 border border-sky-200';
    return 'bg-stone-100 border border-stone-200';
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent actions performed in your workspace</CardDescription>
      </CardHeader>
      
      <CardContent>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-[#A8A29E] font-medium">No recent actions recorded.</p>
          </div>
        ) : (
          <div className="relative border-l border-[#D97706]/10 ml-4 space-y-6">
            {logs.map((log) => (
              <div key={log._id} className="relative pl-6">
                {/* Circular indicator node */}
                <span className={cn(
                  'absolute -left-3.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white',
                  getBadgeColor(log.action)
                )}>
                  {getIcon(log.action)}
                </span>
                
                <div className="space-y-1">
                  <p className="text-sm text-[#1C1917] font-semibold">{log.action}</p>
                  <p className="text-[10px] text-[#A8A29E] font-bold">
                    {formatDate(log.createdAt)} • {log.entityType.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

