import { memo, ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';

function MainHeader({
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

export default memo(MainHeader);
