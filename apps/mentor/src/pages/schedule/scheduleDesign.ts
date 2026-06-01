/**
 * 피드백 캘린더(일정 바 · 개별 일정 카드) 디자인 토큰 — 한 곳에서 관리.
 * 라운드 6px(rounded-md) 통일. 색/상태 매핑은 각 컴포넌트 유지.
 */
export const scheduleDesign = {
  /** 일정 바 / 개별 카드 표면 (테두리·라운드 6px·배경) */
  surface: 'border-neutral-80 rounded-md border bg-white',
  /** 개별 카드 상태 배지 모양(6px) */
  cardBadge: 'rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none',
  /** 개별 카드 상태 배지 색 */
  cardBadgeActive: 'bg-primary-5 text-primary',
  cardBadgeDone: 'border border-neutral-300 bg-white text-neutral-500',
  cardBadgeCanceled: 'bg-red-50 text-red-500',
} as const;
