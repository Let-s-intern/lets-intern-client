import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const MoreButton = (props: ButtonProps) => {
  const { className, children, ...newProps } = props;

  return (
    <button
      className={clsx(
        'border-neutral-75 text-neutral-35 flex items-center justify-center gap-1 rounded-sm border bg-neutral-100 px-5 py-2 text-base font-medium leading-[1.625rem]',
        className,
      )}
      {...newProps}
    >
      {children}
    </button>
  );
};

export default MoreButton;
