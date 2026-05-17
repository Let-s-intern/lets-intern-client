/**
 * useMergedFeedbackRows — 평면화 매핑 / 정렬 / 빈 컬럼 분기 검증.
 *
 * 직접 `useMemo`만 사용하는 hook이지만 React 환경 없이도 호출 가능하므로
 * (의존성 useMentorMissionFeedbackListQuery는 호출자 측이라 본 테스트 범위 외)
 * renderHook 없이 함수처럼 호출한다. 단, 내부 React.useMemo 때문에 renderHook을 사용한다.
 */

import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import type { PeriodBarData } from '@/pages/schedule/types';

import type { LiveFeedbackRound } from '../hooks/useLiveFeedbackList';
import { useMergedFeedbackRows } from '../hooks/useMergedFeedbackRows';

// currentNow 고정 — 정렬·시간 분기 안정성 확보
vi.mock('@/pages/schedule/constants/mockNow', () => ({
  currentNow: () => new Date('2026-05-04T09:45:00'),
  MOCK_NOW: '2026-05-04T09:45:00',
}));

type Challenge = MentorFeedbackManagement['challengeList'][number];

const writtenMock: Challenge[] = [
  {
    challengeId: 1,
    title: '기필코 경험정리 챌린지 21기',
    shortDesc: null,
    startDate: '2026-04-14',
    endDate: '2026-05-04',
    feedbackMissions: [
      {
        missionId: 1001,
        missionTitle: '1회차 — 경험 리스트 작성',
        th: 1,
        submittedCount: 5,
        notSubmittedCount: 2,
        feedbackStatusCounts: [
          { feedbackStatus: 'COMPLETED', count: 5 },
        ],
      },
      {
        missionId: 1003,
        missionTitle: '3회차 — 자소서 초안 작성',
        th: 3,
        submittedCount: 0,
        notSubmittedCount: 0,
        feedbackStatusCounts: [],
      },
    ],
  },
];

const liveSessionBar: PeriodBarData = {
  barType: 'live-feedback',
  challengeId: 1,
  missionId: -101,
  challengeTitle: '기필코 경험정리 챌린지 21기',
  th: 1,
  startDate: '2026-05-04',
  endDate: '2026-05-04',
  feedbackStartDate: '2026-05-04',
  feedbackDeadline: '2026-05-04',
  submittedCount: 0,
  notSubmittedCount: 0,
  waitingCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  liveFeedback: { id: 101, menteeName: '이지수', startTime: '10:00', endTime: '10:30' },
};

const liveCompletedBar: PeriodBarData = {
  ...liveSessionBar,
  missionId: -102,
  liveFeedback: {
    id: 102,
    menteeName: '김민준',
    startTime: '11:00',
    endTime: '11:30',
    status: 'completed',
  },
};

const liveAbsentBar: PeriodBarData = {
  ...liveSessionBar,
  missionId: -103,
  liveFeedback: {
    id: 103,
    menteeName: '박서연',
    startTime: '14:00',
    endTime: '14:30',
    status: 'mentee-absent',
  },
};

const liveRound: LiveFeedbackRound = {
  challengeId: 1,
  challengeTitle: '기필코 경험정리 챌린지 21기',
  th: 1,
  startDate: '2026-05-04',
  endDate: '2026-05-06',
  totalMentees: 3,
  completedCount: 1,
  inProgressCount: 0,
  waitingCount: 2,
  sessionBars: [liveSessionBar, liveCompletedBar, liveAbsentBar],
};

