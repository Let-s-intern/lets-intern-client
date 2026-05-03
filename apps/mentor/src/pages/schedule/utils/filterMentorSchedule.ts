import type { PeriodBarData } from '../types';

/**
 * 멘토 일정 화이트리스트 필터.
 *
 * PRD-0503 #2: 멘토가 직접 행동해야 하거나 알아야 하는 일정만 노출한다.
 *
 * 표시 대상 (3가지):
 * - `written-feedback`           — 서면 피드백 기간 (멘토 피드백 작성)
 * - `live-feedback-period`       — 라이브 피드백 기간
 * - `live-feedback-mentor-open`  — 라이브 피드백 일정 오픈기간
 *
 * 제외 (멘토 행동 외):
 * - `written-mission-submit` (유저 제출)
 * - `written-review` (운영진 검수)
 * - `live-feedback-mentee-open` (멘티 신청)
 * - `live-feedback` (개별 세션 카드 — 모달 내부에서만 사용, 캘린더 비표시)
 * - `barType` 미지정 / 알 수 없는 값 (미래 확장 시 안전성)
 */
export const MENTOR_VISIBLE_BAR_TYPES = [
  'written-feedback',
  'live-feedback-period',
  'live-feedback-mentor-open',
] as const;

export type MentorVisibleBarType = (typeof MENTOR_VISIBLE_BAR_TYPES)[number];

/** 단일 바가 멘토 일정에 노출되어야 하는지 판별 */
export function isMentorVisibleBar(bar: PeriodBarData): boolean {
  if (!bar.barType) return false;
  return (MENTOR_VISIBLE_BAR_TYPES as readonly string[]).includes(bar.barType);
}

/** 바 배열에서 멘토에게 보여줄 항목만 추려서 반환 (순수 함수) */
export function filterMentorSchedule(bars: PeriodBarData[]): PeriodBarData[] {
  return bars.filter(isMentorVisibleBar);
}
