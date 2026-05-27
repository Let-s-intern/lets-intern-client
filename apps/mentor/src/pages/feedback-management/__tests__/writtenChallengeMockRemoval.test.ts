/**
 * Task 3.2 — writtenChallengeMock 제거 회귀 가드.
 *
 * 1) 대시보드 서면 행이 실 API(MSW) 응답 형태(mentorFeedbackManagementSchema)로
 *    렌더되는지 검증한다.
 * 2) 소비처(FeedbackManagementPage / useMergedFeedbackRows)에 writtenChallengeMock
 *    import가 0건인지 (회귀 가드) 검증한다.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { renderHook } from '@testing-library/react';
import { server } from '@letscareer/mocks/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { mentorFeedbackManagementSchema } from '@/api/challenge/challengeSchema';

import { useMergedFeedbackRows } from '../hooks/useMergedFeedbackRows';

// currentNow 고정 — 정렬·시간 분기 안정성 확보
vi.mock('@/pages/schedule/constants/mockNow', () => ({
  currentNow: () => new Date('2026-05-04T09:45:00'),
  MOCK_NOW: '2026-05-04T09:45:00',
}));

const BASE = 'https://example.test';
const __dirname = dirname(fileURLToPath(import.meta.url));

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('writtenChallengeMock 제거 — 실 API 서면 행 렌더', () => {
  it('MSW feedback-management 응답이 서면 행으로 매핑된다', async () => {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    const parsed = mentorFeedbackManagementSchema.parse(body.data);

    const { result } = renderHook(() =>
      useMergedFeedbackRows(parsed.challengeList, []),
    );

    const writtenRows = result.current.filter((r) => r.type === 'written');
    // 챌린지 2개 × 미션(3+2) = 5행
    expect(writtenRows.length).toBe(5);
    for (const r of writtenRows) {
      expect(r.reservationLabel).toBeNull();
      expect(r.startTime).toBeNull();
      expect(r.source.type).toBe('written');
    }

    // 제출자 있는 미션은 상세 진입 가능, 없는 미션은 불가
    const submitted = writtenRows.find((r) => r.id === 'written-1-1001');
    const empty = writtenRows.find((r) => r.id === 'written-1-1003');
    expect(submitted?.canOpenDetail).toBe(true);
    expect(submitted?.submissionLabel).toBe('제출');
    expect(empty?.canOpenDetail).toBe(false);
    expect(empty?.submissionLabel).toBe('미제출');
  });
});

describe('writtenChallengeMock import 회귀 가드', () => {
  const consumers = [
    resolve(__dirname, '../FeedbackManagementPage.tsx'),
    resolve(__dirname, '../hooks/useMergedFeedbackRows.ts'),
    resolve(__dirname, '../hooks/useFeedbackManagement.ts'),
  ];

  it('소비처에 writtenChallengeMock import가 0건이다', () => {
    for (const file of consumers) {
      const src = readFileSync(file, 'utf-8');
      expect(src).not.toContain('writtenChallengeMock');
      expect(src).not.toContain('WRITTEN_CHALLENGE_MOCK');
      expect(src).not.toContain('WRITTEN_CHALLENGE_MISSION_FEEDBACK_RANGES');
    }
  });
});
