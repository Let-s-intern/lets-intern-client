import { useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';
import { RxCheckbox } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';

function CheckList({
  children,
  checkboxColor,
  className,
}: {
  children?: ReactNode;
  checkboxColor?: string;
  className?: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <div className={twMerge('flex w-full gap-4 md:items-center', className)}>
      <div>
        <RxCheckbox color={checkboxColor} size={isDesktop ? 36 : 24} />
      </div>
      <div className="flex flex-col md:flex-row md:gap-1">{children}</div>
    </div>
  );
}

export default CheckList;
