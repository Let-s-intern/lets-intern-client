'use client';

import { memo } from 'react';

import { twMerge } from '@/lib/twMerge';

export const CallOut = memo(function Callout({
  header,
  body,
  className,
}: {
  header?: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={twMerge('rounded-md bg-neutral-100 px-6 py-6', className)}>
      <span className="text-xsmall16 text-primary -ml-1 font-semibold">
        {header}
      </span>
      <p className="text-xsmall14 text-neutral-20 mt-1">{body}</p>
    </div>
  );
});
