import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

function Box({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex items-center rounded-md bg-[#EEFAFF] p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Box;
