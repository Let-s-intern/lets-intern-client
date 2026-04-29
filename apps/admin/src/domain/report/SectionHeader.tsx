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
        'text-xsmall14 text-neutral-45 md:text-small18 block text-center font-semibold',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export default memo(SectionHeader);
