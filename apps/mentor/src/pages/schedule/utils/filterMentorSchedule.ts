import type { PeriodBarData } from '../types';

/**
 * 멘토 일정 화이트리스트 필터.
 *
 * PRD-0503 #2: 멘토가 직접 행동해야 하거나 알아야 하는 일정만 노출한다.
 *
 * 표시 대상 — "행동/기간" 3종:
 * - `written-feedback`           — 서면 피드백 기간 (멘토 피드백 작성)
 * - `live-feedback-period`       — 라이브 피드백 기간
 * - `live-feedback-mentor-open`  — 라이브 피드백 일정 오픈기간
 *
 * 부가 표시 — 위 "기간"의 세부 표현:
 * - `live-feedback`              — 라이브 피드백 기간 안의 개별 세션 카드
 *                                  (UI상 하단 "시간별 일정" 영역. period 바와 한 묶음으로 동작)
 *
 * 제외 (멘토 행동 외):
 * - `written-mission-submit` (유저 제출)
 * - `written-review` (운영진 검수)
 * - `live-feedback-mentee-open` (멘티 신청)
 * - `barType` 미지정 / 알 수 없는 값 (미래 확장 시 안전성)
 */

/** 멘토가 행동/인지해야 할 "기간" 3종 — PRD가 명시한 핵심 화이트리스트 */
export const MENTOR_ACTION_PERIOD_BAR_TYPES = [
  'written-feedback',
  'live-feedback-period',
  'live-feedback-mentor-open',
] as const;

/**
 * 캘린더에 노출 허용되는 모든 barType.
 * `live-feedback` 세션 카드는 `live-feedback-period`의 세부 표현이므로 함께 표시한다.
 */
export const MENTOR_VISIBLE_BAR_TYPES = [
  ...MENTOR_ACTION_PERIOD_BAR_TYPES,
  'live-feedback',
] as const;

export type MentorActionPeriodBarType =
  (typeof MENTOR_ACTION_PERIOD_BAR_TYPES)[number];
export type MentorVisibleBarType = (typeof MENTOR_VISIBLE_BAR_TYPES)[number];

/** 단일 바가 멘토 일정 캘린더에 노출되어야 하는지 판별 */
export function isMentorVisibleBar(bar: PeriodBarData): boolean {
  if (!bar.barType) return false;
  return (MENTOR_VISIBLE_BAR_TYPES as readonly string[]).includes(bar.barType);
}

/** 단일 바가 멘토 행동 기간 3종에 해당하는지 판별 (네비게이션·태그용) */
export function isMentorActionPeriodBar(bar: PeriodBarData): boolean {
  if (!bar.barType) return false;
  return (MENTOR_ACTION_PERIOD_BAR_TYPES as readonly string[]).includes(
    bar.barType,
  );
}

/** 바 배열에서 멘토 캘린더에 노출할 항목만 추려서 반환 (순수 함수) */
export function filterMentorSchedule(bars: PeriodBarData[]): PeriodBarData[] {
  return bars.filter(isMentorVisibleBar);
}
