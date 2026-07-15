import type { AdminFeedbackListParams } from '@/api/feedback/feedbackSchema';

/** 예약 필터 폼 상태(클라이언트). 멘티는 이름 기반 클라이언트 필터라 별도 보관한다. */
export interface ReservationFilterState {
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

/**
 * 필터 폼 상태를 `AdminFeedbackListParams`(API 쿼리)로 매핑한다.
 * 빈 값은 생략한다. 멘티는 이름 기반 클라이언트 필터이므로 menteeIdList 로 매핑하지 않는다.
 */
export function buildListParams(
  filter: ReservationFilterState,
): AdminFeedbackListParams {
  const params: AdminFeedbackListParams = {};

  if (filter.challengeId) {
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
