'use client';

import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import { durationLabel } from '../constants';
import type { LiveMentoringDuration } from '@/api/live-mentoring/liveMentoringSchema';

/** 예약 시각과 현재 시각으로 가른 카드 상태. */
export type MentoringCardPhase = 'upcoming' | 'ongoing' | 'ended';

const PHASE_BADGE: Record<
  MentoringCardPhase,
  { label: string; className: string }
> = {
  upcoming: { label: '참여예정', className: 'bg-primary-10 text-primary' },
  ongoing: { label: '참여중', className: 'bg-primary text-white' },
  ended: { label: '참여완료', className: 'bg-neutral-90 text-neutral-40' },
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 진행 기간 표기 (시안 `3-0` 의 "24.04.04 00:00 ~ 00:00").
 *
 * 서버가 60분 신청의 두 슬롯을 이미 한 구간(`reservationStartAt`~`EndAt`)으로
 * 합쳐 주므로 여기서 다시 잇지 않는다.
 */
export const formatReservationPeriod = (
  startAt: string,
  endAt: string,
): string => {
  const [year, month, day] = startAt.slice(0, 10).split('-');
  const weekday =
    WEEKDAYS[new Date(`${startAt.slice(0, 10)}T00:00:00`).getDay()];
  return `${year.slice(2)}.${month}.${day} (${weekday}) ${startAt.slice(11, 16)} ~ ${endAt.slice(11, 16)}`;
};

/** 서버가 질문 수정을 닫는 기준. `LiveMentoringApplicationValidator` 와 같은 값이다. */
const QUESTION_EDIT_DEADLINE_HOURS = 24;

/**
 * 질문 버튼을 보여줄지.
 *
 * 서버는 예약 시작 24시간 전에 수정을 닫는다. 그 뒤로는 버튼을 **감춘다** —
 * 눌러도 못 고치는 버튼을 남겨두면 무엇을 하라는 것인지 알 수 없다.
 *
 * 목록 응답에는 서버가 계산한 `editable` 이 없어 여기서 시각을 비교한다.
 * 같은 파일의 `resolvePhase` 도 예약 시각을 이렇게 다룬다. 보이기 판단에만 쓰고,
 * 실제 저장 가능 여부는 모달이 서버 `editable` 로 다시 판정한다.
 */
export const isQuestionButtonVisible = (
  reservationStartAt: string,
  now: Date,
): boolean => {
  const deadline = new Date(reservationStartAt);
  if (Number.isNaN(deadline.getTime())) return false;
  deadline.setHours(deadline.getHours() - QUESTION_EDIT_DEADLINE_HOURS);

  const nowLocal = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  );
  return nowLocal < deadline;
};

/** 질문 버튼 라벨. 마감 전에만 보이므로 쓰기 문구만 남는다. */
export const questionButtonLabel = (questionWritten: boolean): string =>
  questionWritten ? '멘토링 질문 수정' : '멘토링 질문 작성';

interface MentoringApplicationCardProps {
  application: MyLiveMentoringApplication;
  phase: MentoringCardPhase;
  onQuestionClick: (applicationId: number) => void;
}

/**
 * 마이페이지 신청현황의 라이브 멘토링 카드 (시안 `3-0`).
 *
 * `멘토링 입장` 은 `entryLink` 가 null 이면 비활성으로 둔다. **버튼을 감추지 않는다** —
 * 입장 경로가 아예 없는 상품처럼 보이면 문의가 늘어난다. 링크 발급 구조가 정해지면
 * (PRD 4-8) 서버가 값을 채우고 화면은 그대로 열린다.
 */
const MentoringApplicationCard = ({
  application,
  phase,
  onQuestionClick,
}: MentoringApplicationCardProps) => {
  const badge = PHASE_BADGE[phase];

  return (
    <div className="border-neutral-85 flex flex-col gap-4 rounded-md border p-4 md:flex-row md:gap-5">
      {application.thumbnail ? (
        <img
          src={application.thumbnail}
          alt=""
          aria-hidden="true"
          className="h-[120px] w-full shrink-0 rounded-sm object-cover md:h-[100px] md:w-[160px]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="bg-neutral-90 h-[120px] w-full shrink-0 rounded-sm md:h-[100px] md:w-[160px]"
        />
      )}

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            className={`text-xxsmall12 rounded-sm px-2 py-1 font-semibold ${badge.className}`}
          >
            {badge.label}
          </span>
          <span className="text-xxsmall12 text-neutral-40">1:1 멘토링</span>
          <span className="text-xxsmall12 text-neutral-40">
            진행기간{' '}
            {formatReservationPeriod(
              application.reservationStartAt,
              application.reservationEndAt,
            )}
          </span>

          <div className="flex gap-2 md:ml-auto">
            {isQuestionButtonVisible(
              application.reservationStartAt,
              new Date(),
            ) && (
              <button
                type="button"
                onClick={() => onQuestionClick(application.applicationId)}
                className="border-primary text-primary text-xxsmall12 rounded-sm border px-3 py-2 font-medium"
              >
                {questionButtonLabel(application.questionWritten)}
              </button>
            )}
            {/*
              entryLink 가 null 인 동안은 비활성이다(PRD 4-8). 감추지 않는 이유는
              위 컴포넌트 주석 참고.
            */}
            <button
              type="button"
              disabled={application.entryLink === null}
              onClick={() => {
                if (application.entryLink) {
                  window.open(application.entryLink, '_blank', 'noopener');
                }
              }}
              className="border-neutral-80 text-neutral-20 text-xxsmall12 disabled:border-neutral-85 disabled:text-neutral-60 rounded-sm border px-3 py-2 font-medium disabled:cursor-default"
            >
              멘토링 입장
            </button>
          </div>
        </div>

        <p className="text-xsmall16 text-neutral-0 font-bold">
          {application.productName ?? '1:1 LIVE 멘토링'}
        </p>

        <p className="text-xxsmall12 text-neutral-40 mt-auto">
          구매플랜{' '}
          <span className="text-neutral-20 font-medium">
            {durationLabel(
              application.durationMinutes as LiveMentoringDuration,
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

export default MentoringApplicationCard;
