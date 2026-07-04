import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

function Box({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex min-h-60 flex-col gap-2.5 rounded-md bg-neutral-100 p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Box;
