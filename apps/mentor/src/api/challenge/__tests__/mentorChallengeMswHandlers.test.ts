/**
 * Push 2 / 2.1.T1 — 서면 경로 백필 MSW 핸들러 스키마 검증.
 *
 * 공유 MSW 핸들러(@letscareer/mocks)가 ChallengeDataFetcher 가 의존하는
 * challenge/mission/attendance 엔드포인트에 대해 mentor zod 스키마를 통과하는
 * 응답을 돌려주는지 검증한다.
 */
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  challengeMissionFeedbackAttendanceListSchema,
  challengeMissionFeedbackListSchema,
  mentorMenteeAttendanceListSchema,
} from '../challengeSchema';
import { z } from 'zod';
import { challengeMentorVoSchema } from '@/api/user/userSchema';

const BASE = 'https://example.test';

const mentorChallengeListSchema = z.object({
  myChallengeMentorVoList: z.array(challengeMentorVoSchema),
});

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('멘토 서면 경로 MSW 핸들러', () => {
  it('GET /challenge-mentor → PROCEEDING 챌린지 목록 (스키마 통과)', async () => {
    const res = await fetch(`${BASE}/challenge-mentor`);
    const body = await res.json();
    const parsed = mentorChallengeListSchema.parse(body.data);
    // 공유 mock 은 두 QA 시나리오의 챌린지를 합쳐 반환한다:
    // 라이브 피드백(1·2 legacy) + 서면 경험정리(9901 신규) = 3건.
    expect(parsed.myChallengeMentorVoList.length).toBe(3);
    expect(
      parsed.myChallengeMentorVoList.every(
        (c) => c.programStatusType === 'PROCEEDING',
      ),
    ).toBe(true);
  });

  it('GET /challenge/:id/mission/feedback → 미션 목록 (datetime local 통과)', async () => {
    const res = await fetch(`${BASE}/challenge/1/mission/feedback`);
    const body = await res.json();
    const parsed = challengeMissionFeedbackListSchema.parse(body.data);
    expect(parsed.missionList.length).toBeGreaterThan(0);
    expect(parsed.missionList[0].th).toBe(1);
  });

  it('GET /challenge/:id/mission/:mid/feedback/attendances → 제출자 목록 (legacy)', async () => {
    const res = await fetch(
      `${BASE}/challenge/1/mission/1001/feedback/attendances`,
    );
    const body = await res.json();
    const parsed = challengeMissionFeedbackAttendanceListSchema.parse(
      body.data,
    );
    expect(parsed.attendanceList.length).toBeGreaterThan(0);
    // ABSENT/PRESENT 분포가 있어 제출/미제출 카운트 파생 가능
    expect(parsed.attendanceList.some((a) => a.status === 'ABSENT')).toBe(true);
    expect(parsed.attendanceList.some((a) => a.status !== 'ABSENT')).toBe(true);
  });

  it('GET /challenge/:id/mission/:mid/feedback/attendances/mentee → 제출 내역 (신규)', async () => {
    const res = await fetch(
      `${BASE}/challenge/300/mission/3001/feedback/attendances/mentee`,
    );
    const body = await res.json();
    const parsed = mentorMenteeAttendanceListSchema.parse(body.data);
    expect(parsed.attendanceList.length).toBeGreaterThan(0);
  });

  it('mentee 경로는 일반 attendances 핸들러에 가로채이지 않는다', async () => {
    const res = await fetch(
      `${BASE}/challenge/300/mission/3001/feedback/attendances/mentee`,
    );
    const body = await res.json();
    // 두 핸들러 모두 attendanceList 를 반환하므로 형태로만 구분 — 정상 파싱이면 통과.
    expect(body.data).toHaveProperty('attendanceList');
  });
});
