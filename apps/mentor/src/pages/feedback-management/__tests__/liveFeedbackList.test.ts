/**
 * Push 2 / 2.1.T1 — 라이브 피드백 회차 목록 훅 그룹핑 검증.
 *
 * BE 멘토 목록(`useFeedbackMentorListQuery`)을 mock 하고,
 * 옵션 A(programTitle 묶기 + 단일 회차)로 챌린지/세션이 구성되는지 검증한다.
 */
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

import { useLiveFeedbackList } from '../hooks/useLiveFeedbackList';

const mockUseFeedbackMentorListQuery = vi.fn();

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorListQuery: () => mockUseFeedbackMentorListQuery(),
}));

function makeFeedback(overrides: Partial<FeedbackMentor> = {}): FeedbackMentor {
  return {
    feedbackId: 1,
    startDate: '2026-05-20T10:00:00',
    endDate: '2026-05-20T10:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    menteeName: '이지수',
    ...overrides,
  };
}

function setList(list: FeedbackMentor[] | undefined) {
  mockUseFeedbackMentorListQuery.mockReturnValue({ data: list });
}

describe('useLiveFeedbackList (programTitle 그룹핑 + 회차(th) 분리)', () => {
  it('data 가 undefined 면 빈 결과를 반환한다', () => {
    setList(undefined);
    const { result } = renderHook(() => useLiveFeedbackList());
    expect(result.current.challenges).toEqual([]);
    expect(result.current.allSessionBars).toEqual([]);
  });

  it('programTitle 로 챌린지를 묶고 세션 수를 집계한다', () => {
    setList([
      makeFeedback({ feedbackId: 1, programTitle: '자소서 챌린지 7기' }),
      makeFeedback({
        feedbackId: 2,
        programTitle: '자소서 챌린지 7기',
        startDate: '2026-05-20T11:00:00',
        endDate: '2026-05-20T11:30:00',
        menteeName: '김민준',
      }),
      makeFeedback({
        feedbackId: 3,
        programTitle: '커리어 설계 챌린지 5기',
        startDate: '2026-05-21T14:00:00',
        endDate: '2026-05-21T14:30:00',
        menteeName: '박서연',
      }),
    ]);

    const { result } = renderHook(() => useLiveFeedbackList());

    // 2개 programTitle → 2개 챌린지
    expect(result.current.challenges).toHaveLength(2);

    const first = result.current.challenges[0];
    expect(first.title).toBe('자소서 챌린지 7기');
    expect(first.rounds).toHaveLength(1); // 동일 th(미지정→1) → 단일 회차
    expect(first.rounds[0].th).toBe(1);
    expect(first.rounds[0].totalMentees).toBe(2);

    const second = result.current.challenges[1];
    expect(second.title).toBe('커리어 설계 챌린지 5기');
    expect(second.rounds[0].totalMentees).toBe(1);

    // 전체 세션 바: 3건, liveFeedback.id 는 feedbackId 와 동일
    expect(result.current.allSessionBars).toHaveLength(3);
    const ids = result.current.allSessionBars.map((b) => b.liveFeedback?.id);
    expect(ids).toEqual(expect.arrayContaining([1, 2, 3]));
  });

  it('같은 챌린지의 세션을 회차(th)별로 분리해 회차마다 라운드를 만든다', () => {
    setList([
      // 1차 세션 2건
      makeFeedback({ feedbackId: 1, th: 1, menteeName: '이지수' }),
      makeFeedback({
        feedbackId: 2,
        th: 1,
        startDate: '2026-05-20T11:00:00',
        endDate: '2026-05-20T11:30:00',
        menteeName: '김민준',
      }),
      // 2차 세션 1건 (같은 programTitle)
      makeFeedback({
        feedbackId: 3,
        th: 2,
        startDate: '2026-05-27T14:00:00',
        endDate: '2026-05-27T14:30:00',
        menteeName: '박서연',
      }),
    ]);

    const { result } = renderHook(() => useLiveFeedbackList());

    // 단일 챌린지, 회차 2개(1차/2차)
    expect(result.current.challenges).toHaveLength(1);
    const rounds = result.current.challenges[0].rounds;
    expect(rounds.map((r) => r.th)).toEqual([1, 2]); // th 오름차순
    expect(rounds[0].totalMentees).toBe(2);
    expect(rounds[1].totalMentees).toBe(1);
    // 회차 기간은 해당 th 세션 범위로만 산출
    expect(rounds[1].startDate).toBe('2026-05-27');
    expect(rounds[1].endDate).toBe('2026-05-27');
  });

  it('status/출석 조합으로 회차 카운트를 산출한다', () => {
    setList([
      // COMPLETED → completed
      makeFeedback({ feedbackId: 10, status: 'COMPLETED' }),
      // CANCELED + 멘티 ABSENT → mentee-absent (waiting 으로 분류, completed 아님)
      makeFeedback({
        feedbackId: 11,
        status: 'CANCELED',
        menteeStatus: 'ABSENT',
        startDate: '2026-05-20T12:00:00',
        endDate: '2026-05-20T12:30:00',
      }),
      // RESERVED → undefined (waiting)
      makeFeedback({
        feedbackId: 12,
        status: 'RESERVED',
        startDate: '2026-05-20T13:00:00',
        endDate: '2026-05-20T13:30:00',
      }),
    ]);

    const { result } = renderHook(() => useLiveFeedbackList());
    const round = result.current.challenges[0].rounds[0];

    expect(round.totalMentees).toBe(3);
    expect(round.completedCount).toBe(1);
    // in-progress/지각 세분 상태는 BE에 없음 → 0
    expect(round.inProgressCount).toBe(0);
    expect(round.waitingCount).toBe(2);
  });

  it('회차 기간은 세션들의 min(startDate)~max(endDate) 로 산출한다', () => {
    setList([
      makeFeedback({
        feedbackId: 20,
        startDate: '2026-05-22T10:00:00',
        endDate: '2026-05-22T10:30:00',
      }),
      makeFeedback({
        feedbackId: 21,
        startDate: '2026-05-20T10:00:00',
        endDate: '2026-05-20T10:30:00',
      }),
    ]);

    const { result } = renderHook(() => useLiveFeedbackList());
    const round = result.current.challenges[0].rounds[0];
    expect(round.startDate).toBe('2026-05-20');
    expect(round.endDate).toBe('2026-05-22');
  });
});

