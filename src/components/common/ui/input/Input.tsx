import { twMerge } from '@/lib/twMerge';
import { memo } from 'react';

const Input = ({
  className,
  readOnly,
  ...newProps
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type="text"
      className={twMerge(
        `min-w-0 rounded-md bg-neutral-95 p-3 text-xsmall14 outline-none disabled:opacity-100`,
        readOnly ? 'text-neutral-50' : '',
        className,
      )}
      autoComplete="off"
      {...newProps}
    />
  );
};

export default memo(Input);
