import { CurationQuestion } from '../types/types';
import MobileQuestionStep from './MobileQuestionStep';

interface QuestionStepProps {
  question: CurationQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const QuestionStep = ({
  question,
  value,
  onChange,
  error,
}: QuestionStepProps) => {
  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden">
        <MobileQuestionStep
          question={question}
          value={value}
          onChange={onChange}
          error={error}
        />
      </div>

      {/* 데스크톱 */}
      <div className="hidden md:block">
        <div className="flex w-full flex-col gap-y-6">
          <div className="flex flex-col gap-y-2 text-center">
            <h3 className="text-medium22 font-bold text-neutral-0">
              {question.title}
            </h3>
            {question.helper && (
              <p className="text-small16 font-medium text-neutral-40">
                {question.helper}
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {question.options.map((option) => {
              const isActive = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={`inline-flex h-28 w-full flex-col items-start justify-center gap-2.5 rounded-xl px-6 py-4 outline outline-1 -outline-offset-1 transition-all ${
                    isActive
                      ? 'bg-white outline-indigo-300'
                      : 'bg-stone-50 outline-stone-300 hover:bg-white hover:outline-indigo-300'
                  }`}
                >
                  <div className="flex flex-col items-start justify-start gap-3 self-stretch">
                    <span className="self-stretch text-left text-lg font-bold leading-6 text-zinc-800">
                      {option.title}
                    </span>
                    {option.description && (
                      <span className="text-left text-base font-semibold leading-6 text-zinc-500">
                        {option.description}
                      </span>
                    )}
                    {option.accent && (
                      <span className="text-left text-sm font-semibold leading-5 text-indigo-500">
                        {option.accent}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {error && (
            <p className="text-xsmall13 font-semibold text-[#FC5555]">
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionStep;