describe('useMergedFeedbackRows', () => {
  it('서면 행은 멘티예약/멘티참여/멘토참여가 null이다', () => {
    const { result } = renderHook(() => useMergedFeedbackRows(writtenMock, []));

    const writtenRows = result.current.filter((r) => r.type === 'written');
    expect(writtenRows.length).toBe(2);
    for (const r of writtenRows) {
      expect(r.reservationLabel).toBeNull();
      expect(r.menteeParticipation).toBeNull();
      expect(r.mentorParticipation).toBeNull();
      expect(r.startTime).toBeNull();
      expect(r.endTime).toBeNull();
    }
  });

  it('서면 행은 submittedCount > 0일 때 canOpenDetail=true', () => {
    const { result } = renderHook(() => useMergedFeedbackRows(writtenMock, []));

    const row1001 = result.current.find((r) =>
      r.id.includes('written-1-1001'),
    );
    const row1003 = result.current.find((r) =>
      r.id.includes('written-1-1003'),
    );
    expect(row1001?.canOpenDetail).toBe(true);
    expect(row1001?.submissionLabel).toBe('제출');
    expect(row1003?.canOpenDetail).toBe(false);
    expect(row1003?.submissionLabel).toBe('미제출');
  });

  it('라이브 행은 멘티 제출(submissionLabel)이 null이다', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows([], [liveRound]),
    );

    const liveRows = result.current.filter((r) => r.type === 'live');
    expect(liveRows.length).toBe(3);
    for (const r of liveRows) {
      expect(r.submissionLabel).toBeNull();
      expect(r.reservationLabel).toBe('예약 완료');
    }
  });

  it('라이브 행 status 매핑 — completed/mentee-absent/시간 기준 분기', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows([], [liveRound]),
    );

    const completed = result.current.find((r) => r.id === 'live-102');
    const absent = result.current.find((r) => r.id === 'live-103');
    // 10:00~10:30, now=09:45 → 진행 전
    const waiting = result.current.find((r) => r.id === 'live-101');

    expect(completed?.statusLabel).toBe('완료');
    expect(completed?.statusTone).toBe('completed');
    expect(completed?.menteeParticipation).toBe('참여');
    expect(completed?.mentorParticipation).toBe('참여');

    expect(absent?.statusLabel).toBe('미완료');
    expect(absent?.statusTone).toBe('absent');
    expect(absent?.menteeParticipation).toBe('불참');
    expect(absent?.mentorParticipation).toBe('참여');

    expect(waiting?.statusLabel).toBe('진행 전');
    expect(waiting?.statusTone).toBe('waiting');
    expect(waiting?.menteeParticipation).toBeNull();
    expect(waiting?.mentorParticipation).toBeNull();
  });

  it('정렬: startDate ASC → startTime ASC → menteeName ASC', () => {
    const earlySession: PeriodBarData = {
      ...liveSessionBar,
      missionId: -201,
      startDate: '2026-05-05',
      liveFeedback: { id: 201, menteeName: '하늘', startTime: '09:00', endTime: '09:30' },
    };
    const lateSession: PeriodBarData = {
      ...liveSessionBar,
      missionId: -202,
      startDate: '2026-05-05',
      liveFeedback: { id: 202, menteeName: '바다', startTime: '10:00', endTime: '10:30' },
    };
    const sameTimeA: PeriodBarData = {
      ...liveSessionBar,
      missionId: -203,
      startDate: '2026-05-05',
      liveFeedback: { id: 203, menteeName: 'A', startTime: '09:00', endTime: '09:30' },
    };

    const round: LiveFeedbackRound = {
      ...liveRound,
      sessionBars: [lateSession, earlySession, sameTimeA],
    };

    const { result } = renderHook(() => useMergedFeedbackRows([], [round]));
    expect(result.current.map((r) => r.id)).toEqual([
      'live-203', // 5/5 09:00 'A'
      'live-201', // 5/5 09:00 '하늘'
      'live-202', // 5/5 10:00 '바다'
    ]);
  });

  it('서면 + 라이브 혼합 시 둘 다 정렬 결과에 포함된다', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows(writtenMock, [liveRound]),
    );

    // 서면 2개 + 라이브 3개
    expect(result.current.length).toBe(5);
    const types = result.current.map((r) => r.type);
    expect(types).toContain('written');
    expect(types).toContain('live');
  });

  it('빈 입력은 빈 배열을 반환한다', () => {
    const { result } = renderHook(() => useMergedFeedbackRows([], []));
    expect(result.current).toEqual([]);
  });
});
