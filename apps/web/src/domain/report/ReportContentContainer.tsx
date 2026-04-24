import { twMerge } from '@/lib/twMerge';
import React, { forwardRef } from 'react';

interface ReportContentContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ReportContentContainer = forwardRef<
  HTMLDivElement,
  ReportContentContainerProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge('mx-auto mt-24 max-w-3xl px-5', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ReportContentContainer.displayName = 'ReportContentContainer';

export default ReportContentContainer;
