import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  className?: string;
  id?: string;
}

export default function BlogHeading2({ children, className, id }: Props) {
  return (
    <h2
      id={id}
      className={twMerge(
        'text-small20 font-semibold text-neutral-0',
        className,
      )}
    >
      {children}
    </h2>
  );
}
