import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  className?: string;
}

function MainTitle({ children, className }: Props) {
  return (
    <h2
      className={twMerge(
        'text-center text-medium22 font-bold text-neutral-0 md:text-xlarge30',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export default MainTitle;
