import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  getMentorFeedbackDetailResponseSchema,
  getMentorFeedbacksResponseSchema,
} from '../feedbackSchema';

/**
 * 공유 MSW 핸들러(@letscareer/mocks)가 멘토 라이브 피드백 엔드포인트에 대해
 * BE 스키마를 통과하는 응답을 돌려주는지 검증한다.
 *
 * 와일드카드 prefix 패턴이라 임의 origin 으로 요청해도 매칭된다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('멘토 MSW 핸들러', () => {
  it('GET /feedback/mentor → getMentorFeedbacksResponseSchema 통과', async () => {
    const res = await fetch(`${BASE}/feedback/mentor`);
    const body = await res.json();
    const parsed = getMentorFeedbacksResponseSchema.parse(body.data);
    expect(parsed.feedbackList.length).toBeGreaterThan(0);
    expect(parsed.feedbackList[0].status).toBe('RESERVED');
  });

  it('GET /feedback/mentor/:id → getMentorFeedbackDetailResponseSchema 통과', async () => {
    const res = await fetch(`${BASE}/feedback/mentor/123`);
    const body = await res.json();
    const parsed = getMentorFeedbackDetailResponseSchema.parse(body.data);
    expect(parsed.feedbackInfo.feedbackId).toBe(123);
    expect(parsed.feedbackInfo.attendanceUrl).toContain('123');
    expect(parsed.feedbackInfo.attendanceStatus).toBe('PRESENT');
  });

  it('GET /feedback/mentor/slot 은 멘토 detail 핸들러에 가로채이지 않는다', async () => {
    const res = await fetch(`${BASE}/feedback/mentor/slot`);
    const body = await res.json();
    // slot 핸들러가 우선 매칭되어 feedbackSlotList 를 반환해야 한다.
    expect(body.data).toHaveProperty('feedbackSlotList');
    expect(body.data).not.toHaveProperty('feedbackInfo');
  });

  it('PATCH /feedback/mentor/:id → 200', async () => {
    const res = await fetch(`${BASE}/feedback/mentor/123`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menteeStatus: 'PRESENT' }),
    });
    expect(res.status).toBe(200);
  });
});
