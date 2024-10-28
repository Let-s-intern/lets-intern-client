import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

function OutlinedBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex items-center rounded-md border border-[#39C7FF] bg-[#EEFAFF] py-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default OutlinedBox;
