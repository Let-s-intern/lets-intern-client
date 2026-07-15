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

import {
  challengeMissionFeedbackAttendanceListSchema,
  mentorFeedbackManagementSchema,
} from '@/api/challenge/challengeSchema';

import {
  useMergedFeedbackRows,
  type WrittenMenteeAttendance,
} from '../hooks/useMergedFeedbackRows';

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
  it('MSW feedback-management 응답 + 출석 맵으로 멘티별 서면 행이 펼쳐진다', async () => {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    const parsed = mentorFeedbackManagementSchema.parse(body.data);

    // 미션별 출석 fan-out 결과를 모사: 각 (challenge, mission)에 멘티 2명 부여.
    const attendanceMap = new Map<string, WrittenMenteeAttendance[]>();
    let missionCount = 0;
    for (const challenge of parsed.challengeList) {
      for (const mission of challenge.feedbackMissions) {
        missionCount += 1;
        attendanceMap.set(`${challenge.challengeId}-${mission.missionId}`, [
          {
            id: 1000 + missionCount,
            name: `멘티A${missionCount}`,
            status: 'PRESENT',
            feedbackStatus: 'COMPLETED',
          },
          {
            id: 2000 + missionCount,
            name: `멘티B${missionCount}`,
            status: 'ABSENT',
            feedbackStatus: 'WAITING',
          },
        ]);
      }
    }

    const { result } = renderHook(() =>
      useMergedFeedbackRows(parsed.challengeList, [], attendanceMap),
    );

    const writtenRows = result.current.filter((r) => r.type === 'written');
    // 미션(3+2=5개) × 멘티 2명 = 10행
    expect(writtenRows.length).toBe(missionCount * 2);
    for (const r of writtenRows) {
      expect(r.reservationLabel).toBeNull();
      expect(r.startTime).toBeNull();
      expect(r.source.type).toBe('written');
    }

    // PRESENT+COMPLETED → 제출/상세 진입 가능, ABSENT → 미제출/상세 불가
    const submitted = writtenRows.find((r) => r.menteeNameLabel === '멘티A1');
    const absent = writtenRows.find((r) => r.menteeNameLabel === '멘티B1');
    expect(submitted?.canOpenDetail).toBe(true);
    expect(submitted?.submissionLabel).toBe('제출');
    expect(absent?.canOpenDetail).toBe(false);
    expect(absent?.submissionLabel).toBe('미제출');
  });

  it('MSW 출석 응답(개별 멘티 리스트)으로 멘티별 서면 행이 렌더된다', async () => {
    // 미션 출석 API는 개별 멘티 리스트(MOCK_ATTENDANCE_LIST)를 반환한다.
    const res = await fetch(
      `${BASE}/challenge/1/mission/1001/feedback/attendances`,
    );
    const body = await res.json();
    const { attendanceList } =
      challengeMissionFeedbackAttendanceListSchema.parse(body.data);

    const attendanceMap = new Map<string, WrittenMenteeAttendance[]>([
      [
        '1-1001',
        attendanceList.map((a) => ({
          id: a.id,
          name: a.name,
          status: a.status,
          feedbackStatus: a.feedbackStatus,
        })),
      ],
    ]);

    const writtenChallenge = {
      challengeId: 1,
      title: '기필코 경험정리 챌린지 21기',
      shortDesc: null,
      startDate: '2026-04-14',
      endDate: '2026-05-04',
      feedbackMissions: [
        {
          missionId: 1001,
          missionTitle: '1회차',
          th: 1,
          submittedCount: 0,
          notSubmittedCount: 0,
          feedbackStatusCounts: [],
        },
      ],
    };

    const { result } = renderHook(() =>
      useMergedFeedbackRows([writtenChallenge], [], attendanceMap),
    );

    const writtenRows = result.current.filter((r) => r.type === 'written');
    // MOCK_ATTENDANCE_LIST 멘티 수만큼 행이 펼쳐진다 (집계 '멘티 N명' 아님).
    expect(writtenRows.length).toBe(attendanceList.length);
    expect(writtenRows.map((r) => r.menteeNameLabel)).toEqual(
      expect.arrayContaining(attendanceList.map((a) => a.name)),
    );
    // 집계 라벨이 남아있지 않아야 한다.
    expect(writtenRows.some((r) => /멘티 \d+명/.test(r.menteeNameLabel))).toBe(
      false,
    );
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
