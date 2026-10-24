// 선택 회차 작성/조회 폼. 공통2+주차1 질문, 상태별 분기.
'use client';

import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import { useEffect, useState } from 'react';
import {
  useSubmitRetrospective,
  type RetroSubmitItem,
} from '../../api/retrospectives';
import type { PassRetrospectiveRound } from '../../types';
import type { RetroSchedule, RetroStatus } from './retroSchedule';

interface Props {
  applicationId: number;
  round: PassRetrospectiveRound;
  isWrapUp: boolean;
  schedule: RetroSchedule;
  status: RetroStatus;
}

const buildInitial = (round: PassRetrospectiveRound) => {
  const init: Record<number, string> = {};
  round.questions.forEach((q) => {
    init[q.membershipQuestionId] = q.review ?? '';
  });
  return init;
};

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
  applicationId,
  round,
  isWrapUp,
  schedule,
  status,
}: Props) => {
  const { questions } = round;
  const isWritable = round.writable;
  const [answers, setAnswers] = useState<Record<number, string>>(() =>
    buildInitial(round),
  );
  // 회차 변경 시 기존 답변으로 리셋
  useEffect(() => {
    setAnswers(buildInitial(round));
  }, [round.id]);

  const submit = useSubmitRetrospective(applicationId);
  const label = isWrapUp ? '마무리 회고' : `${round.th}회차 회고`;

  if (!isWritable && status === 'UPCOMING') {
    return (
      <Notice icon="/icons/lock-keyhole-neutral.svg">
        현재 작성 불가한 회고입니다.
        {schedule.openAt && (
          <>
            <br />
            {schedule.openAt.format('M월 D일')}부터 작성 가능합니다.
          </>
        )}
      </Notice>
    );
  }
  // 마감/완료 회차는 읽기 전용 조회
  const readOnly = !isWritable;
  const isEdit = status === 'DONE';
  const canSubmit = questions.every(
    (q) => (answers[q.membershipQuestionId] ?? '').trim() !== '',
  );

  const handleSubmit = () => {
    const items: RetroSubmitItem[] = questions
      .filter(
        (q) => (answers[q.membershipQuestionId] ?? '') !== (q.review ?? ''),
      )
      .map((q) => ({
        membershipQuestionId: q.membershipQuestionId,
        membershipOrdinalId: round.id,
        review: (answers[q.membershipQuestionId] ?? '').trim(),
        membershipReviewId: q.membershipReviewId,
      }));
    if (items.length === 0) return;
    submit.mutate(items, {
      onSuccess: () => alert(isEdit ? '수정되었습니다.' : '제출되었습니다.'),
      onError: () => alert('제출에 실패했습니다. 다시 시도해주세요.'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-small18 text-neutral-0 hidden md:block">{label}</h2>
        <div className="bg-neutral-60 hidden h-[18px] w-px md:block" />
        <span className="text-xsmall14 md:text-xsmall16">
          {readOnly ? (
            <span className="text-neutral-40">작성 기간이 마감되었습니다.</span>
          ) : schedule.dueAt ? (
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
          <div key={q.membershipQuestionId} className="flex flex-col gap-1.5">
            <label className="text-xsmall16">
              Q{i + 1}. {q.question} <span className="text-primary">*</span>
            </label>
            <textarea
              value={answers[q.membershipQuestionId] ?? ''}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [q.membershipQuestionId]: e.target.value,
                }))
              }
              placeholder={q.answerGuide}
              disabled={readOnly}
              className="border-neutral-80 text-xsmall16 placeholder:text-neutral-40 disabled:bg-neutral-95 focus:border-primary min-h-[140px] resize-none rounded-md border p-3 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {readOnly ? (
        round.adminFeedback && (
          <div className="bg-primary-5 flex flex-col gap-2 rounded-md p-4">
            <span className="text-xsmall14 text-primary font-semibold">
              운영자 코멘트
            </span>
            <p className="text-xsmall14 md:text-xsmall16 text-neutral-0 whitespace-pre-wrap">
              {round.adminFeedback}
            </p>
          </div>
        )
      ) : (
        <div className="flex gap-3">
          <OutlinedButton
            type="button"
            onClick={() => setAnswers(buildInitial(round))}
            className="text-xsmall14 md:text-xsmall16 flex-1 py-3.5 font-semibold"
          >
            취소하기
          </OutlinedButton>
          <SolidButton
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submit.isPending}
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
