import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';

import {
  getAdminFeedbackDetailResponseSchema,
  getAdminFeedbackHistoryResponseSchema,
  getAdminFeedbacksResponseSchema,
  getMentorFeedbackSlotsResponseSchema,
} from '@/api/feedback/feedbackSchema';

import { adminFeedbackHandlers } from './adminFeedback';

const BASE = 'http://localhost/api/v1';
const server = setupServer(...adminFeedbackHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/** 엔벨로프 `{ data }` 를 풀어 반환 */
async function fetchData<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  const body = (await res.json()) as { data: T };
  return body.data;
}

describe('GET /admin/feedback', () => {
  it('필터 없으면 전체 목록을 스키마 형태로 반환한다', async () => {
    const data = await fetchData('/admin/feedback');
    const parsed = getAdminFeedbacksResponseSchema.parse(data);
    expect(parsed.feedbackList.length).toBeGreaterThan(0);
  });

  it('목록 행에 mentorId 를 포함한다 (예약 변경 슬롯 조회용)', async () => {
    const data = await fetchData('/admin/feedback');
    const parsed = getAdminFeedbacksResponseSchema.parse(data);
    expect(
      parsed.feedbackList.every((f) => typeof f.mentorId === 'number'),
    ).toBe(true);
  });

  it('challengeIdList 로 필터링한다', async () => {
    const data = await fetchData('/admin/feedback?challengeIdList=2');
    const parsed = getAdminFeedbacksResponseSchema.parse(data);
    expect(parsed.feedbackList.length).toBeGreaterThan(0);
    expect(
      parsed.feedbackList.every((f) =>
        f.programTitle.includes('면접 준비 7일 끝장 챌린지 2기'),
      ),
    ).toBe(true);
  });

  it('mentorIdList 로 필터링한다 (제이슨=102)', async () => {
    const data = await fetchData('/admin/feedback?mentorIdList=102');
    const parsed = getAdminFeedbacksResponseSchema.parse(data);
    expect(parsed.feedbackList.every((f) => f.mentorName === '제이슨')).toBe(
      true,
    );
  });

  it('예약 날짜 범위로 필터링한다', async () => {
    const data = await fetchData(
      '/admin/feedback?feedbackStartDate=2026-06-03T00:00:00&feedbackEndDate=2026-06-30T23:59:59',
    );
    const parsed = getAdminFeedbacksResponseSchema.parse(data);
    expect(
      parsed.feedbackList.every((f) => f.startDate >= '2026-06-03T00:00:00'),
    ).toBe(true);
  });

  it('신청 날짜 범위로 필터링한다', async () => {
    const data = await fetchData(
      '/admin/feedback?createStartDate=2026-05-23T00:00:00&createEndDate=2026-05-23T23:59:59',
    );
    const parsed = getAdminFeedbacksResponseSchema.parse(data);
    expect(parsed.feedbackList).toHaveLength(1);
    expect(parsed.feedbackList[0].feedbackId).toBe(4);
  });
});

describe('GET /admin/feedback/{feedbackId}', () => {
  it('상세를 스키마 형태로 반환한다', async () => {
    const data = await fetchData('/admin/feedback/1');
    const parsed = getAdminFeedbackDetailResponseSchema.parse(data);
    expect(parsed.feedbackInfo.feedbackId).toBe(1);
    expect(parsed.feedbackInfo.mentorEmail).toBe('judy@letscareer.co.kr');
  });

  it('없는 id 는 404 를 반환한다', async () => {
    const res = await fetch(`${BASE}/admin/feedback/9999`);
    expect(res.status).toBe(404);
  });
});

describe('GET /admin/feedback/{feedbackId}/history', () => {
  it('예약 이동 내역(이전 예약일)을 스키마 형태로 반환한다', async () => {
    const data = await fetchData('/admin/feedback/1/history');
    const parsed = getAdminFeedbackHistoryResponseSchema.parse(data);
    expect(parsed.historyList.length).toBeGreaterThan(0);
    expect(parsed.historyList[0].beforeStartDate).toBeTruthy();
  });

  it('이동 내역 없는 예약은 빈 목록을 반환한다 (feedbackId=3)', async () => {
    const data = await fetchData('/admin/feedback/3/history');
    const parsed = getAdminFeedbackHistoryResponseSchema.parse(data);
    expect(parsed.historyList).toHaveLength(0);
  });
});

describe('GET /admin/feedback/slot/{mentorId}', () => {
  it('멘토 슬롯을 스키마 형태로 반환한다', async () => {
    const data = await fetchData('/admin/feedback/slot/101');
    const parsed = getMentorFeedbackSlotsResponseSchema.parse(data);
    expect(parsed.feedbackSlotList.length).toBeGreaterThan(0);
  });

  it('statusList=OPEN 으로 필터링한다', async () => {
    const data = await fetchData('/admin/feedback/slot/101?statusList=OPEN');
    const parsed = getMentorFeedbackSlotsResponseSchema.parse(data);
    expect(parsed.feedbackSlotList.every((s) => s.status === 'OPEN')).toBe(
      true,
    );
  });

  it('범위 밖이면 빈 목록을 반환한다', async () => {
    const data = await fetchData(
      '/admin/feedback/slot/101?startDate=2026-07-01T00:00:00&endDate=2026-07-31T23:59:59',
    );
    const parsed = getMentorFeedbackSlotsResponseSchema.parse(data);
    expect(parsed.feedbackSlotList).toHaveLength(0);
  });

  it('슬롯 없는 멘토는 빈 목록을 반환한다', async () => {
    const data = await fetchData('/admin/feedback/slot/999');
    const parsed = getMentorFeedbackSlotsResponseSchema.parse(data);
    expect(parsed.feedbackSlotList).toHaveLength(0);
  });
});

describe('POST /admin/feedback/{feedbackId}/slot/{feedbackSlotId}', () => {
  it('OPEN 슬롯으로의 변경은 성공한다 (data: null)', async () => {
    // feedbackId=1(멘토 101), 10107 은 101 멘토의 OPEN 슬롯
    const res = await fetch(`${BASE}/admin/feedback/1/slot/10107`, {
      method: 'POST',
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { data: null };
    expect(body.data).toBeNull();
  });

  it('OPEN 이 아닌(RESERVED) 슬롯으로의 변경은 409(슬롯 경합)를 반환한다', async () => {
    // 10103 은 101 멘토의 RESERVED 슬롯
    const res = await fetch(`${BASE}/admin/feedback/1/slot/10103`, {
      method: 'POST',
    });
    expect(res.status).toBe(409);
  });

  it('없는 예약 id 는 404 를 반환한다', async () => {
    const res = await fetch(`${BASE}/admin/feedback/9999/slot/10107`, {
      method: 'POST',
    });
    expect(res.status).toBe(404);
  });
});
