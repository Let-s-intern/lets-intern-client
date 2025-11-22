import { twMerge } from '@/lib/twMerge';

interface OutlinedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const OutlinedButton = ({
  children,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled = false,
  className,
  ...rest
}: OutlinedButtonProps) => {
  const baseStyles =
    'flex cursor-pointer items-center justify-center gap-1 rounded-xxs font-regular';

  const sizeStyles = {
    xs: 'px-3 py-1.5 text-sm',
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-3 py-3 text-base',
    xl: 'px-3 py-4 text-base',
  };

  const variantStyles = {
    primary: 'border border-primary text-primary hover:bg-neutral-100',
    secondary: 'border border-neutral-80 text-primary hover:bg-neutral-100',
  };

  const disabledStyles =
    'cursor-not-allowed bg-white border-neutral-80 text-neutral-50 pointer-events-none';

  return (
    <button
      {...rest}
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && disabledStyles,
        className,
      )}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
};

export default OutlinedButton;
