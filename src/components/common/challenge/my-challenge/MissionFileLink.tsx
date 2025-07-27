import { clsx } from 'clsx';

interface MissionFileLinkProps {
  title: string;
  fileName: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const MissionFileLink = ({
  title,
  fileName,
  disabled = false,
  className,
  onClick,
}: MissionFileLinkProps) => {
  return (
    <button
      className={clsx('flex cursor-pointer items-center gap-3', className)}
    >
      <h4 className="text-xsmall16 font-medium text-neutral-0">{title}</h4>
      <div
        className="flex items-center gap-1"
        onClick={disabled ? undefined : onClick}
      >
        <img
          src="/icons/file-notext.svg"
          alt="file icon"
          className={clsx('h-5 w-5', disabled && 'opacity-50 brightness-0')}
        />
        <span
          className={clsx(
            'text-xsmall16 font-medium',
            disabled
              ? 'cursor-not-allowed text-neutral-50'
              : 'cursor-pointer text-primary',
          )}
        >
          {fileName}
        </span>
      </div>
    </button>
  );
};

export default MissionFileLink;
