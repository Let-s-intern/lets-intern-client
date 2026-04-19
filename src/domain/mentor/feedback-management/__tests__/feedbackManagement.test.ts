/**
 * 멘토용 신규 API 스키마 파싱 테스트
 *
 * 목적: mentorFeedbackManagementSchema, mentorMenteeAttendanceListSchema의
 *       서버 응답 파싱이 올바르게 동작하는지 검증
 */

import { describe, expect, it } from 'vitest';
import {
  mentorFeedbackManagementSchema,
  mentorMenteeAttendanceListSchema,
} from '@/api/challenge/challengeSchema';

// ── 1) mentorFeedbackManagementSchema 파싱 테스트 ────────────────

describe('mentorFeedbackManagementSchema', () => {
  it('서버 응답 예시를 올바르게 파싱한다', () => {
    const serverResponse = {
      challengeList: [
        {
          challengeId: 1,
          title: '서류 합격 챌린지 7기',
          shortDesc: '서류 합격을 위한 첨삭 챌린지',
          startDate: '2026-03-01T00:00:00',
          endDate: '2026-04-01T00:00:00',
          feedbackMissions: [
            {
              missionId: 10,
              missionTitle: '자기소개서 작성',
              th: 1,
              submittedCount: 8,
              notSubmittedCount: 2,
              feedbackStatusCounts: [
                { feedbackStatus: 'WAITING', count: 3 },
                { feedbackStatus: 'IN_PROGRESS', count: 2 },
                { feedbackStatus: 'COMPLETED', count: 3 },
              ],
            },
            {
              missionId: 11,
              missionTitle: '이력서 작성',
              th: 2,
              submittedCount: 5,
              notSubmittedCount: 5,
              feedbackStatusCounts: [],
            },
          ],
        },
      ],
    };

    const result = mentorFeedbackManagementSchema.parse(serverResponse);

    expect(result.challengeList).toHaveLength(1);
    expect(result.challengeList[0].challengeId).toBe(1);
    expect(result.challengeList[0].feedbackMissions).toHaveLength(2);
    expect(result.challengeList[0].feedbackMissions[0].submittedCount).toBe(8);
    expect(
      result.challengeList[0].feedbackMissions[0].feedbackStatusCounts,
    ).toHaveLength(3);
  });

  it('feedbackMissions가 없으면 빈 배열로 기본값 적용', () => {
    const serverResponse = {
      challengeList: [
        {
          challengeId: 2,
          title: '테스트 챌린지',
          shortDesc: null,
          startDate: null,
          endDate: null,
        },
      ],
    };

    const result = mentorFeedbackManagementSchema.parse(serverResponse);

    expect(result.challengeList[0].feedbackMissions).toEqual([]);
  });

  it('빈 챌린지 목록을 올바르게 파싱한다', () => {
    const result = mentorFeedbackManagementSchema.parse({
      challengeList: [],
    });

    expect(result.challengeList).toEqual([]);
  });

  it('feedbackStatusCounts가 없으면 빈 배열로 기본값 적용', () => {
    const serverResponse = {
      challengeList: [
        {
          challengeId: 1,
          title: '챌린지',
          shortDesc: null,
          startDate: null,
          endDate: null,
          feedbackMissions: [
            {
              missionId: 1,
              missionTitle: null,
              th: 1,
              submittedCount: 0,
              notSubmittedCount: 0,
            },
          ],
        },
      ],
    };

    const result = mentorFeedbackManagementSchema.parse(serverResponse);

    expect(
      result.challengeList[0].feedbackMissions[0].feedbackStatusCounts,
    ).toEqual([]);
  });
});

// ── 2) mentorMenteeAttendanceListSchema 파싱 테스트 ──────────────

