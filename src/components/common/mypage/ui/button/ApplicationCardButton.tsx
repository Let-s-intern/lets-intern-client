import clsx from 'clsx';

const ApplicationCardButton = ({ className, children, onClick }: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center justify-center gap-1 rounded-sm border-2 border-primary-xlight bg-neutral-100 px-5 py-2 font-semibold text-neutral-35 md:w-auto',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default ApplicationCardButton;
