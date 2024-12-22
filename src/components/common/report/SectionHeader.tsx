import { CSSProperties, memo, ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';

function SectionHeader({
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
        'block text-center text-xsmall14 font-semibold text-neutral-45 md:text-small18',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export default memo(SectionHeader);
