/**
 * 라이브 피드백 파생 바 shape sanity 테스트.
 *
 * 과거에는 LIVE_FEEDBACK_MOCK_DATA(목)를 검증했으나, 라이브 캘린더가 실 API 파생으로
 * 전환되어 mock 모듈이 삭제됨. 이제 deriveLiveFeedbackBars 가 만드는 PeriodBarData 의
 * 런타임 형태(필수 필드·barType enum·startDate<=endDate)를 검증한다.
 */
import { describe, expect, it } from 'vitest';

import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';
import { deriveLiveFeedbackBars } from '@/pages/schedule/hooks/useLiveFeedbackData';

const SESSIONS: FeedbackMentor[] = [
  {
    feedbackId: 101,
    startDate: '2026-05-04T10:00:00',
    endDate: '2026-05-04T10:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '기필코 경험정리 챌린지 21기',
    menteeName: '이지수',
  },
  {
    feedbackId: 501,
    startDate: '2026-05-06T14:00:00',
    endDate: '2026-05-06T14:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '커리어 설계 챌린지 5기',
    menteeName: '문수아',
  },
];

const SLOTS = [
  {
    feedbackSlotId: 1,
    startDate: '2026-04-24T09:00:00',
    endDate: '2026-04-25T18:00:00',
    status: 'OPEN' as const,
  },
];

const BARS = deriveLiveFeedbackBars(SESSIONS, SLOTS);

describe('liveMentoring 파생 바 (shape sanity)', () => {
  it('모든 항목은 필수 필드를 가진다', () => {
    for (const bar of BARS) {
      expect(typeof bar.barType).toBe('string');
      expect(typeof bar.challengeId).toBe('number');
      expect(typeof bar.challengeTitle).toBe('string');
      expect(typeof bar.startDate).toBe('string');
      expect(typeof bar.endDate).toBe('string');
    }
  });

  it('barType 은 알려진 라이브 enum 중 하나이다', () => {
    const allowed = new Set([
      'live-feedback-mentor-open',
      'live-feedback-mentee-open',
      'live-feedback-period',
      'live-feedback',
    ]);
    for (const bar of BARS) {
      expect(allowed.has(bar.barType!)).toBe(true);
    }
  });

  it('startDate <= endDate', () => {
    for (const bar of BARS) {
      expect(bar.startDate <= bar.endDate).toBe(true);
    }
  });
});
