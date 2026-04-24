import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

function Description({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={twMerge(
        'whitespace-pre-line text-xsmall14 text-neutral-30 md:text-small20',
        className,
      )}
    >
      {children}
    </p>
  );
}

export default Description;
