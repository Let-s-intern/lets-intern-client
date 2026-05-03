/**
 * 멘토 피드백 상태 배지/텍스트 색상 중앙 관리.
 * 라이브 피드백 모달, 서면 피드백 모달, 피드백 현황 페이지 전반에서 공통 사용.
 */

export const STATUS_BADGE = {
  completed: 'border border-green-200 bg-green-50 text-green-700',
  inProgress: 'border border-blue-200 bg-blue-50 text-blue-600',
  waiting: 'border border-red-200 bg-red-50 text-red-500',
  late: 'border border-amber-200 bg-amber-50 text-amber-700',
  absent: 'border border-neutral-300 bg-neutral-100 text-neutral-600',
  submitted: 'border border-sky-200 bg-sky-50 text-sky-700',
  notSubmitted: 'border border-orange-200 bg-orange-50 text-orange-600',
  none: 'bg-gray-100 text-gray-500',
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
