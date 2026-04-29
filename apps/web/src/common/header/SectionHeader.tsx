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
