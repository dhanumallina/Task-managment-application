import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] disabled:pointer-events-none disabled:opacity-50 btn-press [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#D97706] text-white shadow-warm-sm hover:bg-[#B45309] hover:shadow-warm-md',
        destructive:
          'bg-[#DC2626] text-white shadow-warm-sm hover:bg-[#B91C1C] hover:shadow-warm-md',
        outline:
          'border border-[#D97706]/20 bg-white/60 text-[#92400E] shadow-warm-sm hover:bg-[#FEF3C7] hover:border-[#D97706]/40',
        secondary:
          'bg-[#FFF3B0] text-[#92400E] shadow-warm-sm hover:bg-[#FEF08A]',
        ghost: 'text-[#92400E] hover:bg-[#FEF3C7] hover:text-[#B45309]',
        link: 'text-[#D97706] underline-offset-4 hover:underline',
        premium: 'bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-amber-glow hover:brightness-105',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

