import { useMemo } from 'react';
import { format } from 'date-fns';

import { useLiveMentoringReservationsQuery } from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';

import type { PeriodBarData } from '../types';

/**
 * 캘린더에 쓰는 1대1 라이브 멘토링 이름표. 챌린지가 아니지만 `PeriodBarData` 를
 * 그대로 재사용하므로 `challengeTitle` 자리에 이 값을 넣는다.
 */
export const LIVE_MENTORING_TITLE = '1대1 라이브 멘토링';

/**
 * 1대1 예약 바의 합성 challengeId.
 * 서면(양수)·라이브 피드백(-1_000_000 대역)과 겹치지 않는 값을 쓴다.
 */
export const LIVE_MENTORING_CHALLENGE_ID = -4_000_000;

/**
 * 멘토 캘린더용 1대1 라이브 멘토링 예약 데이터 훅.
 *
 * 라이브 피드백(`useLiveFeedbackData`)과 같은 방식으로 실 API 응답을 `PeriodBarData` 로
 * 파생해 기존 캘린더 파이프라인(화이트리스트 → 태그 필터 → 렌더)에 그대로 태운다.
 *
 * 서버(`GET /mentor/live-mentoring/reservations`)가 결제 완료 확정 건만, 본인 건만
 * 내리므로 **여기서 상태로 다시 거르지 않는다.**
 */
export function useLiveMentoringData(
  /** false 면 내부 쿼리를 실행하지 않는다 */
  { enabled = true }: { enabled?: boolean } = {},
): { bars: PeriodBarData[]; isLoading: boolean } {
  const { data: reservations, isLoading } = useLiveMentoringReservationsQuery(
    {},
    { enabled },
  );

  const bars = useMemo(
    () => deriveLiveMentoringBars(reservations ?? []),
    [reservations],
  );

  return { bars, isLoading };
}

/** "YYYY-MM-DD" */
function toDate(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd');
}

/** "HH:mm" */
function toTime(iso: string): string {
  return format(new Date(iso), 'HH:mm');
}

/**
 * 예약 목록 → `PeriodBarData[]` 파생. 예약 1건이 카드 1개다.
 *
 * 1대1에는 기간 바가 없다 — 챌린지 회차처럼 묶일 상위 단위가 없기 때문에
 * 라이브 피드백의 `live-feedback-period` 에 해당하는 바를 만들지 않는다.
 *
 * 테스트 가능하도록 순수 함수로 분리한다.
 */
export function deriveLiveMentoringBars(
  reservations: LiveMentoringReservation[],
): PeriodBarData[] {
  return reservations.map((reservation) => {
    const date = toDate(reservation.reservationStartAt);
    return {
      barType: 'live-mentoring' as const,
      challengeId: LIVE_MENTORING_CHALLENGE_ID,
      // applicationId 는 양수라 서면 missionId 와 겹칠 수 있어 음수 대역으로 민다.
      missionId: -(4_000_000 + reservation.applicationId),
      challengeTitle: LIVE_MENTORING_TITLE,
      // 1대1에 회차 개념이 없다. 타입을 만족시키는 자리값이고 화면에 쓰지 않는다.
      th: 1,
      startDate: date,
      endDate: toDate(reservation.reservationEndAt),
      feedbackStartDate: date,
      feedbackDeadline: date,
      // 제출·피드백 집계가 없는 단위라 전부 0이다. 주간 요약도 이 바를 세지 않는다.
      submittedCount: 0,
      notSubmittedCount: 0,
      waitingCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      liveMentoring: {
        applicationId: reservation.applicationId,
        menteeName: reservation.menteeName,
        productName: reservation.productName,
        startTime: toTime(reservation.reservationStartAt),
        endTime: toTime(reservation.reservationEndAt),
        durationMinutes: reservation.durationMinutes,
        questionWritten: reservation.questionWritten,
        attachmentSubmitted: reservation.attachmentSubmitted,
      },
    };
  });
}
