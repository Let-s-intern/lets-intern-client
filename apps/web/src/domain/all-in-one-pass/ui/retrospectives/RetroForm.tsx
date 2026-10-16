// 선택 회차 작성폼. 공통질문 2 + 주차질문 1. 가이드=placeholder. 상태별(예정/작성가능/완료/마감) 분기.
'use client';

import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import { useState } from 'react';
import { COMMON_QUESTIONS } from '../../mock/retrospectiveFixtures';
import type { PassRetrospectiveRound } from '../../types';
import type { RetroSchedule, RetroStatus } from './retroSchedule';

interface Props {
  round: PassRetrospectiveRound;
  isWrapUp: boolean;
  schedule: RetroSchedule;
  status: RetroStatus;
  /** 작성 가능 기간 내 여부. true면 제출했어도 마감 전까지 수정 가능(챌린지 미션과 동일). */
  isWritable: boolean;
}

const Notice = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: string;
}) => (
  <div className="bg-neutral-95 flex flex-col items-center justify-center gap-2 rounded-md py-40 text-center md:py-52">
    {icon && <img src={icon} alt="" className="h-8 w-8" />}
    <p className="text-xsmall14 md:text-xsmall16 text-neutral-40">{children}</p>
  </div>
);

const RetroForm = ({
  round,
  isWrapUp,
  schedule,
  status,
  isWritable,
}: Props) => {
  const questions = [...COMMON_QUESTIONS, round.weeklyQuestion];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const label = isWrapUp ? '마무리 회고' : `${round.th}회차 회고`;

  // 작성 기간 밖: 미제출이면 예정/마감 안내, 제출했으면(아래로) 읽기 전용 폼
  if (!isWritable && status === 'UPCOMING') {
    return (
      <Notice icon="/icons/lock-keyhole-neutral.svg">
        아직 작성할 수 없는 회고예요.
        <br />
        {schedule.openAt.format('M월 D일')}부터 작성할 수 있어요.
      </Notice>
    );
  }
  if (!isWritable && status === 'CLOSED') {
    return <Notice>작성 기간이 마감된 회고예요.</Notice>;
  }

  const readOnly = !isWritable; // 제출했고 마감 지남 → 읽기 전용
  const isEdit = status === 'DONE'; // 이미 제출 → 수정하기
  const canSubmit = questions.every((q) => (answers[q.id] ?? '').trim() !== '');

  const handleSubmit = () => {
    // TODO(BE): 회고 제출 — 사용자·회차·질문 단위 저장. 저장 뮤테이션 전까지 미동작.
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-small18 text-neutral-0 hidden md:block">{label}</h2>
        <div className="bg-neutral-60 hidden h-[18px] w-px md:block" />
        <span className="text-xsmall14 md:text-xsmall16">
          {schedule.dueAt ? (
            <>
              <span className="text-neutral-0">마감기한 </span>
              <span className="text-primary">
                {schedule.dueAt.format('MM.DD HH:mm')}까지
              </span>
            </>
          ) : (
            <span className="text-primary">상시 작성 가능</span>
          )}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {questions.map((q, i) => (
          <div key={q.id} className="flex flex-col gap-1.5">
            <label className="text-xsmall16">
              Q{i + 1}. {q.question} <span className="text-primary">*</span>
            </label>
            <textarea
              value={answers[q.id] ?? ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              placeholder={q.answerGuide}
              disabled={readOnly}
              className="border-neutral-80 text-xsmall16 placeholder:text-neutral-40 disabled:bg-neutral-95 focus:border-primary min-h-[140px] resize-none rounded-md border p-3 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="flex gap-3">
          <OutlinedButton
            type="button"
            onClick={() => setAnswers({})}
            className="text-xsmall14 md:text-xsmall16 flex-1 py-3.5 font-semibold"
          >
            취소하기
          </OutlinedButton>
          <SolidButton
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="text-xsmall14 md:text-xsmall16 flex-1 py-3.5 font-semibold"
          >
            {isEdit ? '수정하기' : '제출하기'}
          </SolidButton>
        </div>
      )}
    </div>
  );
};

export default RetroForm;