describe('useLiveFeedbackList — status/출석 → 세션 status 매핑 (2.2)', () => {
  function firstBar(list: FeedbackMentor[]) {
    setList(list);
    const { result } = renderHook(() => useLiveFeedbackList());
    return result.current.allSessionBars[0].liveFeedback;
  }

  it('COMPLETED → completed, 시간은 HH:mm 으로 파싱', () => {
    const lf = firstBar([makeFeedback({ status: 'COMPLETED' })]);
    expect(lf?.status).toBe('completed');
    expect(lf?.startTime).toBe('10:00');
    expect(lf?.endTime).toBe('10:30');
  });

  it('CANCELED + 멘티 ABSENT → mentee-absent', () => {
    const lf = firstBar([
      makeFeedback({ status: 'CANCELED', menteeStatus: 'ABSENT' }),
    ]);
    expect(lf?.status).toBe('mentee-absent');
  });

  it('CANCELED + 멘토 ABSENT → mentor-absent', () => {
    const lf = firstBar([
      makeFeedback({
        status: 'CANCELED',
        menteeStatus: 'PRESENT',
        mentorStatus: 'ABSENT',
      }),
    ]);
    expect(lf?.status).toBe('mentor-absent');
  });

  it('RESERVED → undefined (소비처 시간 기준 분기)', () => {
    const lf = firstBar([makeFeedback({ status: 'RESERVED' })]);
    expect(lf?.status).toBeUndefined();
  });

  it('liveFeedback.id 는 feedbackId 를 그대로 사용한다 (모달 단건 상세 fetch 키)', () => {
    const lf = firstBar([makeFeedback({ feedbackId: 777 })]);
    expect(lf?.id).toBe(777);
  });
});
