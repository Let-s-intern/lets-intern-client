import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button = (props: ButtonProps) => {
  const { className, children, ...newProps } = props;

  return (
    <button
      className={clsx(
        'border-primary text-primary-dark flex items-center justify-center gap-1 rounded-sm border-2 bg-neutral-100 px-5 py-2 font-semibold',
        className,
      )}
      {...newProps}
    >
      {children}
    </button>
  );
};

export default Button;
