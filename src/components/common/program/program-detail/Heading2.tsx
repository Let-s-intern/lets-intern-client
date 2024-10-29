import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

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
        'whitespace-pre-line text-small20 font-bold lg:text-center lg:text-xlarge28',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export default Heading2;
