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
import {
  useMergedFeedbackRows,
  type WrittenMenteeAttendance,
} from '../hooks/useMergedFeedbackRows';

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
        feedbackStatusCounts: [{ feedbackStatus: 'COMPLETED', count: 5 }],
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

// 서면 멘티별 출석 맵 — `${challengeId}-${missionId}` 키.
// mission 1001: 제출 2명(완료/진행중) + 미제출 1명. mission 1003: 빈 미션.
const writtenAttendanceMap = new Map<string, WrittenMenteeAttendance[]>([
  [
    '1-1001',
    [
      {
        id: 11,
        name: '이지수',
        status: 'PRESENT',
        feedbackStatus: 'COMPLETED',
      },
      {
        id: 12,
        name: '김민준',
        status: 'PRESENT',
        feedbackStatus: 'IN_PROGRESS',
      },
      { id: 13, name: '최지훈', status: 'ABSENT', feedbackStatus: 'WAITING' },
    ],
  ],
]);

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
  liveFeedback: {
    id: 101,
    menteeName: '이지수',
    startTime: '10:00',
    endTime: '10:30',
  },
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
  it('출석 맵이 없으면 서면 행은 0개다 (graceful — 로딩/미주입)', () => {
    const { result } = renderHook(() => useMergedFeedbackRows(writtenMock, []));
    expect(result.current.filter((r) => r.type === 'written').length).toBe(0);
  });

  it('서면 행은 출석 멘티 1명당 1행으로 펼쳐진다 (라이브처럼)', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows(writtenMock, [], writtenAttendanceMap),
    );

    const writtenRows = result.current.filter((r) => r.type === 'written');
    // mission 1001 멘티 3명 → 3행. mission 1003 은 출석 없음 → 0행.
    expect(writtenRows.length).toBe(3);
    expect(writtenRows.map((r) => r.menteeNameLabel).sort()).toEqual(
      ['김민준', '이지수', '최지훈'].sort(),
    );
    for (const r of writtenRows) {
      expect(r.reservationLabel).toBeNull();
      expect(r.menteeParticipation).toBeNull();
      expect(r.mentorParticipation).toBeNull();
      expect(r.startTime).toBeNull();
      expect(r.endTime).toBeNull();
    }
  });

  it('서면 멘티 행 — status/feedbackStatus 기준 제출·상태 매핑', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows(writtenMock, [], writtenAttendanceMap),
    );

    const completed = result.current.find((r) => r.id === 'written-1-1001-11');
    const inProgress = result.current.find((r) => r.id === 'written-1-1001-12');
    const absent = result.current.find((r) => r.id === 'written-1-1001-13');

    // 제출 + COMPLETED → 완료(서면 어휘·라이브 색), 상세 열림
    expect(completed?.submissionLabel).toBe('제출');
    expect(completed?.statusLabel).toBe('완료');
    expect(completed?.statusTone).toBe('liveCompleted');
    expect(completed?.canOpenDetail).toBe(true);

    // 제출 + IN_PROGRESS → 진행 중
    expect(inProgress?.submissionLabel).toBe('제출');
    expect(inProgress?.statusLabel).toBe('진행 중');
    expect(inProgress?.statusTone).toBe('inProgress');

    // ABSENT → 미제출, 진행 전(서면 어휘·라이브 색), 상세 닫힘
    expect(absent?.submissionLabel).toBe('미제출');
    expect(absent?.statusLabel).toBe('진행 전');
    expect(absent?.statusTone).toBe('liveWaiting');
    expect(absent?.canOpenDetail).toBe(false);
  });

  it('서면 멘티 행도 미션 모달 진입용 source(written)를 유지한다', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows(writtenMock, [], writtenAttendanceMap),
    );
    const row = result.current.find((r) => r.id === 'written-1-1001-11');
    expect(row?.source).toEqual({
      type: 'written',
      challengeId: 1,
      missionId: 1001,
      missionTh: 1,
      challengeTitle: '기필코 경험정리 챌린지 21기',
    });
    expect(row?.thLabel).toBe('1회차');
  });

  it('missionRangeMap 미주입 시 서면 행 일정은 "-"다', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows(writtenMock, [], writtenAttendanceMap),
    );
    const row = result.current.find((r) => r.id === 'written-1-1001-11');
    expect(row?.scheduleLabel).toBe('-');
  });

  it('missionRangeMap 주입 시 서면 행 일정이 채워진다', () => {
    const missionRangeMap = new Map<number, { start: string; end: string }>([
      [1001, { start: '2026-05-06', end: '2026-05-08' }],
    ]);
    const { result } = renderHook(() =>
      useMergedFeedbackRows(
        writtenMock,
        [],
        writtenAttendanceMap,
        missionRangeMap,
      ),
    );
    const row = result.current.find((r) => r.id === 'written-1-1001-11');
    expect(row?.scheduleLabel).toBe('2026.05.06 ~ 2026.05.08');
    expect(row?.startDate).toBe('2026-05-06');
  });

  it('라이브 행은 멘티 제출(submissionLabel)이 null이다', () => {
    const { result } = renderHook(() => useMergedFeedbackRows([], [liveRound]));

    const liveRows = result.current.filter((r) => r.type === 'live');
    expect(liveRows.length).toBe(3);
    for (const r of liveRows) {
      expect(r.submissionLabel).toBeNull();
      expect(r.reservationLabel).toBe('예약 완료');
    }
  });

  it('라이브 행 status 매핑 — completed/mentee-absent/시간 기준 분기', () => {
    const { result } = renderHook(() => useMergedFeedbackRows([], [liveRound]));

    const completed = result.current.find((r) => r.id === 'live-102');
    const absent = result.current.find((r) => r.id === 'live-103');
    // 10:00~10:30, now=09:45 → 진행 전
    const waiting = result.current.find((r) => r.id === 'live-101');

    expect(completed?.statusLabel).toBe('진행 완료');
    expect(completed?.statusTone).toBe('liveCompleted');
    expect(completed?.menteeParticipation).toBe('참여');
    expect(completed?.mentorParticipation).toBe('참여');

    expect(absent?.statusLabel).toBe('미진행');
    expect(absent?.statusTone).toBe('liveMissed');
    expect(absent?.menteeParticipation).toBe('불참');
    expect(absent?.mentorParticipation).toBe('참여');

    expect(waiting?.statusLabel).toBe('진행 예정');
    expect(waiting?.statusTone).toBe('liveWaiting');
    expect(waiting?.menteeParticipation).toBeNull();
    expect(waiting?.mentorParticipation).toBeNull();
  });

  // ── 버그 회귀: 실데이터(rawStatus) 기반 멘티 제출 / 멘토 불참 ──
  // now=2026-05-04 09:45 (목킹). 08:00~08:30 세션은 종료된 상태.
  const realLiveRound = (fields: {
    id: number;
    attendanceStatus?: 'PRESENT' | 'UPDATED' | 'LATE' | 'ABSENT';
    mentorStatus?: 'PENDING' | 'PRESENT' | 'ABSENT';
    menteeStatus?: 'PENDING' | 'PRESENT' | 'ABSENT';
  }): LiveFeedbackRound => ({
    ...liveRound,
    sessionBars: [
      {
        ...liveSessionBar,
        missionId: -fields.id,
        liveFeedback: {
          id: fields.id,
          menteeName: '테스트멘티',
          startTime: '08:00',
          endTime: '08:30',
          rawStatus: 'RESERVED',
          attendanceStatus: fields.attendanceStatus,
          mentorStatus: fields.mentorStatus,
          menteeStatus: fields.menteeStatus,
        },
      },
    ],
  });
  const firstLiveRow = (round: LiveFeedbackRound) =>
    renderHook(() => useMergedFeedbackRows([], [round])).result.current.find(
      (r) => r.type === 'live',
    );

  it('멘티 제출: attendanceStatus ABSENT→미제출, PRESENT→제출, 없으면 null', () => {
    expect(
      firstLiveRow(realLiveRound({ id: 201, attendanceStatus: 'ABSENT' }))
        ?.submissionLabel,
    ).toBe('미제출');
    expect(
      firstLiveRow(realLiveRound({ id: 202, attendanceStatus: 'PRESENT' }))
        ?.submissionLabel,
    ).toBe('제출');
    // 상세 미병합(attendanceStatus 없음) → null
    expect(
      firstLiveRow(realLiveRound({ id: 203 }))?.submissionLabel,
    ).toBeNull();
  });

  it('멘토 불참: 종료된 세션 + mentorStatus PENDING(노쇼) → 멘토 참여=불참', () => {
    const row = firstLiveRow(
      realLiveRound({
        id: 204,
        mentorStatus: 'PENDING',
        menteeStatus: 'PRESENT',
      }),
    );
    expect(row?.mentorParticipation).toBe('불참');
    expect(row?.menteeParticipation).toBe('참여');
  });

  it('정렬: startDate DESC(최신 먼저) → startTime ASC → menteeName ASC', () => {
    const laterDateSession: PeriodBarData = {
      ...liveSessionBar,
      missionId: -301,
      startDate: '2026-05-06',
      liveFeedback: {
        id: 301,
        menteeName: '산',
        startTime: '11:00',
        endTime: '11:30',
      },
    };
    const earlySession: PeriodBarData = {
      ...liveSessionBar,
      missionId: -201,
      startDate: '2026-05-05',
      liveFeedback: {
        id: 201,
        menteeName: '하늘',
        startTime: '09:00',
        endTime: '09:30',
      },
    };
    const lateSession: PeriodBarData = {
      ...liveSessionBar,
      missionId: -202,
      startDate: '2026-05-05',
      liveFeedback: {
        id: 202,
        menteeName: '바다',
        startTime: '10:00',
        endTime: '10:30',
      },
    };
    const sameTimeA: PeriodBarData = {
      ...liveSessionBar,
      missionId: -203,
      startDate: '2026-05-05',
      liveFeedback: {
        id: 203,
        menteeName: 'A',
        startTime: '09:00',
        endTime: '09:30',
      },
    };

    const round: LiveFeedbackRound = {
      ...liveRound,
      sessionBars: [lateSession, earlySession, sameTimeA, laterDateSession],
    };

    const { result } = renderHook(() => useMergedFeedbackRows([], [round]));
    expect(result.current.map((r) => r.id)).toEqual([
      'live-301', // 5/6 (최신 날짜 먼저)
      'live-203', // 5/5 09:00 'A'
      'live-201', // 5/5 09:00 '하늘'
      'live-202', // 5/5 10:00 '바다'
    ]);
  });

  it('서면 + 라이브 혼합 시 둘 다 정렬 결과에 포함된다', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows(writtenMock, [liveRound], writtenAttendanceMap),
    );

    // 서면 멘티 3행 + 라이브 3행
    expect(result.current.length).toBe(6);
    const types = result.current.map((r) => r.type);
    expect(types).toContain('written');
    expect(types).toContain('live');
  });

  it('빈 입력은 빈 배열을 반환한다', () => {
    const { result } = renderHook(() => useMergedFeedbackRows([], []));
    expect(result.current).toEqual([]);
  });
});
