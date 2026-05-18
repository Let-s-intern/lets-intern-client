/**
 * Push 1 / 1.3.T1 — 라이브 피드백 zod schema 스모크 테스트
 *
 * v2.0 라이브 피드백 코드는 mock 데이터 기반이라 zod schema 가 새로 추가되지 않았습니다.
 * 본 테스트는 mock 데이터가 PeriodBarData 타입과 일관되는지(런타임 형태) 만 가볍게 검증합니다.
 * BE 연동 시 정식 zod schema 추가와 함께 본 테스트도 강화합니다.
 */
import { describe, it, expect } from 'vitest';
import { LIVE_FEEDBACK_MOCK_DATA } from '@/pages/schedule/challenge-content/liveFeedbackMock';

describe('liveMentoring schema (mock-shape sanity)', () => {
  it('LIVE_FEEDBACK_MOCK_DATA 의 모든 항목은 필수 필드를 가진다', () => {
    for (const bar of LIVE_FEEDBACK_MOCK_DATA) {
      expect(typeof bar.barType).toBe('string');
      expect(typeof bar.challengeId).toBe('number');
      expect(typeof bar.challengeTitle).toBe('string');
      expect(typeof bar.startDate).toBe('string');
      expect(typeof bar.endDate).toBe('string');
    }
  });

  it('barType 은 알려진 enum 중 하나이다', () => {
    const allowed = new Set([
      'live-feedback-mentor-open',
      'live-feedback-mentee-open',
      'live-feedback-period',
      'live-feedback',
      'written-feedback',
      'written-feedback-phase',
    ]);
    for (const bar of LIVE_FEEDBACK_MOCK_DATA) {
      expect(allowed.has(bar.barType)).toBe(true);
    }
  });

  it('startDate <= endDate', () => {
    for (const bar of LIVE_FEEDBACK_MOCK_DATA) {
      expect(bar.startDate <= bar.endDate).toBe(true);
    }
  });
});
