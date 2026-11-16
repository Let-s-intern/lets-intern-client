'use client';
interface ButtonProps {
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  color?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button = ({
  to = '',
  type = 'button',
  color,
  className,
  children,
  disabled,
  id,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`rounded-xxs px-4 py-3 font-medium ${
        color === 'white'
          ? 'border border-gray-300 bg-static-100 text-static-0'
          : 'text-static-100'
      } ${disabled ? 'cursor-auto bg-primary-light' : 'bg-primary'}${
        className ? ` ${className}` : ''
      }`}
      onClick={() => {
        if (disabled) return;
        onClick?.();
        if (to) {
          // next react 혼용으로 navigate 사용 불가
          window.location.href = to;
        }
      }}
      {...(id && { id })}
    >
      {children}
    </button>
  );
};

export default Button;
