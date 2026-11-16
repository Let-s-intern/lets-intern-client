import { twMerge } from '@/lib/twMerge';
import { CSSProperties, memo, ReactNode } from 'react';

/**
 * @todo report 폴더 SectionHeader 삭제해야 함
 */

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
