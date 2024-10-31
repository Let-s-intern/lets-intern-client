import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

function SuperTitle({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        'block text-xsmall14 font-semibold md:text-center md:text-small20',
        className,
      )}
    >
      {children}
    </span>
  );
}

export default SuperTitle;
