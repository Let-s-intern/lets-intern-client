import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const MoreButton = (props: ButtonProps) => {
  const { className, children, ...newProps } = props;

  return (
    <button
      className={clsx(
        'flex items-center justify-center gap-1 rounded-sm border border-neutral-75 bg-neutral-100 px-5 py-2 text-base font-medium leading-[1.625rem] text-neutral-35',
        className,
      )}
      {...newProps}
    >
      {children}
    </button>
  );
};

export default MoreButton;
