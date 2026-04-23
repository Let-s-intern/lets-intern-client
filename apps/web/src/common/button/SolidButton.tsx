import { twMerge } from '@/lib/twMerge';

interface SolidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const SolidButton = ({
  children,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled = false,
  className,
  ...rest
}: SolidButtonProps) => {
  const baseStyles =
    'flex cursor-pointer items-center justify-center gap-1 rounded-xs font-regular';

  const sizeStyles = {
    xs: 'px-3 py-2 text-sm',
    sm: 'px-3 py-2.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-3 py-3 text-base',
    xl: 'px-3 py-4 text-base',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-primary-10 text-primary hover:bg-primary-15',
  };

  const disabledStyles =
    'cursor-not-allowed bg-neutral-70 text-white pointer-events-none';

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

export default SolidButton;
