/**
 * 멘토 피드백 상태 배지/텍스트 색상 중앙 관리.
 * 라이브 피드백 모달, 서면 피드백 모달, 피드백 현황 페이지 전반에서 공통 사용.
 */

export const STATUS_BADGE = {
  completed: 'bg-green-50 text-green-700',
  inProgress: 'bg-blue-50 text-blue-600',
  waiting: 'bg-red-50 text-red-500',
  late: 'bg-amber-50 text-amber-700',
  absent: 'bg-neutral-100 text-neutral-600',
  submitted: 'bg-sky-50 text-sky-700',
  notSubmitted: 'bg-orange-50 text-orange-600',
  none: 'bg-gray-100 text-gray-500',
  // 라이브 피드백 상태 전용.
  // 미진행·취소는 동일 색(연빨강)으로 통일한다. 배지는 테두리 없이 옅은 배경만 사용.
  liveWaiting: 'bg-indigo-50 text-indigo-500',
  liveCompleted: 'bg-neutral-100 text-neutral-600',
  liveMissed: 'bg-red-50 text-red-500',
  liveCancelled: 'bg-red-50 text-red-500',
} as const;

/**
 * 캘린더 카드 전용 컴팩트 배지 색 (라이브 5상태).
 * 표준 배지(STATUS_BADGE.live*)와 색 계열은 같되 카드용으로 테두리 없는 옅은 톤.
 * (완료/미진행/취소는 표준과 동일 톤, 진행예정=indigo·진행중=blue 로 통일)
 */
export const LIVE_CARD_BADGE = {
  waiting: 'bg-indigo-50 text-indigo-500',
  inProgress: 'bg-blue-50 text-blue-600',
  completed: 'bg-white text-neutral-500',
  missed: 'bg-red-50 text-red-500',
  cancelled: 'bg-red-50 text-red-500',
} as const;

/** 배지 옆 숫자 카운트 등에 쓰이는 단일 텍스트 컬러 (배지와 톤 일치). */
export const STATUS_TEXT = {
  completed: 'text-green-700',
  inProgress: 'text-blue-600',
  waiting: 'text-red-500',
  late: 'text-amber-700',
  absent: 'text-neutral-600',
} as const;

/** FeedbackHeader 상단 통계 바처럼 "배경 없을 땐 회색"이 필요한 경우용 헬퍼. */
export function statusBadgeOrMuted(
  count: number,
  status: keyof typeof STATUS_BADGE,
): string {
  return count > 0 ? STATUS_BADGE[status] : 'text-gray-400';
}

/** 배지 클래스 문자열을 직접 받는 버전 (VISUALS.badgeClass 처럼 키가 아닌 클래스일 때). */
export function badgeClassOrMuted(count: number, badgeClass: string): string {
  return count > 0 ? badgeClass : 'text-gray-400';
}
