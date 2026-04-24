import { twMerge } from '@/lib/twMerge';
import { memo } from 'react';

const Heading2 = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={twMerge('text-xsmall16 font-semibold', className)}>
      {children}
    </h2>
  );
};

export default memo(Heading2);
