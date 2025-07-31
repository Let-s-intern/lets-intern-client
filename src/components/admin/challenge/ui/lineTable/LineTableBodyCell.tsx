import clsx from 'clsx';
import React from 'react';

interface LineTableBodyCellProps {
  className?: string;

  children?: React.ReactNode;
}

const LineTableBodyCell = ({ className, children }: LineTableBodyCellProps) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center break-all p-1 text-sm text-zinc-500',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default LineTableBodyCell;
