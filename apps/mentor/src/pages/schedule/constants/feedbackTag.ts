/**
 * 일정 카드 / 필터 태그 정의 (PRD-0503 #4).
 *
 * 챌린지명 기반 태그를 폐기하고 "피드백 종류"로 분류한다.
 * 디자인 참조: `.claude/tasks/피드백 테그.png`
 *  - 전체           : 회색 (선택 시 primary)
 *  - 서면 피드백    : 회색 톤 말풍선 아이콘 + 옅은 회색 배경
 *  - LIVE 피드백    : 빨간색 LIVE 인디케이터 + 옅은 레드 배경
 *  - LIVE 피드백 일정 오픈 : 파란색 캘린더 아이콘 + 옅은 블루 배경
 *
 * `barType` → `FeedbackTagType` 매핑:
 *  - written-mission-submit / written-review / written-feedback → 'written'
 *  - live-feedback / live-feedback-period                       → 'live'
 *  - live-feedback-mentor-open / live-feedback-mentee-open      → 'live-open'
 */

import type { PeriodBarData } from '../types';

export type FeedbackTagType = 'written' | 'live' | 'live-open';

export interface FeedbackTagDescriptor {
  type: FeedbackTagType;
  /** 필터 버튼 라벨 */
  label: string;
  /** 비선택 시 배경/텍스트 클래스 */
  inactiveClass: string;
  /** 선택 시 배경/텍스트 클래스 */
  activeClass: string;
}

/**
 * 피드백 태그 정의 — 라벨 / 활성·비활성 색상.
 * 색상은 "프로그램별 구분"이 아니라 "피드백 종류"의 시맨틱 컬러.
 */
export const FEEDBACK_TAGS: readonly FeedbackTagDescriptor[] = [
  {
    type: 'written',
    label: '서면 피드백',
    inactiveClass: 'bg-white border border-neutral-80 text-neutral-30',
    activeClass: 'bg-neutral-30 text-white border border-neutral-30',
  },
  {
    type: 'live',
    label: 'LIVE 피드백',
    inactiveClass: 'bg-white border border-neutral-80 text-red-500',
    activeClass: 'bg-red-500 text-white border border-red-500',
  },
  {
    type: 'live-open',
    label: 'LIVE 피드백 일정 오픈',
    inactiveClass: 'bg-white border border-neutral-80 text-blue-500',
    activeClass: 'bg-blue-500 text-white border border-blue-500',
  },
] as const;

/** PeriodBarData의 barType을 피드백 태그 종류로 매핑한다. */
export function barTypeToFeedbackTag(
  barType: PeriodBarData['barType'],
): FeedbackTagType | null {
  switch (barType) {
    case 'written-mission-submit':
    case 'written-review':
    case 'written-feedback':
      return 'written';
    case 'live-feedback':
    case 'live-feedback-period':
      return 'live';
    case 'live-feedback-mentor-open':
    case 'live-feedback-mentee-open':
      return 'live-open';
    default:
      return null;
  }
}

/** 선택된 태그 집합으로 바를 필터링한다. 빈 집합이면 전체 노출 (= "전체" 모드). */
export function filterBarsByFeedbackTags<T extends { barType?: PeriodBarData['barType'] }>(
  bars: T[],
  selectedTags: ReadonlySet<FeedbackTagType>,
): T[] {
  if (selectedTags.size === 0) return bars;
  return bars.filter((bar) => {
    const tag = barTypeToFeedbackTag(bar.barType);
    return tag !== null && selectedTags.has(tag);
  });
}
