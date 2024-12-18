import { CSSProperties, memo, ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';

function SubHeader({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={twMerge(
        'block text-center text-xsmall16 font-bold md:text-small20',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export default memo(SubHeader);
