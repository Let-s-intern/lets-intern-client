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
