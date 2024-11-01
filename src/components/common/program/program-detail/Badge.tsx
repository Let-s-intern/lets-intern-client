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
        'gap-1.6 flex w-fit items-center gap-1 rounded-xxs bg-[#FFF7EF] px-2.5 py-1 text-small18 font-bold text-[#FB8100] md:text-xlarge28',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Badge;
