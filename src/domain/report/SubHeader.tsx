import { twMerge } from '@/lib/twMerge';
import { CSSProperties, memo, ReactNode } from 'react';

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
        'block whitespace-pre-line text-center text-xsmall16 font-bold md:text-small20',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export default memo(SubHeader);
