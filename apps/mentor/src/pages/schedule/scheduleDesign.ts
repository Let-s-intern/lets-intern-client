/**
 * 피드백 캘린더(일정 바 · 개별 일정 카드) 디자인 토큰 — 한 곳에서 관리.
 * 라운드 6px(rounded-md) 통일. 색/상태 매핑은 각 컴포넌트 유지.
 */
export const scheduleDesign = {
  /** 일정 바 / 개별 카드 표면 (테두리·라운드 6px·배경) */
  surface: 'border-neutral-80 rounded-md border bg-white',
  /** 개별 카드 상태 배지 모양(6px). 상태별 색은 statusColors.LIVE_CARD_BADGE(SSOT) 사용. */
  cardBadge: 'rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium leading-none',
} as const;
