import clsx from 'clsx';

interface NotiButtonProps {
  caption: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const NotiButton = ({ caption, onClick, className }: NotiButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center justify-center gap-1 rounded-md border border-neutral-0 bg-point px-6 py-3',
        className,
      )}
    >
      <img className="h-8 w-8" src="/icons/Bell.svg" alt="종 아이콘" />
      <span className="text-1.125-medium text-neutral-0">{caption}</span>
    </button>
  );
};

export default NotiButton;
