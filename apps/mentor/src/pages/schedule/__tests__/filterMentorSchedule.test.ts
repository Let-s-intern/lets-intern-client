/**
 * Unit tests for `filterMentorSchedule` (PRD-0503 #2).
 *
 * 멘토 일정 화이트리스트 필터:
 *  - 행동/기간 3종: written-feedback / live-feedback-period / live-feedback-mentor-open
 *  - 부가 표시: live-feedback (period 의 세부 표현)
 *  - 제외: 그 외 모든 barType
 */

import { describe, expect, it } from 'vitest';

import {
  MENTOR_ACTION_PERIOD_BAR_TYPES,
  MENTOR_VISIBLE_BAR_TYPES,
  filterMentorSchedule,
  isMentorActionPeriodBar,
  isMentorVisibleBar,
} from '../utils/filterMentorSchedule';
import type { PeriodBarData } from '../types';

const makeBar = (
  barType: PeriodBarData['barType'],
  overrides: Partial<PeriodBarData> = {},
): PeriodBarData => ({
  barType,
  challengeId: 1,
  missionId: 10,
  challengeTitle: 'Test Challenge',
  th: 1,
  startDate: '2026-05-04',
  endDate: '2026-05-10',
  feedbackStartDate: '2026-05-04',
  feedbackDeadline: '2026-05-10',
  submittedCount: 0,
  notSubmittedCount: 0,
  waitingCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  ...overrides,
});

describe('상수 정의', () => {
  it('MENTOR_ACTION_PERIOD_BAR_TYPES 는 PRD 명시 3종', () => {
    expect(MENTOR_ACTION_PERIOD_BAR_TYPES).toEqual([
      'written-feedback',
      'live-feedback-period',
      'live-feedback-mentor-open',
    ]);
  });

  it('MENTOR_VISIBLE_BAR_TYPES 는 행동 3종 + live-feedback (4종)', () => {
    expect(MENTOR_VISIBLE_BAR_TYPES).toEqual([
      'written-feedback',
      'live-feedback-period',
      'live-feedback-mentor-open',
      'live-feedback',
    ]);
  });
});

describe('isMentorActionPeriodBar', () => {
  it.each(MENTOR_ACTION_PERIOD_BAR_TYPES)(
    '행동 기간 타입(%s)은 true', (type) => {
      expect(isMentorActionPeriodBar(makeBar(type))).toBe(true);
    },
  );

  it('live-feedback (개별 세션)은 false (기간 아님)', () => {
    expect(isMentorActionPeriodBar(makeBar('live-feedback'))).toBe(false);
  });

  it.each([
    'written-mission-submit',
    'written-review',
    'live-feedback-mentee-open',
  ] as const)('블랙리스트 타입(%s)은 false', (type) => {
    expect(isMentorActionPeriodBar(makeBar(type))).toBe(false);
  });

  it('barType undefined 이면 false', () => {
    expect(isMentorActionPeriodBar(makeBar(undefined))).toBe(false);
  });
});

describe('isMentorVisibleBar', () => {
  it.each(MENTOR_VISIBLE_BAR_TYPES)(
    '캘린더 표시 허용 타입(%s)은 true', (type) => {
      expect(isMentorVisibleBar(makeBar(type))).toBe(true);
    },
  );

  it.each([
    'written-mission-submit',
    'written-review',
    'live-feedback-mentee-open',
  ] as const)('블랙리스트 타입(%s)은 false', (type) => {
    expect(isMentorVisibleBar(makeBar(type))).toBe(false);
  });

  it('barType이 undefined이면 false', () => {
    expect(isMentorVisibleBar(makeBar(undefined))).toBe(false);
  });

  it('알 수 없는 미래 값은 false (방어적 기본값)', () => {
    const bar = makeBar('written-feedback');
    // @ts-expect-error 의도적으로 union 외 값을 주입
    bar.barType = 'unknown-future-type';
    expect(isMentorVisibleBar(bar)).toBe(false);
  });
});

describe('filterMentorSchedule', () => {
  it('빈 배열은 빈 배열을 반환한다', () => {
    expect(filterMentorSchedule([])).toEqual([]);
  });

  it('전부 화이트리스트(4종)면 그대로 반환한다', () => {
    const bars = [
      makeBar('written-feedback'),
      makeBar('live-feedback-period'),
      makeBar('live-feedback-mentor-open'),
      makeBar('live-feedback'),
    ];
    expect(filterMentorSchedule(bars)).toHaveLength(4);
  });

  it('전부 블랙리스트면 빈 배열을 반환한다', () => {
    const bars = [
      makeBar('written-mission-submit'),
      makeBar('written-review'),
      makeBar('live-feedback-mentee-open'),
    ];
    expect(filterMentorSchedule(bars)).toEqual([]);
  });

  it('혼합 입력에서 표시 허용(4종)만 추린다', () => {
    const bars = [
      makeBar('written-mission-submit'),
      makeBar('written-feedback'),
      makeBar('written-review'),
      makeBar('live-feedback-mentor-open'),
      makeBar('live-feedback-mentee-open'),
      makeBar('live-feedback-period'),
      makeBar('live-feedback'),
    ];
    const result = filterMentorSchedule(bars);
    expect(result).toHaveLength(4);
    expect(result.map((b) => b.barType)).toEqual([
      'written-feedback',
      'live-feedback-mentor-open',
      'live-feedback-period',
      'live-feedback',
    ]);
  });

  it('필터링은 순수 함수 — 원본 배열을 변형하지 않는다', () => {
    const bars = [
      makeBar('written-mission-submit'),
      makeBar('written-feedback'),
    ];
    const before = bars.map((b) => b.barType);
    filterMentorSchedule(bars);
    expect(bars.map((b) => b.barType)).toEqual(before);
    expect(bars).toHaveLength(2);
  });

  it('challengeId 등 다른 필드는 보존된다', () => {
    const bars = [
      makeBar('written-feedback', {
        challengeId: 42,
        challengeTitle: 'Specific Challenge',
        submittedCount: 7,
      }),
    ];
    const [result] = filterMentorSchedule(bars);
    expect(result.challengeId).toBe(42);
    expect(result.challengeTitle).toBe('Specific Challenge');
    expect(result.submittedCount).toBe(7);
  });
});
