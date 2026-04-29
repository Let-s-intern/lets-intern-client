import { twMerge } from '@/lib/twMerge';
import { CSSProperties, ReactNode } from 'react';

function SuperTitle({
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
        'text-xsmall14 md:text-small20 block font-semibold md:text-center',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export default SuperTitle;
