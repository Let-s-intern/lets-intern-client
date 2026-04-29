import clsx from 'clsx';

const ApplicationCardButton = ({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'border-primary-xlight text-neutral-35 flex w-full items-center justify-center gap-1 rounded-sm border-2 bg-neutral-100 px-5 py-2 font-semibold md:w-auto',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default ApplicationCardButton;
