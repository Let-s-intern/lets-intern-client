import { describe, expect, it } from 'vitest';

import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

import { deriveMentees } from '../hooks/useMenteeRoster';

function makeFeedback(overrides: Partial<FeedbackMentor> = {}): FeedbackMentor {
  return {
    feedbackId: 1,
    startDate: '2026-05-20T10:00:00',
    endDate: '2026-05-20T10:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    menteeName: '이지수',
    ...overrides,
  };
}

describe('deriveMentees', () => {
  it('menteeName+programTitle 쌍으로 distinct 한다 (라이브 세션이 여러 건이어도 1행)', () => {
    const mentees = deriveMentees([
      makeFeedback({ feedbackId: 1, menteeName: '이지수' }),
      makeFeedback({ feedbackId: 2, menteeName: '이지수' }),
    ]);
    expect(mentees).toHaveLength(1);
    expect(mentees[0].name).toBe('이지수');
  });

  it('같은 멘티라도 챌린지가 다르면 챌린지별로 별도 행이 된다', () => {
    const mentees = deriveMentees([
      makeFeedback({ menteeName: '이지수', programTitle: '자소서 챌린지 7기' }),
      makeFeedback({
        menteeName: '이지수',
        programTitle: '포트폴리오 챌린지 1기',
      }),
    ]);
    expect(mentees).toHaveLength(2);
    expect(mentees.map((m) => m.challengeTitle)).toContain('자소서 챌린지 7기');
    expect(mentees.map((m) => m.challengeTitle)).toContain(
      '포트폴리오 챌린지 1기',
    );
  });

  it('안정 키·아바타 이니셜을 파생한다', () => {
    const [mentee] = deriveMentees([
      makeFeedback({ menteeName: '이지수', programTitle: '자소서 챌린지 7기' }),
    ]);
    expect(mentee.id).toBe('이지수|자소서 챌린지 7기');
    expect(mentee.avatarInitial).toBe('이');
  });

  it('챌린지명 → 이름 순으로 정렬한다', () => {
    const mentees = deriveMentees([
      makeFeedback({ menteeName: '나멘티', programTitle: '나챌린지' }),
      makeFeedback({ menteeName: '가멘티', programTitle: '나챌린지' }),
      makeFeedback({ menteeName: '다멘티', programTitle: '가챌린지' }),
    ]);
    expect(mentees.map((m) => `${m.challengeTitle}/${m.name}`)).toEqual([
      '가챌린지/다멘티',
      '나챌린지/가멘티',
      '나챌린지/나멘티',
    ]);
  });

  it('빈 목록이면 빈 배열을 반환한다', () => {
    expect(deriveMentees([])).toEqual([]);
  });
});
