import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

const Box = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'bg-neutral-95 flex flex-col items-stretch rounded-sm px-4 py-7 md:flex-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Box;
