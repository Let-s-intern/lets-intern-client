/**
 * useMergedFeedbackRows — 1대1 라이브 멘토링 행 병합 검증 (Push 7-B).
 *
 * 1대1은 챌린지에 속하지 않아 11컬럼 스키마가 그대로 맞지 않는다. 맞지 않는 컬럼을
 * 무엇으로 채웠는지, 빈 칸이 남지 않는지, 서면·라이브와 섞였을 때 정렬이 흔들리지
 * 않는지를 고정한다.
 */
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { LiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import { deriveLiveMentoringBars } from '@/pages/schedule/hooks/useLiveMentoringData';
import type { PeriodBarData } from '@/pages/schedule/types';

import type { LiveFeedbackRound } from '../hooks/useLiveFeedbackList';
import {
  LIVE_MENTORING_CHALLENGE_LABEL,
  LIVE_MENTORING_DETAIL_DISABLED_REASON,
  LIVE_MENTORING_TH_LABEL,
  useMergedFeedbackRows,
} from '../hooks/useMergedFeedbackRows';

vi.mock('@/pages/schedule/constants/mockNow', () => ({
  currentNow: () => new Date('2026-05-04T09:45:00'),
  MOCK_NOW: '2026-05-04T09:45:00',
}));

function makeReservation(
  overrides: Partial<LiveMentoringReservation> = {},
): LiveMentoringReservation {
  return {
    applicationId: 91001,
    menteeId: 51001,
    menteeName: '김일대',
    productName: '자소서 실전 첨삭 멘토링',
    durationMinutes: 60,
    reservationStartAt: '2026-05-04T14:00:00',
    reservationEndAt: '2026-05-04T15:00:00',
    status: 'CONFIRMED',
    questionWritten: true,
    attachmentSubmitted: true,
    createDate: '2026-05-01T09:00:00',
    ...overrides,
  };
}

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

const liveRound: LiveFeedbackRound = {
  challengeId: 1,
  challengeTitle: '기필코 경험정리 챌린지 21기',
  th: 1,
  startDate: '2026-05-04',
  endDate: '2026-05-04',
  totalMentees: 1,
  completedCount: 0,
  inProgressCount: 0,
  waitingCount: 1,
  sessionBars: [liveSessionBar],
};

const renderRows = (reservations: LiveMentoringReservation[]) =>
  renderHook(() =>
    useMergedFeedbackRows([], [], undefined, undefined, reservations),
  ).result.current;

describe('1대1 행 — 컬럼 매핑', () => {
  it('예약 1건이 행 1개가 된다', () => {
    const rows = renderRows([makeReservation()]);

    expect(rows).toHaveLength(1);
    expect(rows[0].type).toBe('live-mentoring');
    expect(rows[0].id).toBe('live-mentoring-91001');
  });

  it('챌린지는 1대1 라이브 멘토링, 미션 회차는 해당 없음', () => {
    const [row] = renderRows([makeReservation()]);

    expect(row.challengeTitle).toBe(LIVE_MENTORING_CHALLENGE_LABEL);
    expect(row.challengeTitle).toBe('1대1 라이브 멘토링');
    expect(row.thLabel).toBe(LIVE_MENTORING_TH_LABEL);
    expect(row.thLabel).toBe('해당 없음');
  });

  it('멘티 예약은 항상 예약 완료다 (서버가 확정 건만 내린다)', () => {
    const [row] = renderRows([makeReservation()]);

    expect(row.reservationLabel).toBe('예약 완료');
  });

  it('멘티 제출 — 질문과 전달 파일을 제출물로 본다', () => {
    const [both] = renderRows([makeReservation()]);
    expect(both.submissionLabel).toBe('제출');

    const [questionOnly] = renderRows([
      makeReservation({ attachmentSubmitted: false }),
    ]);
    expect(questionOnly.submissionLabel).toBe('일부 제출');

    const [attachmentOnly] = renderRows([
      makeReservation({ questionWritten: false }),
    ]);
    expect(attachmentOnly.submissionLabel).toBe('일부 제출');

    const [neither] = renderRows([
      makeReservation({ questionWritten: false, attachmentSubmitted: false }),
    ]);
    expect(neither.submissionLabel).toBe('미제출');
  });

  it('피드백 일정은 날짜 + 시간 범위로 채운다', () => {
    const [row] = renderRows([makeReservation()]);

    expect(row.scheduleLabel).toBe('2026.05.04 14:00 ~ 15:00');
    expect(row.startTime).toBe('14:00');
    expect(row.endTime).toBe('15:00');
  });

  it('멘티 성명은 예약자 이름이다', () => {
    const [row] = renderRows([makeReservation({ menteeName: '박멘티' })]);

    expect(row.menteeNameLabel).toBe('박멘티');
  });

  it('상세는 잠기고 이유가 함께 실린다', () => {
    const [row] = renderRows([makeReservation()]);

    expect(row.canOpenDetail).toBe(false);
    expect(row.detailDisabledReason).toBe(
      LIVE_MENTORING_DETAIL_DISABLED_REASON,
    );
  });

  it('원본 예약을 source 에 그대로 싣는다', () => {
    const [row] = renderRows([makeReservation()]);

    expect(row.source).toEqual({
      type: 'live-mentoring',
      reservation: makeReservation(),
    });
  });
});

describe('1대1 행 — 빈 칸', () => {
  it('참여 두 컬럼 말고는 비지 않는다 (출석 정보가 응답에 없다)', () => {
    const [row] = renderRows([
      makeReservation({ questionWritten: false, attachmentSubmitted: false }),
    ]);

    expect(row.statusLabel).toBeTruthy();
    expect(row.statusTone).toBeTruthy();
    expect(row.reservationLabel).toBeTruthy();
    expect(row.submissionLabel).toBeTruthy();
    expect(row.challengeTitle).toBeTruthy();
    expect(row.thLabel).toBeTruthy();
    expect(row.scheduleLabel).toBeTruthy();
    expect(row.menteeNameLabel).toBeTruthy();

    expect(row.menteeParticipation).toBeNull();
    expect(row.mentorParticipation).toBeNull();
  });
});

describe('1대1 행 — 피드백 상태는 시각으로만 판정한다', () => {
  it('시작 전이면 진행 예정', () => {
    const [row] = renderRows([makeReservation()]);

    expect(row.statusLabel).toBe('진행 예정');
    expect(row.statusTone).toBe('liveWaiting');
  });

  it('진행 시각 안이면 진행 중', () => {
    const [row] = renderRows([
      makeReservation({
        reservationStartAt: '2026-05-04T09:00:00',
        reservationEndAt: '2026-05-04T10:00:00',
      }),
    ]);

    expect(row.statusLabel).toBe('진행 중');
    expect(row.statusTone).toBe('inProgress');
  });

  it('끝난 건은 진행 여부를 단정하지 않고 종료로 둔다', () => {
    const [row] = renderRows([
      makeReservation({
        reservationStartAt: '2026-05-03T09:00:00',
        reservationEndAt: '2026-05-03T10:00:00',
      }),
    ]);

    expect(row.statusLabel).toBe('종료');
    expect(row.statusTone).toBe('liveCompleted');
  });
});

describe('1대1 행 — 서면·라이브와 섞였을 때', () => {
  it('라이브 행과 함께 나오고 정렬 기준(날짜 내림차순 → 시간 오름차순)이 유지된다', () => {
    const { result } = renderHook(() =>
      useMergedFeedbackRows([], [liveRound], undefined, undefined, [
        // 같은 날 라이브 세션(10:00)보다 늦은 14:00
        makeReservation(),
        // 하루 뒤 — 날짜 내림차순이라 맨 앞으로 와야 한다
        makeReservation({
          applicationId: 91002,
          menteeName: '내일멘티',
          reservationStartAt: '2026-05-05T09:00:00',
          reservationEndAt: '2026-05-05T10:00:00',
        }),
      ]),
    );

    expect(result.current.map((r) => `${r.type}:${r.startTime}`)).toEqual([
      'live-mentoring:09:00',
      'live:10:00',
      'live-mentoring:14:00',
    ]);
  });

  it('예약이 없으면 1대1 행도 없다 (다른 행은 그대로)', () => {
    const { result } = renderHook(() => useMergedFeedbackRows([], [liveRound]));

    expect(result.current.some((r) => r.type === 'live-mentoring')).toBe(false);
    expect(result.current).toHaveLength(1);
  });
});

describe('1대1 행 — 캘린더와 같은 시각을 보여 준다', () => {
  it('오프셋이 붙은 ISO 도 캘린더 카드와 날짜·시각이 일치한다', () => {
    const reservation = makeReservation({
      reservationStartAt: '2026-05-04T01:00:00Z',
      reservationEndAt: '2026-05-04T02:00:00Z',
    });

    const [row] = renderRows([reservation]);
    const [bar] = deriveLiveMentoringBars([reservation]);

    expect(row.startDate).toBe(bar.startDate);
    expect(row.startTime).toBe(bar.liveMentoring?.startTime);
    expect(row.endTime).toBe(bar.liveMentoring?.endTime);
  });
});