describe('mentorMenteeAttendanceListSchema', () => {
  it('제출자 (id 존재)를 올바르게 파싱한다', () => {
    const serverResponse = {
      attendanceList: [
        {
          id: 100,
          userId: 1,
          challengeMentorId: 5,
          mentorName: '김멘토',
          name: '이멘티',
          major: '컴퓨터공학',
          wishJob: '프론트엔드',
          wishCompany: '네이버',
          link: 'https://example.com/submission',
          status: 'PRESENT',
          result: 'PASS',
          challengePricePlanType: 'STANDARD',
          feedbackStatus: 'COMPLETED',
          optionCode: 'OPT1',
        },
      ],
    };

    const result = mentorMenteeAttendanceListSchema.parse(serverResponse);

    expect(result.attendanceList).toHaveLength(1);
    expect(result.attendanceList[0].id).toBe(100);
    expect(result.attendanceList[0].feedbackStatus).toBe('COMPLETED');
  });

  it('미제출자 (id=null)를 올바르게 파싱한다', () => {
    const serverResponse = {
      attendanceList: [
        {
          id: null,
          userId: 2,
          challengeMentorId: 5,
          mentorName: '김멘토',
          name: '박미제출',
          link: null,
          status: 'ABSENT',
          result: 'WAITING',
          challengePricePlanType: 'BASIC',
          feedbackStatus: null,
        },
      ],
    };

    const result = mentorMenteeAttendanceListSchema.parse(serverResponse);

    expect(result.attendanceList).toHaveLength(1);
    expect(result.attendanceList[0].id).toBeNull();
    expect(result.attendanceList[0].name).toBe('박미제출');
    expect(result.attendanceList[0].status).toBe('ABSENT');
    expect(result.attendanceList[0].feedbackStatus).toBeNull();
  });

  it('제출자와 미제출자가 혼재된 목록을 파싱한다', () => {
    const serverResponse = {
      attendanceList: [
        {
          id: 100,
          userId: 1,
          challengeMentorId: 5,
          mentorName: '김멘토',
          name: '이멘티',
          link: 'https://example.com/1',
          status: 'PRESENT',
          result: 'WAITING',
          challengePricePlanType: 'BASIC',
          feedbackStatus: 'WAITING',
        },
        {
          id: null,
          userId: 2,
          challengeMentorId: 5,
          mentorName: '김멘토',
          name: '박미제출',
          link: null,
          status: 'ABSENT',
          result: 'WAITING',
          challengePricePlanType: 'BASIC',
          feedbackStatus: null,
        },
      ],
    };

    const result = mentorMenteeAttendanceListSchema.parse(serverResponse);

    expect(result.attendanceList).toHaveLength(2);
    expect(result.attendanceList[0].id).toBe(100);
    expect(result.attendanceList[1].id).toBeNull();
  });

  it('mentorId를 challengeMentorId로 변환한다 (fallback)', () => {
    const serverResponse = {
      attendanceList: [
        {
          id: 100,
          userId: 1,
          mentorId: 7,
          mentorName: '이멘토',
          name: '홍길동',
          status: 'PRESENT',
          result: 'WAITING',
          challengePricePlanType: 'BASIC',
          feedbackStatus: 'WAITING',
        },
      ],
    };

    const result = mentorMenteeAttendanceListSchema.parse(serverResponse);

    // challengeMentorId가 없으면 mentorId를 fallback으로 사용
    expect(result.attendanceList[0].challengeMentorId).toBe(7);
  });

  it('빈 attendanceList를 올바르게 파싱한다', () => {
    const result = mentorMenteeAttendanceListSchema.parse({
      attendanceList: [],
    });

    expect(result.attendanceList).toEqual([]);
  });

  it('기본값이 올바르게 적용된다 (status, result, challengePricePlanType)', () => {
    const serverResponse = {
      attendanceList: [
        {
          id: null,
          userId: null,
          mentorName: null,
          name: '테스트',
        },
      ],
    };

    const result = mentorMenteeAttendanceListSchema.parse(serverResponse);

    expect(result.attendanceList[0].status).toBe('ABSENT');
    expect(result.attendanceList[0].result).toBe('WAITING');
    expect(result.attendanceList[0].challengePricePlanType).toBe('BASIC');
    expect(result.attendanceList[0].feedbackStatus).toBe('WAITING');
  });
});

// ── 3) nullable id 처리 검증 (DataGrid synthetic ID) ─────────────

describe('nullable id synthetic ID 할당', () => {
  it('null id에 음수 synthetic ID를 할당한다', () => {
    const attendanceList = [
      { id: 100 as number | null, name: 'A' },
      { id: null as number | null, name: 'B' },
      { id: null as number | null, name: 'C' },
      { id: 200 as number | null, name: 'D' },
    ];

    let syntheticIdCounter = -1;
    const processed = attendanceList.map((item) => ({
      ...item,
      id: item.id ?? syntheticIdCounter--,
    }));

    expect(processed[0].id).toBe(100);
    expect(processed[1].id).toBe(-1);
    expect(processed[2].id).toBe(-2);
    expect(processed[3].id).toBe(200);

    // All IDs should be unique
    const ids = processed.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
