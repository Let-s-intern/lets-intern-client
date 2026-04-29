import { twMerge } from '@/lib/twMerge';
import { TextareaHTMLAttributes } from 'react';

function OutlinedTextarea({
  className,
  ...restProps
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={twMerge('rounded-sm border p-2', className)}
      {...restProps}
    />
  );
}

export default OutlinedTextarea;
