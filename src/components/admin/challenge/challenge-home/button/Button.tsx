import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ children, className }: Props) => {
  return (
    <button
      className={clsx(
        'rounded border border-zinc-600 px-4 py-[2px] text-xs',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
