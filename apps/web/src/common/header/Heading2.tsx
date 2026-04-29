import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

function Heading2({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={twMerge(
        'text-small20 text-neutral-0 md:text-xlarge30 whitespace-pre-line font-bold md:text-center',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export default Heading2;
