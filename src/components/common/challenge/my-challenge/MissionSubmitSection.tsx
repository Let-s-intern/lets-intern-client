import { clsx } from 'clsx';
import { useState } from 'react';
import MissionSubmitButton from './MissionSubmitButton';

const MissionSubmitSection = () => {
  const [textareaValue, setTextareaValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  return (
    <section>
      <h2 className="mb-4 text-small18 font-bold text-neutral-0">
        미션 제출하기
      </h2>
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            챌린지 참여 목표
          </span>
        </div>
        <div className="rounded bg-neutral-95 px-4 py-3 text-xsmall14 text-neutral-10">
          미션 제출 후, 작성한 챌린지 목표를 카카오톡 오픈채팅방에 공유해주세요.
        </div>
      </div>
      <textarea
        className={clsx(
          'mt-2 w-full resize-none rounded-xxs border border-neutral-80 bg-white',
          'p-4 text-base text-neutral-0 placeholder:text-neutral-50',
          'min-h-[120px] outline-none focus:border-primary',
        )}
        placeholder={
          '챌린지를 신청한 목적과 계기,\n또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요.'
        }
        value={textareaValue}
        onChange={handleTextareaChange}
        disabled={isSubmitted}
      />

      <MissionSubmitButton
        isSubmitted={isSubmitted}
        hasContent={textareaValue.trim().length > 0}
        onButtonClick={() => {
          if (isSubmitted) {
            setIsSubmitted(false);
          } else {
            setIsSubmitted(true);
          }
        }}
      />
    </section>
  );
};

export default MissionSubmitSection;
