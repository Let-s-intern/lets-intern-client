import React from 'react';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  bold?: boolean;
  onClick?: () => void;
}

const NTableBodyCell = ({ children, className, bold, onClick }: Props) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center py-4 text-sm text-zinc-500',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default NTableBodyCell;
