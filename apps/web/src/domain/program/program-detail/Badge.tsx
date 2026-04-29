import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

interface BadgeProps {
  children?: ReactNode;
  className?: string;
}

function Badge({ children, className }: BadgeProps) {
  return (
    <div
      className={twMerge(
        'gap-1.6 rounded-xxs text-small18 md:text-xlarge28 flex w-fit items-center gap-1 bg-[#FFF7EF] px-2.5 py-1 font-bold text-[#FB8100]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Badge;
