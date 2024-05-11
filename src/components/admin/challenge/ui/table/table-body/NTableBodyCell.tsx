import React from 'react';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NTableBodyCell = ({ children, className }: Props) => {
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
