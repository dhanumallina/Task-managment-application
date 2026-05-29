import { cn } from '../../lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#FFF3B0]/40 skeleton', className)}
      {...props}
    />
  );
}

export { Skeleton };

