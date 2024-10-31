import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

function OutlinedBox({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex items-center rounded-md border border-[#39C7FF] bg-[#EEFAFF] p-4 lg:px-[30px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default OutlinedBox;
