import { CSSProperties, ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';

function Box({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={twMerge(
        'flex items-center rounded-md bg-[#EEFAFF] p-4',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export default Box;
