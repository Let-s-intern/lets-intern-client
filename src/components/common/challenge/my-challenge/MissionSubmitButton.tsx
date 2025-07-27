import { clsx } from 'clsx';

interface MissionSubmitButtonProps {
  isSubmitted?: boolean;
  hasContent?: boolean;
  onButtonClick?: () => void;
  className?: string;
}

const MissionSubmitButton = ({
  isSubmitted = false,
  hasContent = false,
  onButtonClick,
  className,
}: MissionSubmitButtonProps) => {
  const buttonText = isSubmitted ? '수정하기' : '제출하기';

  // 버튼 색상 로직 수정
  const buttonColor = (() => {
    if (isSubmitted) {
      return 'bg-primary text-white';
    }
    if (hasContent) {
      return 'bg-primary text-white';
    }
    return 'bg-neutral-70 text-neutral-100';
  })();

  return (
    <div className={clsx('mt-10', className)}>
      <button
        className={clsx(
          'w-full cursor-pointer rounded-xs px-4 py-3 text-xsmall16 transition-colors',
          buttonColor,
          'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        )}
        onClick={onButtonClick}
        disabled={!hasContent && !isSubmitted}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MissionSubmitButton;
