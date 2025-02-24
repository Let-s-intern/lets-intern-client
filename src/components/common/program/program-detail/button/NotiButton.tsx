import { twMerge } from '@/lib/twMerge';
import { REMINDER_LINK } from '@/utils/programConst';

interface NotiButtonProps {
  text: string;
  className?: string;
}

const NotiButton = ({ text, className }: NotiButtonProps) => {
  return (
    <a
      href={REMINDER_LINK}
      target="_blank"
      rel="noreferrer"
      className={twMerge(
        'flex w-full items-center justify-center gap-1 rounded-sm border border-neutral-0 bg-point px-6 py-3',
        className,
      )}
    >
      <img className="h-8 w-8" src="/icons/Bell.svg" alt="종 아이콘" />
      <span className="text-1.125-medium text-neutral-0">{text}</span>
    </a>
  );
};

export default NotiButton;
