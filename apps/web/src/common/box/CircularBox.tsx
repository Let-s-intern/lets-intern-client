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
        'text-small20 text-static-100 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#4DCDFF] font-bold',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default CircularBox;
