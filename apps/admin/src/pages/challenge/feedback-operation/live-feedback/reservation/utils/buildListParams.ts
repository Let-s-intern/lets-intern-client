import type { AdminFeedbackListParams } from '@/api/feedback/feedbackSchema';
import type { UseAdminLiveMentoringReservationsParams } from '@/api/live-mentoring/liveMentoring';
import type { ReservationTypeFilter } from './reservationRow';

/** 예약 필터 폼 상태(클라이언트). 멘티는 이름 기반 클라이언트 필터라 별도 보관한다. */
export interface ReservationFilterState {
  /** 예약 유형. 첫 필터인 프로그램명은 챌린지에만 있어 유형을 따로 둔다. */
  type: ReservationTypeFilter;
  challengeId: string;
  mentorId: string;
  /** 멘티 이름(클라이언트 필터용). 빈 문자열이면 전체. */
  menteeName: string;
  /** 예약 날짜 from (YYYY-MM-DD) */
  feedbackStartDate: string;
  /** 예약 날짜 to (YYYY-MM-DD) */
  feedbackEndDate: string;
  /** 신청 날짜 from (YYYY-MM-DD) */
  createStartDate: string;
  /** 신청 날짜 to (YYYY-MM-DD) */
  createEndDate: string;
}

export const INITIAL_FILTER: ReservationFilterState = {
  type: 'ALL',
  challengeId: '',
  mentorId: '',
  menteeName: '',
  feedbackStartDate: '',
  feedbackEndDate: '',
  createStartDate: '',
  createEndDate: '',
};

/** 날짜(YYYY-MM-DD) → 그 날의 시작 LocalDateTime. */
function toStartOfDay(date: string): string {
  return `${date}T00:00:00`;
}

/** 날짜(YYYY-MM-DD) → 그 날의 끝 LocalDateTime. */
function toEndOfDay(date: string): string {
  return `${date}T23:59:59`;
}

/** 유형별 조회 여부. 유형을 고른 쪽만 서버에 묻는다. */
export const includesChallenge = (type: ReservationTypeFilter): boolean =>
  type !== 'LIVE_MENTORING';
export const includesLiveMentoring = (type: ReservationTypeFilter): boolean =>
  type !== 'CHALLENGE';

/**
 * 필터 폼 상태를 `AdminFeedbackListParams`(API 쿼리)로 매핑한다.
 * 빈 값은 생략한다. 멘티는 이름 기반 클라이언트 필터이므로 menteeIdList 로 매핑하지 않는다.
 */
export function buildListParams(
  filter: ReservationFilterState,
): AdminFeedbackListParams {
  const params: AdminFeedbackListParams = {};

  // 유형이 1대1이면 프로그램명은 잠겨 있다. 잠기기 직전 값이 남아 있어도 보내지 않는다.
  if (filter.challengeId && includesChallenge(filter.type)) {
    params.challengeIdList = [Number(filter.challengeId)];
  }
  if (filter.mentorId) {
    params.mentorIdList = [Number(filter.mentorId)];
  }
  if (filter.feedbackStartDate) {
    params.feedbackStartDate = toStartOfDay(filter.feedbackStartDate);
  }
  if (filter.feedbackEndDate) {
    params.feedbackEndDate = toEndOfDay(filter.feedbackEndDate);
  }
  if (filter.createStartDate) {
    params.createStartDate = toStartOfDay(filter.createStartDate);
  }
  if (filter.createEndDate) {
    params.createEndDate = toEndOfDay(filter.createEndDate);
  }

  return params;
}

/**
 * 같은 필터 폼 상태를 1대1 예약 목록(`GET /admin/live-mentoring/applications`) 파라미터로
 * 매핑한다. 파라미터 이름이 챌린지 쪽과 달라(`feedbackStartDate` -> `reservationStartDate`)
 * 한 벌로 합칠 수 없다.
 *
 * 프로그램명(challengeId)은 1대1에 없어 매핑하지 않고, 멘티명은 챌린지와 같은 규칙으로
 * 거르기 위해 서버에 보내지 않는다(클라이언트 부분 일치).
 */
export function buildLiveMentoringListParams(
  filter: ReservationFilterState,
): UseAdminLiveMentoringReservationsParams {
  const params: UseAdminLiveMentoringReservationsParams = {};

  if (filter.mentorId) {
    params.mentorId = Number(filter.mentorId);
  }
  if (filter.feedbackStartDate) {
    params.reservationStartDate = toStartOfDay(filter.feedbackStartDate);
  }
  if (filter.feedbackEndDate) {
    params.reservationEndDate = toEndOfDay(filter.feedbackEndDate);
  }
  if (filter.createStartDate) {
    params.createStartDate = toStartOfDay(filter.createStartDate);
  }
  if (filter.createEndDate) {
    params.createEndDate = toEndOfDay(filter.createEndDate);
  }

  return params;
}
