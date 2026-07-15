import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { mentorFeedbackManagementSchema } from '../challengeSchema';

/**
 * 공유 MSW 핸들러(@letscareer/mocks)가 멘토 서면 피드백 현황 엔드포인트에 대해
 * BE 스키마(mentorFeedbackManagementSchema)를 통과하는 응답을 돌려주는지 검증한다.
 *
 * (기존 feedback-management/mocks/writtenChallengeMock.ts 시나리오 이관 결과 가드)
 * 와일드카드 prefix 패턴이라 임의 origin 으로 요청해도 매칭된다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('멘토 서면 피드백 현황 MSW 핸들러', () => {
  it('GET /challenge/mentor/feedback-management → mentorFeedbackManagementSchema 통과', async () => {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    const parsed = mentorFeedbackManagementSchema.parse(body.data);

    expect(parsed.challengeList.length).toBeGreaterThan(0);
    expect(parsed.challengeList[0].challengeId).toBe(1);
    expect(parsed.challengeList[0].feedbackMissions.length).toBeGreaterThan(0);
  });

  it('feedbackMissions의 feedbackStatusCounts가 스키마 enum을 따른다', async () => {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    const parsed = mentorFeedbackManagementSchema.parse(body.data);

    const allCounts = parsed.challengeList.flatMap((c) =>
      c.feedbackMissions.flatMap((m) => m.feedbackStatusCounts),
    );
    expect(allCounts.length).toBeGreaterThan(0);
    for (const item of allCounts) {
      expect(['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CONFIRMED']).toContain(
        item.feedbackStatus,
      );
    }
  });

  it('generic */challenge/:id 패턴보다 먼저 매칭되어 가로채이지 않는다', async () => {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    // feedback-management 핸들러가 우선 매칭되어 challengeList를 반환해야 한다.
    expect(body.data).toHaveProperty('challengeList');
    expect(body.data).not.toHaveProperty('liveFeedbackList');
  });
});
