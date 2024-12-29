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
        'whitespace-pre-line text-small20 font-bold text-neutral-0 md:text-center md:text-xlarge30',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export default Heading2;
