import { ReactNode } from 'react';

interface BadgeProps {
  children?: ReactNode;
}

function Badge({ children }: BadgeProps) {
  return (
    <div className="gap-1.6 flex w-fit items-center gap-1 rounded-xxs bg-[#FFF7EF] px-2.5 py-1 text-small18 font-bold text-[#FB8100] md:text-xlarge28">
      {children}
    </div>
  );
}

export default Badge;
