import { useEffect } from 'react';

import { useLiveMentoringReservationDetailQuery } from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringReservationDetail } from '@/api/live-mentoring/liveMentoringSchema';
import BaseModal from '@/common/modal/BaseModal';

import { CATEGORY_LABELS, durationLabel } from '../constants';

interface LiveMentoringSubmissionModalProps {
  /** 열려는 예약의 신청 id. `null` 이면 모달이 닫힌 상태이며 조회도 하지 않는다. */
  applicationId: number | null;
  onClose: () => void;
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const pad2 = (value: number): string => String(value).padStart(2, '0');

/** 예약 일시 한 줄 표기 (예: `2026.08.30 (일) 10:00 ~ 11:00`). */
function formatReservationPeriod(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return '';

  const end = new Date(endAt);
  const date = `${start.getFullYear()}.${pad2(start.getMonth() + 1)}.${pad2(
    start.getDate(),
  )}`;
  const time = (value: Date) =>
    `${pad2(value.getHours())}:${pad2(value.getMinutes())}`;
  const range = Number.isNaN(end.getTime())
    ? time(start)
    : `${time(start)} ~ ${time(end)}`;

  return `${date} (${WEEKDAY_LABELS[start.getDay()]}) ${range}`;
}

/** 질문 최종 수정 시각 표기 (예: `2026.08.29 18:20`). */
function formatUpdatedAt(value: string): string {
  const updatedAt = new Date(value);
  if (Number.isNaN(updatedAt.getTime())) return '';

  return (
    `${updatedAt.getFullYear()}.${pad2(updatedAt.getMonth() + 1)}.` +
    `${pad2(updatedAt.getDate())} ${pad2(updatedAt.getHours())}:${pad2(
      updatedAt.getMinutes(),
    )}`
  );
}

/** 닫기(X) 아이콘. */
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 6L18 18M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 멘티가 미리 적어 낸 질문 본문.
 *
 * 서버는 "나중에 작성하기" 를 고르는 순간 본문을 지운다(`updateQuestion`). 그래도 화면은
 * `questionDeferred` 와 빈 본문을 둘 다 본다 — 어느 쪽이든 빈 영역 대신 안내를 남긴다.
 *
 * `questionUpdatedAt` 은 백엔드가 이번에 내리지 않는다(PRD 4.5, 9-2). 값이 없으면 그 줄을
 * 그리지 않는다. 질문 수정 마감도 여기서 다시 계산하지 않는다 — 서버가 계산하는 값이다.
 */
const QuestionSection = ({
  detail,
}: {
  detail: LiveMentoringReservationDetail;
}) => {
  const hasQuestion =
    !detail.questionDeferred && Boolean(detail.questionContent?.trim());
  const updatedAtLabel = detail.questionUpdatedAt
    ? formatUpdatedAt(detail.questionUpdatedAt)
    : '';

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-bold text-neutral-900">멘티 질문</h3>
        {updatedAtLabel && (
          <p className="text-xs text-neutral-400">최종 수정 {updatedAtLabel}</p>
        )}
      </div>
      <div className="mt-2 rounded-lg bg-gray-50 px-4 py-3">
        {hasQuestion ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-neutral-700">
            {detail.questionContent}
          </p>
        ) : (
          <p className="text-sm leading-6 text-neutral-500">
            아직 질문을 작성하지 않았습니다.
          </p>
        )}
      </div>
    </section>
  );
};

/**
 * 모달 본문. `applicationId` 가 확정된 뒤에만 마운트된다.
 *
 * 조회 훅을 이 안에 두는 이유는 닫힌 상태에서 쿼리가 돌지 않게 하기 위해서다.
 * 훅 자체도 `enabled` 로 한 번 막지만, 컴포넌트를 아예 마운트하지 않으면 캐시 구독과
 * 리렌더까지 함께 사라진다.
 */
const SubmissionModalBody = ({
  applicationId,
  onClose,
}: {
  applicationId: number;
  onClose: () => void;
}) => {
  const { data, isLoading, isError } =
    useLiveMentoringReservationDetailQuery(applicationId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 카테고리는 null 로 올 수 있다 — 기존 행이 유효 코드 밖인 0 이라 서버가 null 을 내린다.
  // 그 자리를 빈 칸으로 남기지 않고 항목 자체를 뺀다.
  const metaLine = data
    ? [
        data.productName,
        data.mentoringCategory ? CATEGORY_LABELS[data.mentoringCategory] : null,
        durationLabel(data.durationMinutes),
      ]
        .filter((part): part is string => Boolean(part))
        .join(' · ')
    : '';

  return (
    <BaseModal isOpen onClose={onClose} className="mx-4 w-full max-w-3xl">
      <div className="flex max-h-[85vh] flex-col overflow-y-auto">
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-neutral-900">
              {data ? `${data.menteeName} 님의 제출물` : '멘티 제출물'}
            </h2>
            {data && (
              <p className="mt-1 break-words text-sm leading-6 text-neutral-500">
                {metaLine}
                <br />
                {formatReservationPeriod(
                  data.reservationStartAt,
                  data.reservationEndAt,
                )}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="제출물 모달 닫기"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5 py-5">
          {isLoading && (
            <p className="py-8 text-center text-sm text-neutral-500">
              제출물을 불러오는 중입니다...
            </p>
          )}
          {isError && (
            <p className="py-8 text-center text-sm text-neutral-500">
              제출물을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </p>
          )}
          {data && <QuestionSection detail={data} />}
        </div>
      </div>
    </BaseModal>
  );
};

/**
 * 멘토가 멘티의 1대1 라이브 멘토링 제출물(질문·첨부)을 여는 모달.
 *
 * 챌린지 라이브 피드백 모달(`LiveFeedbackReservationModal`)을 재사용하지 않는다 —
 * 그쪽은 출석 마킹·서면 피드백 작성·멘티 네비게이션을 안고 있고 1대1 에는 그중
 * 어느 것도 없다(PRD 4.6).
 */
const LiveMentoringSubmissionModal = ({
  applicationId,
  onClose,
}: LiveMentoringSubmissionModalProps) => {
  if (applicationId === null) return null;

  return (
    <SubmissionModalBody applicationId={applicationId} onClose={onClose} />
  );
};

export default LiveMentoringSubmissionModal;
