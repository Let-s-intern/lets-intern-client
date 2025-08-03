import { clsx } from 'clsx';

interface MissionSubmitButtonProps {
  isSubmitted?: boolean;
  hasContent?: boolean;
  onButtonClick?: () => void;
  className?: string;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  disabled?: boolean;
}

const MissionSubmitButton = ({
  isSubmitted = false,
  hasContent = false,
  onButtonClick,
  className,
  isEditing = false,
  onCancelEdit,
  onSaveEdit,
  disabled = false,
}: MissionSubmitButtonProps) => {
  // 수정 모드일 때 두 개의 버튼 표시
  if (isEditing) {
    return (
      <div className={clsx('mt-10 flex gap-3', className)}>
        {/* 취소하기 버튼 */}
        <button
          className={clsx(
            'flex-1 cursor-pointer rounded-xs border border-neutral-70 bg-white p-4 text-xsmall16 font-medium text-neutral-40 transition-colors',
            'hover:bg-neutral-95',
          )}
          onClick={onCancelEdit}
        >
          취소하기
        </button>
        {/* 저장하기 버튼 */}
        <button
          className={clsx(
            'flex-1 cursor-pointer rounded-xs p-4 text-xsmall16 font-medium transition-colors',
            hasContent && !disabled
              ? 'bg-primary text-white hover:opacity-90'
              : 'cursor-not-allowed bg-neutral-70 text-neutral-100',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          )}
          onClick={onSaveEdit}
          disabled={!hasContent || disabled}
        >
          저장하기
        </button>
      </div>
    );
  }

  // 기본 모드: 단일 버튼
  const buttonText = isSubmitted ? '수정하기' : '제출하기';
  const buttonColor =
    (isSubmitted || hasContent) && !disabled
      ? 'bg-primary text-white'
      : 'bg-neutral-70 text-neutral-100';

  return (
    <div className={clsx('mt-10', className)}>
      <button
        className={clsx(
          'w-full cursor-pointer rounded-xs p-4 text-xsmall16 font-medium transition-colors',
          buttonColor,
          'hover:opacity-90',
        )}
        onClick={onButtonClick}
        disabled={(!hasContent && !isSubmitted) || disabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MissionSubmitButton;
