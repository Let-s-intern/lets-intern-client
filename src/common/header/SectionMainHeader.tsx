import { twMerge } from '@/lib/twMerge';
import { memo, ReactNode } from 'react';

/**
 * @todo report 폴더의 MainHeader 삭제해야 함
 */

function SectionMainHeader({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={twMerge(
        'whitespace-pre-line text-center text-small20 font-bold text-neutral-0 md:text-xlarge30',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export default memo(SectionMainHeader);
