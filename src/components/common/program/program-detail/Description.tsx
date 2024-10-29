import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

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
        'whitespace-pre-line text-xsmall14 text-neutral-30 lg:text-small20',
        className,
      )}
    >
      {children}
    </p>
  );
}

export default Description;
