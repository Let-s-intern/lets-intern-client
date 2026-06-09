/**
 * Push 1 / 1.1.T1 — 라이브 피드백 파생 로직 단위 테스트.
 *
 * 검증 포인트:
 *  - 세션 → 'live-feedback' 바 매핑 (missionId = -feedbackId, liveFeedback.id = feedbackId)
 *  - programTitle 묶음 → 'live-feedback-period' 바 (min/max, th=1)
 *  - 슬롯 → 글로벌 'live-feedback-mentor-open' 바 1개
 *  - 상태 매핑 (COMPLETED / CANCELED+ABSENT / RESERVED)
 */
import { describe, expect, it } from 'vitest';

import type {
  FeedbackMentor,
  FeedbackSlot,
} from '@/api/feedback/feedbackSchema';

import { deriveLiveFeedbackBars } from '../hooks/useLiveFeedbackData';

function makeSession(overrides: Partial<FeedbackMentor>): FeedbackMentor {
  return {
    feedbackId: 101,
    startDate: '2026-05-04T10:00:00',
    endDate: '2026-05-04T10:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '기필코 경험정리 챌린지 21기',
    menteeName: '이지수',
    ...overrides,
  };
}

function makeSlot(overrides: Partial<FeedbackSlot>): FeedbackSlot {
  return {
    feedbackSlotId: 1,
    startDate: '2026-04-24T09:00:00',
    endDate: '2026-04-24T18:00:00',
    status: 'OPEN',
    ...overrides,
  };
}

