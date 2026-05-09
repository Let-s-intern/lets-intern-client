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
        'text-xsmall16 md:text-small20 block whitespace-pre-line text-center font-bold',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export default memo(SubHeader);
