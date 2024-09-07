import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

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
      className={twMerge('mx-auto mt-24 max-w-5xl px-5', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ReportContentContainer.displayName = 'ReportContentContainer';

export default ReportContentContainer;
