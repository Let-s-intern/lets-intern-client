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
        'text-small20 text-neutral-0 md:text-xlarge30 whitespace-pre-line text-center font-bold',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export default memo(SectionMainHeader);
