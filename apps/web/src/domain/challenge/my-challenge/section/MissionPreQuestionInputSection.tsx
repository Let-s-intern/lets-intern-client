import { clsx } from 'clsx';

interface MissionPreQuestionInputSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export const MissionPreQuestionInputSection = ({
  value,
  onChange,
  disabled = false,
}: MissionPreQuestionInputSectionProps) => {
  return (
    <section>
      <div className="mb-1.5 mt-7">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xsmall16 text-neutral-0 font-semibold">
            피드백 사전 질문
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
        placeholder={`피드백에서 물어보고 싶은 점을 자유롭게 작성해 주세요.`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </section>
  );
};
