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
        'flex min-w-0 items-center justify-center overflow-hidden break-all p-1 text-sm text-zinc-500',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default LineTableBodyCell;
