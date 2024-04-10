import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <button
      type={type}
      className={`rounded-xxs px-4 py-3 font-medium${
        color === 'white'
          ? ' bg-static-100 text-static-0 border border-gray-300'
          : ' text-static-100'
      }${disabled ? ' bg-primary-light cursor-auto' : ' bg-primary'}${
        className ? ` ${className}` : ''
      }`}
      onClick={() => {
        if (disabled) return;
        onClick && onClick();
        to !== '' && navigate(to);
      }}
      {...(id && { id })}
    >
      {children}
    </button>
  );
};

export default Button;
