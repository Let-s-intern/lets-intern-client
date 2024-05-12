import React from 'react';
import clsx from 'clsx';

interface NTableBodyCellProps {
  className?: string;

  children?: React.ReactNode;
}

const NTableBodyCell = ({ className, children }: NTableBodyCellProps) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center p-1 text-sm text-zinc-500',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default NTableBodyCell;
