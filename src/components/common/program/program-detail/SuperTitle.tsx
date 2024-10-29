import { ReactNode } from 'react';
import { twJoin } from 'tailwind-merge';

function SuperTitle({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={twJoin(
        'block text-xsmall14 font-semibold lg:text-center lg:text-small20',
        className,
      )}
    >
      {children}
    </span>
  );
}

export default SuperTitle;
