import { twMerge } from '@/lib/twMerge';
import React from 'react';

const ModalButton = ({
  className,
  children,
  onClick,
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button className={twMerge('flex-1 py-4', className)} onClick={onClick}>
      {children}
    </button>
  );
};

export default ModalButton;
