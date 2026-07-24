import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paw-green disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'btn-primary text-white px-5 py-2.5',
        orange: 'btn-orange text-white px-5 py-2.5',
        outline:
          'border-2 border-paw-green text-paw-green bg-white hover:bg-paw-green hover:text-white px-5 py-2.5',
        ghost: 'hover:bg-gray-100 text-paw-charcoal px-3 py-2',
        secondary: 'bg-paw-beige text-paw-charcoal hover:bg-orange-100 px-5 py-2.5',
        destructive: 'bg-red-500 text-white hover:bg-red-600 px-5 py-2.5 rounded-xl',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = 'Button';

export { buttonVariants };
