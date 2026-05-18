/**
 * Unit tests for feedback-tag based filtering logic (PRD-0503 #4).
 * 챌린지명 기반 필터를 폐기하고 피드백 종류 기반 필터로 대체했다.
 *
 * Tests that:
 * - 빈 태그 집합이면 모든 바를 노출 (= 전체)
 * - 선택된 태그 집합과 매칭되는 barType만 노출
 * - WeeklySummary는 unfiltered 데이터 사용 (집계 누락 방지)
 */

import { describe, expect, it } from 'vitest';

import {
  filterBarsByFeedbackTags,
  type FeedbackTagType,
} from '../constants/feedbackTag';
import type { PeriodBarData } from '../types';

const makeBar = (
  barType: PeriodBarData['barType'],
  challengeId: number,
  missionId: number,
): PeriodBarData => ({
  barType,
  challengeId,
  missionId,
  challengeTitle: `Challenge ${challengeId}`,
  th: 1,
  startDate: '2026-03-24',
  endDate: '2026-03-26',
  feedbackStartDate: '2026-03-24',
  feedbackDeadline: '2026-03-26',
  submittedCount: 5,
  notSubmittedCount: 2,
  waitingCount: 1,
  inProgressCount: 2,
  completedCount: 2,
});

const testBars: PeriodBarData[] = [
  makeBar('written-feedback', 1, 10),
  makeBar('written-mission-submit', 1, 11),
  makeBar('live-feedback-period', 2, 20),
  makeBar('live-feedback-mentor-open', 3, 30),
];

describe('Feedback tag filtering logic (PRD-0503 #4)', () => {
  describe('filterBarsByFeedbackTags', () => {
    it('빈 태그 집합이면 전체 바를 반환', () => {
      const result = filterBarsByFeedbackTags(
        testBars,
        new Set<FeedbackTagType>(),
      );
      expect(result).toHaveLength(testBars.length);
      expect(result).toEqual(testBars);
    });

    it('written 태그만 선택하면 서면 series만 통과', () => {
      const result = filterBarsByFeedbackTags(
        testBars,
        new Set<FeedbackTagType>(['written']),
      );
      expect(result).toHaveLength(2);
      expect(result.every((b) => b.barType?.startsWith('written'))).toBe(true);
    });

    it('live 태그만 선택하면 라이브 기간/세션만 통과', () => {
      const result = filterBarsByFeedbackTags(
        testBars,
        new Set<FeedbackTagType>(['live']),
      );
      expect(result).toHaveLength(1);
      expect(result[0].barType).toBe('live-feedback-period');
    });

    it('live-open 태그만 선택하면 멘토 일정 오픈 바만 통과', () => {
      const result = filterBarsByFeedbackTags(
        testBars,
        new Set<FeedbackTagType>(['live-open']),
      );
      expect(result).toHaveLength(1);
      expect(result[0].barType).toBe('live-feedback-mentor-open');
    });

    it('두 태그 동시 선택 시 OR 조건으로 합쳐진다', () => {
      const result = filterBarsByFeedbackTags(
        testBars,
        new Set<FeedbackTagType>(['written', 'live-open']),
      );
      expect(result).toHaveLength(3);
      expect(result.map((b) => b.barType)).toEqual([
        'written-feedback',
        'written-mission-submit',
        'live-feedback-mentor-open',
      ]);
    });
  });

  describe('WeeklySummary always uses unfiltered', () => {
    it('필터 적용 여부와 무관하게 unfiltered 집계 합계는 유지된다', () => {
      const unfiltered = testBars;
      const filtered = filterBarsByFeedbackTags(
        testBars,
        new Set<FeedbackTagType>(['written']),
      );

      expect(unfiltered).toHaveLength(4);
      expect(filtered).toHaveLength(2);

      const totalSubmitted = unfiltered.reduce(
        (acc, b) => acc + b.submittedCount,
        0,
      );
      expect(totalSubmitted).toBe(20); // 5 * 4
    });
  });
});
