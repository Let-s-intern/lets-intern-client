/**
 * Push 2 / 2.2.T1 — 서면 바가 ChallengeDataFetcher(실 API/MSW) 단일 경로로 파생되는지 검증.
 *
 * 과거 useWrittenFeedbackMockData(목 오버레이)가 채우던 written-feedback 바를,
 * 이제 MSW 가 모킹하는 mission/attendance 응답 + computeDatesFromConfig 로
 * 동등하게 파생할 수 있음을 확인한다 (중복 오버레이 제거 → 단일 경로).
 */
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  challengeMissionFeedbackAttendanceListSchema,
  challengeMissionFeedbackListSchema,
} from '@/api/challenge/challengeSchema';

import { WRITTEN_FEEDBACK_CONFIG } from '../challenge-content/writtenFeedback';
import { computeDatesFromConfig } from '../constants/scheduleConfig';

const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('서면 바 실 경로(MSW) 파생', () => {
  it('challenge 1 미션 endDate(4/25)로 written-feedback 바가 4/26~4/28 로 파생된다', async () => {
    const res = await fetch(`${BASE}/challenge/1/mission/feedback`);
    const body = await res.json();
    const { missionList } = challengeMissionFeedbackListSchema.parse(body.data);
    const mission = missionList[0];

    const { feedbackStartDate, feedbackDeadline } = computeDatesFromConfig(
      WRITTEN_FEEDBACK_CONFIG,
      mission.endDate,
    );
    expect(feedbackStartDate).toBe('2026-04-26');
    expect(feedbackDeadline).toBe('2026-04-28');
  });

  it('challenge 2 미션 endDate(4/27)로 written-feedback 바가 4/28~4/30 로 파생된다', async () => {
    const res = await fetch(`${BASE}/challenge/2/mission/feedback`);
    const body = await res.json();
    const { missionList } = challengeMissionFeedbackListSchema.parse(body.data);
    const mission = missionList[0];

    const { feedbackStartDate, feedbackDeadline } = computeDatesFromConfig(
      WRITTEN_FEEDBACK_CONFIG,
      mission.endDate,
    );
    expect(feedbackStartDate).toBe('2026-04-28');
    expect(feedbackDeadline).toBe('2026-04-30');
  });

  it('attendance 응답으로 제출/미제출 카운트가 파생 가능하다', async () => {
    const res = await fetch(
      `${BASE}/challenge/1/mission/1001/feedback/attendances`,
    );
    const body = await res.json();
    const { attendanceList } =
      challengeMissionFeedbackAttendanceListSchema.parse(body.data);

    const submitted = attendanceList.filter((a) => a.status !== 'ABSENT');
    const notSubmitted = attendanceList.filter((a) => a.status === 'ABSENT');
    expect(submitted.length).toBeGreaterThan(0);
    expect(notSubmitted.length).toBeGreaterThan(0);
  });
});
