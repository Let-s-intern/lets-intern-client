import { clsx } from 'clsx';
import {
  REVIEW_MAX_LENGTH,
  REVIEW_MIN_LENGTH,
} from '../constants/missionReview';

interface MissionReviewSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MissionReviewInputSection = ({
  value,
  onChange,
  disabled = false,
  placeholder = `오늘의 미션은 어떠셨나요?
새롭게 배운 점, 어려운 부분, 궁금증 등 떠오르는 생각을 남겨 주세요.`,
}: MissionReviewSectionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > REVIEW_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, REVIEW_MAX_LENGTH);
    }
    onChange(e);
  };

  const isShort = value.length > 0 && value.length < REVIEW_MIN_LENGTH;

  return (
    <section>
      <div className="mb-1.5 mt-7">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            미션 소감
          </span>
        </div>
      </div>
      <textarea
        className={clsx(
          'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
          'px-3 py-2 text-xsmall14 text-neutral-0 placeholder:text-neutral-50 md:text-xsmall16',
          'min-h-[144px] outline-none focus:border-primary',
          'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
        )}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={REVIEW_MAX_LENGTH}
      />
      <div className="mt-1 flex items-start justify-between gap-2 text-xxsmall12">
        <p className={isShort ? 'text-system-error' : 'text-neutral-50'}>
          공백 포함 {REVIEW_MIN_LENGTH}자 이상 {REVIEW_MAX_LENGTH}자 이하로
          작성해 주세요
        </p>
        <span
          className={clsx(
            'shrink-0',
            isShort ? 'text-system-error' : 'text-neutral-50',
          )}
        >
          {value.length}/{REVIEW_MAX_LENGTH}
        </span>
      </div>
    </section>
  );
};
