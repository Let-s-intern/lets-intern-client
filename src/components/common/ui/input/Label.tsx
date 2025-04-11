import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  required?: boolean;
}

function Label({
  children,
  required = false,
  className,
  ...restProps
}: Props & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...restProps}
      className={twMerge(
        required ? 'required-star' : '',
        'text-xsmall14 font-semibold text-neutral-0/90',
        className,
      )}
    >
      {children}
    </label>
  );
}

export default Label;
