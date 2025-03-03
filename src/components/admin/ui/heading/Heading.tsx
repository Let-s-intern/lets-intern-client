import { twMerge } from '@/lib/twMerge';
import React from 'react';

const Heading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <h1 className={twMerge('text-2xl font-bold', className)}>{children}</h1>
  );
};

export default Heading;