describe('deriveLiveFeedbackBars', () => {
  it('세션을 live-feedback 바로 매핑하고 missionId=-feedbackId, liveFeedback.id=feedbackId 를 보존한다', () => {
    const bars = deriveLiveFeedbackBars([makeSession({ feedbackId: 555 })], []);
    const session = bars.find((b) => b.barType === 'live-feedback');

    expect(session).toBeDefined();
    expect(session!.missionId).toBe(-555);
    expect(session!.liveFeedback?.id).toBe(555);
    expect(session!.liveFeedback?.menteeName).toBe('이지수');
    expect(session!.liveFeedback?.startTime).toBe('10:00');
    expect(session!.liveFeedback?.endTime).toBe('10:30');
    expect(session!.th).toBe(1);
  });

  it('missionId(-feedbackId)와 liveFeedback.id(feedbackId)가 모달 상세 fetch 정합을 유지한다', () => {
    const bars = deriveLiveFeedbackBars([makeSession({ feedbackId: 42 })], []);
    const session = bars.find((b) => b.barType === 'live-feedback')!;
    // 모달은 bar.liveFeedback.id 로 detail fetch → -missionId 로 복원 가능해야 함
    expect(-session.missionId).toBe(session.liveFeedback!.id);
  });

  it('같은 programTitle 세션을 하나의 challengeId 그룹 + 단일 period 바로 묶는다', () => {
    const bars = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 1,
          startDate: '2026-05-04T10:00:00',
          endDate: '2026-05-04T10:30:00',
        }),
        makeSession({
          feedbackId: 2,
          startDate: '2026-05-06T11:00:00',
          endDate: '2026-05-06T11:30:00',
        }),
      ],
      [],
    );

    const periods = bars.filter((b) => b.barType === 'live-feedback-period');
    expect(periods).toHaveLength(1);
    expect(periods[0].th).toBe(1);
    expect(periods[0].startDate).toBe('2026-05-04');
    expect(periods[0].endDate).toBe('2026-05-06');

    const sessions = bars.filter((b) => b.barType === 'live-feedback');
    // 같은 그룹 → 동일 challengeId
    expect(sessions[0].challengeId).toBe(sessions[1].challengeId);
    // period 바도 같은 challengeId
    expect(periods[0].challengeId).toBe(sessions[0].challengeId);
  });

  it('서로 다른 programTitle 은 별도 challengeId·period 바로 분리한다', () => {
    const bars = deriveLiveFeedbackBars(
      [
        makeSession({ feedbackId: 1, programTitle: 'A 챌린지' }),
        makeSession({ feedbackId: 2, programTitle: 'B 챌린지' }),
      ],
      [],
    );

    const periods = bars.filter((b) => b.barType === 'live-feedback-period');
    expect(periods).toHaveLength(2);
    expect(periods[0].challengeId).not.toBe(periods[1].challengeId);
  });

  it('합성 challengeId 는 서면 실 challengeId(양수)와 충돌하지 않도록 음수다', () => {
    const bars = deriveLiveFeedbackBars([makeSession({})], [makeSlot({})]);
    for (const bar of bars) {
      expect(bar.challengeId).toBeLessThan(0);
    }
  });

  it('슬롯 전체 min/max 로 글로벌 live-feedback-mentor-open 바 1개를 만든다', () => {
    const bars = deriveLiveFeedbackBars(
      [],
      [
        makeSlot({
          feedbackSlotId: 1,
          startDate: '2026-04-24T09:00:00',
          endDate: '2026-04-24T18:00:00',
        }),
        makeSlot({
          feedbackSlotId: 2,
          startDate: '2026-04-27T09:00:00',
          endDate: '2026-04-28T18:00:00',
        }),
      ],
    );

    const open = bars.filter((b) => b.barType === 'live-feedback-mentor-open');
    expect(open).toHaveLength(1);
    expect(open[0].startDate).toBe('2026-04-24');
    expect(open[0].endDate).toBe('2026-04-28');
  });

  it('mentee-open 바는 생성하지 않는다', () => {
    const bars = deriveLiveFeedbackBars([makeSession({})], [makeSlot({})]);
    expect(bars.some((b) => b.barType === 'live-feedback-mentee-open')).toBe(
      false,
    );
  });

  it('상태 매핑: COMPLETED→completed, CANCELED+menteeABSENT→mentee-absent, CANCELED+mentorABSENT→mentor-absent', () => {
    const completed = deriveLiveFeedbackBars(
      [makeSession({ feedbackId: 1, status: 'COMPLETED' })],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(completed!.liveFeedback?.status).toBe('completed');

    const menteeAbsent = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 2,
          status: 'CANCELED',
          menteeStatus: 'ABSENT',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(menteeAbsent!.liveFeedback?.status).toBe('mentee-absent');

    const mentorAbsent = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 3,
          status: 'CANCELED',
          mentorStatus: 'ABSENT',
          menteeStatus: 'PRESENT',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(mentorAbsent!.liveFeedback?.status).toBe('mentor-absent');
  });

  it('상태 매핑: CANCELED(불참 표기 없는 단순 취소)→cancelled("취소" 배지)', () => {
    const canceled = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 4,
          status: 'CANCELED',
          mentorStatus: 'PENDING',
          menteeStatus: 'PENDING',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(canceled!.liveFeedback?.status).toBe('cancelled');
  });

  it('종료된 RESERVED + 양측 참여 → completed (지난 라이브가 진행 예정으로 보이던 버그 보정)', () => {
    const bar = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 7,
          status: 'RESERVED',
          mentorStatus: 'PRESENT',
          menteeStatus: 'PRESENT',
          startDate: '2020-01-01T10:00:00',
          endDate: '2020-01-01T10:30:00',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(bar!.liveFeedback?.status).toBe('completed');
  });

  it('종료된 RESERVED + 출석 미체크 → waiting 이 아니라 미진행 처리된다', () => {
    const bar = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 8,
          status: 'RESERVED',
          startDate: '2020-01-01T10:00:00',
          endDate: '2020-01-01T10:30:00',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(bar!.liveFeedback?.status).not.toBe('waiting');
    expect(bar!.liveFeedback?.status).toBe('cancelled');
  });

  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(deriveLiveFeedbackBars([], [])).toEqual([]);
  });
});
