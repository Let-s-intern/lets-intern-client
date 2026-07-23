import { clsx } from 'clsx';

const REVIEW_MAX_LENGTH = 300;

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

  return (
    <section>
      <div className="mb-1.5 mt-7">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xsmall16 text-neutral-0 font-semibold">
            미션 소감
          </span>
        </div>
      </div>
      <textarea
        className={clsx(
          'rounded-xxs border-neutral-80 w-full resize-none border bg-white',
          'text-xsmall14 text-neutral-0 md:text-xsmall16 px-3 py-2 placeholder:text-neutral-50',
          'focus:border-primary min-h-[144px] outline-none',
          'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
        )}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={REVIEW_MAX_LENGTH}
      />
      <div className="text-xxsmall12 mt-1 text-right text-neutral-50">
        {value.length}/{REVIEW_MAX_LENGTH}
      </div>
    </section>
  );
};
