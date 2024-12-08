import { twMerge } from '@/lib/twMerge';
import { memo, ReactNode } from 'react';

interface Heading2Props {
  children?: ReactNode;
  className?: string;
}

function Heading2({ children, className }: Heading2Props) {
  return (
    <h2 className={twMerge('text-medium22 font-bold', className)}>
      {children}
    </h2>
  );
}

export default memo(Heading2);
