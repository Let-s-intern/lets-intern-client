import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

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
            'bg-secondary-10 border-secondary text-secondary',
          status === 'warning' && '',
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
