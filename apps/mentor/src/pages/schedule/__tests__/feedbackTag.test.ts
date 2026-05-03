import { describe, expect, it } from 'vitest';

import {
  FEEDBACK_TAGS,
  barTypeToFeedbackTag,
  filterBarsByFeedbackTags,
  type FeedbackTagType,
} from '../constants/feedbackTag';
import type { PeriodBarData } from '../types';

function makeBar(barType: PeriodBarData['barType']): PeriodBarData {
  return {
    barType,
    challengeId: 1,
    missionId: 1,
    challengeTitle: '테스트 챌린지',
    th: 1,
    startDate: '2099-01-01',
    endDate: '2099-01-07',
    feedbackStartDate: '2099-01-01',
    feedbackDeadline: '2099-01-07',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
  };
}

describe('FEEDBACK_TAGS (PRD-0503 #4)', () => {
  it('서면/LIVE/LIVE 일정 오픈 3가지 태그를 노출한다', () => {
    const types = FEEDBACK_TAGS.map((t) => t.type);
    expect(types).toEqual(['written', 'live', 'live-open']);
  });

  it('각 태그가 라벨과 활성/비활성 클래스를 모두 가진다', () => {
    for (const tag of FEEDBACK_TAGS) {
      expect(tag.label.length).toBeGreaterThan(0);
      expect(tag.inactiveClass.length).toBeGreaterThan(0);
      expect(tag.activeClass.length).toBeGreaterThan(0);
    }
  });

  it('라벨은 디자인과 일치한다', () => {
    const labels = FEEDBACK_TAGS.map((t) => t.label);
    expect(labels).toEqual([
      '서면 피드백',
      'LIVE 피드백',
      'LIVE 피드백 일정 오픈',
    ]);
  });
});

describe('barTypeToFeedbackTag', () => {
  it.each([
    ['written-mission-submit', 'written'],
    ['written-review', 'written'],
    ['written-feedback', 'written'],
  ] as const)('%s → %s', (barType, expected) => {
    expect(barTypeToFeedbackTag(barType)).toBe(expected);
  });

  it.each([
    ['live-feedback', 'live'],
    ['live-feedback-period', 'live'],
  ] as const)('%s → %s', (barType, expected) => {
    expect(barTypeToFeedbackTag(barType)).toBe(expected);
  });

  it.each([
    ['live-feedback-mentor-open', 'live-open'],
    ['live-feedback-mentee-open', 'live-open'],
  ] as const)('%s → %s', (barType, expected) => {
    expect(barTypeToFeedbackTag(barType)).toBe(expected);
  });

  it('barType이 undefined면 null 반환', () => {
    expect(barTypeToFeedbackTag(undefined)).toBeNull();
  });
});

describe('filterBarsByFeedbackTags', () => {
  const bars: PeriodBarData[] = [
    makeBar('written-feedback'),
    makeBar('written-mission-submit'),
    makeBar('live-feedback'),
    makeBar('live-feedback-period'),
    makeBar('live-feedback-mentor-open'),
    makeBar('live-feedback-mentee-open'),
  ];

  it('빈 집합이면 전체 바를 반환한다 (= 전체)', () => {
    const result = filterBarsByFeedbackTags(bars, new Set<FeedbackTagType>());
    expect(result).toHaveLength(bars.length);
  });

  it('written 태그만 선택하면 서면 series만 반환', () => {
    const result = filterBarsByFeedbackTags(bars, new Set(['written']));
    expect(result.map((b) => b.barType)).toEqual([
      'written-feedback',
      'written-mission-submit',
    ]);
  });

  it('live 태그만 선택하면 라이브 세션/기간만 반환', () => {
    const result = filterBarsByFeedbackTags(bars, new Set(['live']));
    expect(result.map((b) => b.barType)).toEqual([
      'live-feedback',
      'live-feedback-period',
    ]);
  });

  it('live-open 태그만 선택하면 멘토/멘티 일정 오픈 바만 반환', () => {
    const result = filterBarsByFeedbackTags(bars, new Set(['live-open']));
    expect(result.map((b) => b.barType)).toEqual([
      'live-feedback-mentor-open',
      'live-feedback-mentee-open',
    ]);
  });

  it('두 태그 동시 선택 시 OR 조건으로 합쳐진다', () => {
    const result = filterBarsByFeedbackTags(
      bars,
      new Set(['written', 'live-open']),
    );
    expect(result.map((b) => b.barType)).toEqual([
      'written-feedback',
      'written-mission-submit',
      'live-feedback-mentor-open',
      'live-feedback-mentee-open',
    ]);
  });
});
