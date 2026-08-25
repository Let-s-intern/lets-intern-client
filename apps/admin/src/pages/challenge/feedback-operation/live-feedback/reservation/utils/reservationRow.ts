import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';

/**
 * 예약 유형.
 *
 * 예약 관리 화면은 두 갈래의 예약을 한 표에 싣는다. 둘은 서버도 응답도 다르고,
 * 챌린지에만 있는 값(회차·출석·후기)과 1대1에만 있는 값(결제 상태·플랜)이 갈린다.
 */
export type ReservationKind = 'CHALLENGE' | 'LIVE_MENTORING';

/** 유형 필터 값. `ALL` 은 두 유형을 모두 조회한다. */
export type ReservationTypeFilter = ReservationKind | 'ALL';

export const RESERVATION_KIND_LABEL: Record<ReservationKind, string> = {
  CHALLENGE: '챌린지 라이브 피드백',
  LIVE_MENTORING: '1대1 라이브 멘토링',
};

export const RESERVATION_TYPE_OPTIONS: {
  value: ReservationTypeFilter;
  label: string;
}[] = [
  { value: 'ALL', label: '전체' },
  { value: 'CHALLENGE', label: RESERVATION_KIND_LABEL.CHALLENGE },
  { value: 'LIVE_MENTORING', label: RESERVATION_KIND_LABEL.LIVE_MENTORING },
];

/**
 * 목록·캘린더가 함께 다루는 예약 한 건.
 *
 * 두 응답을 하나의 평평한 행으로 눌러 담지 않는다. 챌린지에만 있는 출석·회차와
 * 1대1에만 있는 결제 상태·플랜이 있어, 합치면 어느 쪽이든 빈 칸이 생긴다.
 * 원본을 그대로 들고 다니면서 공통으로 필요한 값만 아래 접근자로 꺼내 쓴다.
 */
export type ReservationRow =
  | { kind: 'CHALLENGE'; feedback: FeedbackAdminVo }
  | { kind: 'LIVE_MENTORING'; reservation: AdminLiveMentoringReservation };

export const toChallengeRow = (feedback: FeedbackAdminVo): ReservationRow => ({
  kind: 'CHALLENGE',
  feedback,
});

export const toLiveMentoringRow = (
  reservation: AdminLiveMentoringReservation,
): ReservationRow => ({ kind: 'LIVE_MENTORING', reservation });

/** 행 식별자. 두 유형의 id 가 겹칠 수 있어 유형을 접두어로 붙인다. */
export const rowKey = (row: ReservationRow): string =>
  row.kind === 'CHALLENGE'
    ? `challenge-${row.feedback.feedbackId}`
    : `live-mentoring-${row.reservation.applicationId}`;

/** 예약 시작. 1대1은 슬롯을 점유하지 못한 신청이 있어 없을 수 있다. */
export const rowStartDate = (row: ReservationRow): string | null =>
  row.kind === 'CHALLENGE'
    ? row.feedback.startDate
    : row.reservation.reservationStartAt;

export const rowEndDate = (row: ReservationRow): string | null =>
  row.kind === 'CHALLENGE'
    ? row.feedback.endDate
    : row.reservation.reservationEndAt;

export const rowCreateDate = (row: ReservationRow): string =>
  row.kind === 'CHALLENGE'
    ? row.feedback.createDate
    : row.reservation.createDate;

export const rowMentorId = (row: ReservationRow): number =>
  row.kind === 'CHALLENGE' ? row.feedback.mentorId : row.reservation.mentorId;

/** 캘린더 색상 매핑과 표 표기가 같은 이름을 써야 한다. 닉네임을 먼저 본다. */
export const rowMentorName = (row: ReservationRow): string => {
  if (row.kind === 'CHALLENGE') return row.feedback.mentorName;
  const { mentorNickname, mentorName, mentorId } = row.reservation;
  return mentorNickname || mentorName || `멘토 #${mentorId}`;
};

export const rowMenteeName = (row: ReservationRow): string => {
  if (row.kind === 'CHALLENGE') return row.feedback.menteeName;
  return row.reservation.menteeName || `멘티 #${row.reservation.menteeId}`;
};

/** 표의 프로그램 칸. 1대1은 챌린지가 없어 상품명을 대신 넣는다. */
export const rowProgramTitle = (row: ReservationRow): string =>
  row.kind === 'CHALLENGE'
    ? row.feedback.programTitle || '-'
    : row.reservation.productName || '상품명 없음';
