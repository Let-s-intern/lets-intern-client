import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ children, className }: ButtonProps) => {
  return (
    <button
      className={clsx(
        'text-1-semibold rounded-sm border-2 border-neutral-70 bg-neutral-100 px-5 py-2 text-neutral-40',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
