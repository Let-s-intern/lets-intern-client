interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  color?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Button = ({
  type = 'button',
  color,
  className,
  children,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`rounded px-4 py-3 font-medium ${
        color === 'white'
          ? 'border border-gray-300 bg-white text-black'
          : ' text-white'
      }${disabled ? ' bg-tint-2' : ' bg-primary'}${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
