import React from 'react';
import clsx from 'clsx';

interface LineTableBodyCellProps {
  className?: string;

  children?: React.ReactNode;
}

const LineTableBodyCell = ({ className, children }: LineTableBodyCellProps) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center p-1 text-sm text-zinc-500 break-all',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default LineTableBodyCell;
