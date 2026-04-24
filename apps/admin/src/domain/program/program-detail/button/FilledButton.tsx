import { twMerge } from '@/lib/twMerge';

interface FilledButtonProps {
  caption: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

const FilledButton = ({
  caption,
  onClick,
  disabled,
  className,
}: FilledButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        'w-full rounded-md px-6 py-3 text-small18 font-medium text-neutral-100',
        disabled ? 'bg-neutral-0/50' : 'bg-primary',
        className,
      )}
    >
      {caption}
    </button>
  );
};

export default FilledButton;
