import { clsx } from 'clsx';
import { useState } from 'react';
import MissionSubmitButton from './MissionSubmitButton';
import MissionToast from './MissionToast';

interface MissionSubmitRegularSectionProps {
  className?: string;
  todayTh: number;
}

const MissionSubmitRegularSection = ({
  className,
  todayTh,
}: MissionSubmitRegularSectionProps) => {
  const [textareaValue, setTextareaValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
    } else {
      setIsSubmitted(true);
      setShowToast(true);
    }
  };

  return (
    <section className={clsx('', className)}>
      <h2 className="mb-6 text-small18 font-bold text-neutral-0">
        미션 제출하기
      </h2>
      {/* 링크 */}
      <section>
        <div className="mb-1.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xsmall16 font-semibold text-neutral-0">
              링크
            </span>
          </div>
          <div className="rounded bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
            미션 링크는 <span className="font-bold">.notion.site</span> 형식의
            퍼블릭 링크만 입력 가능합니다. <br />
            제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.
          </div>
        </div>
        <textarea
          className={clsx(
            'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
            'px-3 py-2 text-xsmall16 text-neutral-0 placeholder:text-neutral-50',
            'h-[44px] outline-none focus:border-primary',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
          )}
          placeholder={'링크를 입력해주세요.'}
          value={textareaValue}
          onChange={handleTextareaChange}
          disabled={isSubmitted}
        />
      </section>
      {/* 미션 소감 */}
      <section>
        <div className="mb-1.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xsmall16 font-semibold text-neutral-0">
              미션 소감
            </span>
          </div>
        </div>
        <textarea
          className={clsx(
            'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
            'px-3 py-2 text-xsmall16 text-neutral-0 placeholder:text-neutral-50',
            'min-h-[144px] outline-none focus:border-primary',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
          )}
          placeholder={`오늘의 미션은 어떠셨나요?
새롭게 배운 점, 어려운 부분, 궁금증 등 떠오르는 생각을 남겨 주세요.`}
          value={textareaValue}
          onChange={handleTextareaChange}
          disabled={isSubmitted}
        />
      </section>
      <MissionSubmitButton
        isSubmitted={isSubmitted}
        hasContent={textareaValue.trim().length > 0}
        onButtonClick={handleSubmit}
      />

      <MissionToast isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
};

export default MissionSubmitRegularSection;
