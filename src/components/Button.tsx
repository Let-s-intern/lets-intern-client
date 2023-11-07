interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  color?: string;
  className?: string;
  children: React.ReactNode;
}

const Button = ({
  type = 'button',
  color,
  className,
  children,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`w-full rounded-full py-2 font-semibold ${
        color === 'white'
          ? 'border border-gray-300 bg-white text-black'
          : 'bg-indigo-500 text-white'
      }${className ? ` ${className}` : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
