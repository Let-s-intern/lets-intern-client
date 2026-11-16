import { clsx } from 'clsx';

const PRE_QUESTION_MAX_LENGTH = 500;

type FeedbackType = 'LIVE_FEEDBACK' | 'WRITTEN_FEEDBACK' | null;

const LABEL: Record<NonNullable<FeedbackType>, string> = {
  LIVE_FEEDBACK: 'LIVE 피드백 사전 질문',
  WRITTEN_FEEDBACK: '피드백 사전 질문',
};

const PLACEHOLDER: Record<NonNullable<FeedbackType>, string> = {
  LIVE_FEEDBACK: 'LIVE 피드백에서 물어보고 싶은 점을 자유롭게 작성해 주세요.',
  WRITTEN_FEEDBACK: '피드백에서 물어보고 싶은 점을 자유롭게 작성해 주세요.',
};

interface MissionPreQuestionInputSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  feedbackType?: FeedbackType;
}

export const MissionPreQuestionInputSection = ({
  value,
  onChange,
  disabled = false,
  feedbackType = null,
}: MissionPreQuestionInputSectionProps) => {
  const label = feedbackType ? LABEL[feedbackType] : '피드백 사전 질문';
  const placeholder = feedbackType
    ? PLACEHOLDER[feedbackType]
    : '피드백에서 물어보고 싶은 점을 자유롭게 작성해 주세요.';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > PRE_QUESTION_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, PRE_QUESTION_MAX_LENGTH);
    }
    onChange(e);
  };

  return (
    <section>
      <div className="mb-1.5 mt-7">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            {label}
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
        maxLength={PRE_QUESTION_MAX_LENGTH}
      />
      <div className="mt-1 text-right text-xxsmall12 text-neutral-50">
        {value.length}/{PRE_QUESTION_MAX_LENGTH}
      </div>
    </section>
  );
};
