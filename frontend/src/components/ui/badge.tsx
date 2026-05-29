import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#D97706] text-white hover:bg-[#B45309]',
        secondary:
          'border-transparent bg-[#FFF3B0] text-[#92400E] hover:bg-[#FEF08A]',
        destructive:
          'border-transparent bg-[#DC2626] text-white hover:bg-[#B91C1C]',
        outline: 'border-[#D97706]/20 text-[#92400E] hover:bg-[#FEF3C7]',
        success: 'border-transparent bg-green-100 text-green-800 border-green-200',
        warning: 'border-transparent bg-amber-100 text-amber-800 border-amber-200',
        info: 'border-transparent bg-sky-100 text-sky-800 border-sky-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

