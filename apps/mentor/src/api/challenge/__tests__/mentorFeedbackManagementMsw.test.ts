import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  mentorFeedbackManagementSchema,
  mentorMenteeAttendanceListSchema,
} from '../challengeSchema';

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

describe('경험정리 EXPERIENCE_1/EXPERIENCE_2 페어 목업 시나리오', () => {
  /** 같은 challengeId+th를 공유하는 EXPERIENCE_1/EXPERIENCE_2 미션 쌍을 찾는다. */
  async function findExperiencePairs() {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    const parsed = mentorFeedbackManagementSchema.parse(body.data);

    const pairs: Array<{
      challengeId: number;
      th: number;
      exp1: { submittedCount: number };
      exp2: { submittedCount: number };
    }> = [];
    for (const challenge of parsed.challengeList) {
      const byTh = new Map<
        number,
        { exp1?: { submittedCount: number }; exp2?: { submittedCount: number } }
      >();
      for (const mission of challenge.feedbackMissions) {
        if (
          mission.missionType !== 'EXPERIENCE_1' &&
          mission.missionType !== 'EXPERIENCE_2'
        )
          continue;
        const entry = byTh.get(mission.th) ?? {};
        if (mission.missionType === 'EXPERIENCE_1') entry.exp1 = mission;
        else entry.exp2 = mission;
        byTh.set(mission.th, entry);
      }
      for (const [th, entry] of byTh) {
        if (entry.exp1 && entry.exp2)
          pairs.push({
            challengeId: challenge.challengeId,
            th,
            exp1: entry.exp1,
            exp2: entry.exp2,
          });
      }
    }
    return pairs;
  }

  it('같은 challengeId+th를 공유하는 EXPERIENCE_1/EXPERIENCE_2 페어가 존재한다', async () => {
    const pairs = await findExperiencePairs();
    expect(pairs.length).toBeGreaterThanOrEqual(3);
  });

  it('케이스 A: EXPERIENCE_1만 제출된 페어가 존재한다', async () => {
    const pairs = await findExperiencePairs();
    expect(
      pairs.some(
        (p) => p.exp1.submittedCount > 0 && p.exp2.submittedCount === 0,
      ),
    ).toBe(true);
  });

  it('케이스 B: EXPERIENCE_2만 제출된 페어가 존재한다', async () => {
    const pairs = await findExperiencePairs();
    expect(
      pairs.some(
        (p) => p.exp1.submittedCount === 0 && p.exp2.submittedCount > 0,
      ),
    ).toBe(true);
  });

  it('케이스 C: 두 미션 모두 제출 기록이 있는 페어가 존재한다', async () => {
    const pairs = await findExperiencePairs();
    expect(
      pairs.some((p) => p.exp1.submittedCount > 0 && p.exp2.submittedCount > 0),
    ).toBe(true);
  });

  /**
   * 위 3개 테스트는 feedback-management 요약(submittedCount)만 본다 — 실제 화면은
   * `.../attendances/mentee`(멘티별 출석)로 행을 그리므로, 그 응답이 미션마다
   * 실제로 달라야 그룹핑 필터(useMergedFeedbackRows)가 화면에서도 검증된다.
   * (요약만 다르고 출석 응답이 미션 무관하게 동일했던 버그의 회귀 방지)
   */
  async function fetchMenteeAttendance(missionId: number) {
    const res = await fetch(
      `${BASE}/challenge/9902/mission/${missionId}/feedback/attendances/mentee`,
    );
    const body = await res.json();
    return mentorMenteeAttendanceListSchema.parse(body.data).attendanceList;
  }

  it('케이스 A(4회차): 3401(EXP1) 출석과 3402(EXP2) 출석이 서로 다르다', async () => {
    const [exp1, exp2] = await Promise.all([
      fetchMenteeAttendance(3401),
      fetchMenteeAttendance(3402),
    ]);
    expect(exp1.find((m) => m.name === '강경험')?.status).toBe('PRESENT');
    expect(exp2.find((m) => m.name === '강경험')?.status).toBe('ABSENT');
  });

  it('케이스 B(5회차): 3501(EXP1) 출석과 3502(EXP2) 출석이 서로 다르다', async () => {
    const [exp1, exp2] = await Promise.all([
      fetchMenteeAttendance(3501),
      fetchMenteeAttendance(3502),
    ]);
    expect(exp1.find((m) => m.name === '노선택')?.status).toBe('ABSENT');
    expect(exp2.find((m) => m.name === '노선택')?.status).toBe('PRESENT');
  });

  it('케이스 C(6회차): 3601(EXP1)/3602(EXP2) 둘 다 제출 상태다', async () => {
    const [exp1, exp2] = await Promise.all([
      fetchMenteeAttendance(3601),
      fetchMenteeAttendance(3602),
    ]);
    expect(exp1.find((m) => m.name === '두번제출')?.status).toBe('PRESENT');
    expect(exp2.find((m) => m.name === '두번제출')?.status).toBe('PRESENT');
  });
});
