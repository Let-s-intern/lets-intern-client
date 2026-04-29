import { twMerge } from '@/lib/twMerge';
import { REMINDER_LINK } from '@/utils/programConst';

interface NotiButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const NotiButton = ({ text, className, onClick }: NotiButtonProps) => {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={twMerge(
          'bg-point flex w-full items-center justify-center gap-1 rounded-sm px-6 py-3',
          className,
        )}
      >
        <img className="h-6 w-6" src="/icons/Bell.svg" alt="종 아이콘" />
        <span className="text-xsmall14 text-neutral-0 font-medium">{text}</span>
      </button>
    );
  }

  return (
    <a
      href={REMINDER_LINK}
      target="_blank"
      rel="noreferrer"
      className={twMerge(
        'bg-point flex w-full items-center justify-center gap-1 rounded-sm px-6 py-3',
        className,
      )}
    >
      <img className="h-6 w-6" src="/icons/Bell.svg" alt="종 아이콘" />
      <span className="text-xsmall14 text-neutral-0 font-medium">{text}</span>
    </a>
  );
};

export default NotiButton;
