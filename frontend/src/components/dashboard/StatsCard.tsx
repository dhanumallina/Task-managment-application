import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden relative', className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#A8A29E] tracking-wider uppercase">{title}</p>
            <h3 className="text-3xl font-extrabold text-[#92400E] tracking-tight">{value}</h3>
          </div>
          
          <div className={cn(
            'p-2.5 rounded-lg bg-[#FEF3C7] border border-[#D97706]/10 text-[#D97706]',
            iconClassName
          )}>
            <Icon className="w-5 h-5 shrink-0" />
          </div>
        </div>

        {/* Footnotes / Trends */}
        {(trend || description) && (
          <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-[#D97706]/8 text-xs">
            {trend && (
              <span className={cn(
                'font-bold',
                trend.type === 'positive' && 'text-green-600',
                trend.type === 'negative' && 'text-red-500',
                trend.type === 'neutral' && 'text-[#A8A29E]'
              )}>
                {trend.value}
              </span>
            )}
            {description && <span className="text-[#78716C]">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

