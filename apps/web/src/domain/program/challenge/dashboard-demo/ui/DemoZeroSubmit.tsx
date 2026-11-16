import clsx from 'clsx';
import { useState } from 'react';

/**
 * MissionSubmitZeroSection 의 복사본. 원본은 출석·목표 저장 API 에 묶여 있다.
 * 입력은 해 볼 수 있게 두고, 제출만 막는다.
 */
const DemoZeroSubmit = () => {
  const [goal, setGoal] = useState('');
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const hasContent = goal.trim().length > 0;

  return (
    <section>
      <h2 className="mb-6 text-small18 font-bold text-neutral-0">
        미션 제출하기
      </h2>
      <p className="mb-1.5 text-xsmall16 font-semibold text-neutral-0">
        챌린지 참여 목표
      </p>
      <p className="rounded mb-1.5 bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
        미션 제출 후, 작성한 챌린지 목표를 카카오톡 오픈채팅방에 공유해주세요.
      </p>
      <textarea
        className="min-h-[120px] w-full resize-none rounded-xxs border border-neutral-80 bg-white p-3 text-xsmall14 text-neutral-0 outline-none placeholder:text-neutral-50 focus:border-primary md:text-base"
        placeholder={
          '챌린지를 신청한 목적과 계기,\n또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요.'
        }
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button
        type="button"
        disabled={!hasContent}
        onClick={() => setIsNoticeVisible(true)}
        className={clsx(
          'mt-10 w-full rounded-xs p-4 text-xsmall16 font-medium disabled:cursor-not-allowed',
          hasContent
            ? 'bg-primary text-white'
            : 'bg-neutral-70 text-neutral-100',
        )}
      >
        제출하기
      </button>
      {isNoticeVisible && (
        <p className="mt-3 text-center text-xsmall14 text-neutral-40">
          체험에서는 제출할 수 없어요
        </p>
      )}
    </section>
  );
};

export default DemoZeroSubmit;
