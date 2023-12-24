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
      id={id}
      type={type}
      className={`rounded px-4 py-3 font-medium${
        color === 'white'
          ? ' border border-gray-300 bg-white text-black'
          : ' text-white'
      }${disabled ? ' cursor-auto bg-tint-2' : ' bg-primary'}${
        className ? ` ${className}` : ''
      }`}
      onClick={() => {
        if (disabled) return;
        onClick && onClick();
        to !== '' && navigate(to);
      }}
    >
      {children}
    </button>
  );
};

export default Button;
