import { ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';

function CircularBox({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#4DCDFF] text-small20 font-bold text-static-100',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default CircularBox;
