import { twMerge } from '@/lib/twMerge';
import React, { forwardRef } from 'react';

interface IBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  status: 'success' | 'warning' | 'error' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, IBadgeProps>(
  ({ children, className, status, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={twMerge(
          'inline-flex h-5 items-center justify-center rounded-xs border border-transparent px-2.5 text-xs font-semibold',
          status === 'success' &&
            'border-secondary bg-secondary-10 text-secondary',
          status === 'warning' &&
            'border-[#FC5555] bg-[#FFEBEB] text-[#FC5555]',
          status === 'error' && '',
          status === 'info' && 'border-primary bg-primary-20 text-primary',
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
