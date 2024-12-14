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
        'block text-xsmall16 font-bold md:text-center md:text-small20',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export default SuperTitle;
