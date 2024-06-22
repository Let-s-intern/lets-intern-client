interface FilledButtonProps {
  caption: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isAlreadyApplied?: boolean;
  className?: string;
}

const FilledButton = ({
  caption,
  onClick,
  isAlreadyApplied,
  className,
}: FilledButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isAlreadyApplied}
      className={`text-1.125-medium w-full rounded-md ${
        isAlreadyApplied ? ' bg-neutral-0/50' : 'bg-primary'
      } px-6 py-3 text-neutral-100 ${className}`}
    >
      {caption}
    </button>
  );
};

export default FilledButton;
