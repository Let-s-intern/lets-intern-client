import { ButtonHTMLAttributes, memo, MouseEventHandler } from 'react';

import { twMerge } from '@/lib/twMerge';

const DEFAULT_STYLE =
  'flex justify-center rounded-md border-2 border-primary items-center p-3 text-xsmall16 font-medium transition disabled:border-neutral-70 disabled:bg-neutral-70';

const BUTTON_VARIANT_STYLE = {
  filled: 'bg-primary text-neutral-100 hover:bg-primary-light',
  outlined: 'bg-neutral-100 text-primary-dark hover:border-primary-light',
  point: 'bg-point text-neutral-20 border-none',
};

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANT_STYLE;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function BaseButton({
  variant = 'filled',
  className,
  children,
  onClick,
  ...props
}: BaseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        DEFAULT_STYLE,
        BUTTON_VARIANT_STYLE[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default memo(BaseButton);
