import React from 'react';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  bold?: boolean;
  onClick?: () => void;
}

const TableBodyCell = ({ children, className, bold, onClick }: Props) => {
  return (
    <div
      className={clsx('flex items-center justify-center py-4', className, {
        'text-base text-zinc-600': bold,
        'text-sm text-zinc-500': !bold,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default TableBodyCell;
