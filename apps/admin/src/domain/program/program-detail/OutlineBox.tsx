import { CSSProperties, ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';

function OutlinedBox({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={twMerge(
        'flex items-center rounded-md border border-[#39C7FF] bg-[#EEFAFF] p-4 md:px-[30px]',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export default OutlinedBox;
