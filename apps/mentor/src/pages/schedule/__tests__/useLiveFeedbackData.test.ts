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
  FeedbackMentorWithAttendance,
  FeedbackSlot,
} from '@/api/feedback/feedbackSchema';

import { deriveLiveFeedbackBars } from '../hooks/useLiveFeedbackData';

function makeSession(
  overrides: Partial<FeedbackMentorWithAttendance>,
): FeedbackMentorWithAttendance {
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

  it('미션 시작일이 있으면 오픈 기간 바를 미션시작 -3d~-2d 로 확정한다(표 §4)', () => {
    const bars = deriveLiveFeedbackBars(
      [
        makeSession({
          missionStartDate: '2026-05-10T00:00:00',
          missionEndDate: '2026-05-16T23:59:59',
        }),
      ],
      // 슬롯이 있어도 미션 앵커가 우선 → 슬롯 min/max 폴백 바는 만들지 않는다.
      [makeSlot({})],
    );

    const open = bars.filter((b) => b.barType === 'live-feedback-mentor-open');
    expect(open).toHaveLength(1);
    // 미션시작 5/10 → 오픈 기간 5/7(−3d) ~ 5/8(−2d)
    expect(open[0].startDate).toBe('2026-05-07');
    expect(open[0].endDate).toBe('2026-05-08');
    // D-day 앵커도 오픈 시작일
    expect(open[0].feedbackStartDate).toBe('2026-05-07');
  });

  it('mentee-open 바는 생성하지 않는다', () => {
    const bars = deriveLiveFeedbackBars([makeSession({})], [makeSlot({})]);
    expect(bars.some((b) => b.barType === 'live-feedback-mentee-open')).toBe(
      false,
    );
  });

  it('상태 매핑: COMPLETED→completed, CANCELED(예약취소)→cancelled(취소)', () => {
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
    expect(menteeAbsent!.liveFeedback?.status).toBe('cancelled');

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
    expect(mentorAbsent!.liveFeedback?.status).toBe('cancelled');
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

  it('종료된 RESERVED + 멘토 출석 + 멘티 불참 → completed (멘토 출석만으로 완료, 멘티 무관)', () => {
    const bar = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 9,
          status: 'RESERVED',
          mentorStatus: 'PRESENT',
          menteeStatus: 'ABSENT',
          startDate: '2020-01-01T10:00:00',
          endDate: '2020-01-01T10:30:00',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(bar!.liveFeedback?.status).toBe('completed');
  });

  it('종료된 RESERVED + 멘토 불참 + 멘티 출석 → mentor-absent (멘토 미참여면 미진행)', () => {
    const bar = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 10,
          status: 'RESERVED',
          mentorStatus: 'ABSENT',
          menteeStatus: 'PRESENT',
          startDate: '2020-01-01T10:00:00',
          endDate: '2020-01-01T10:30:00',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(bar!.liveFeedback?.status).toBe('mentor-absent');
  });

  it('종료된 RESERVED + 멘토 미입장 → waiting 이 아니라 mentor-absent(미진행) 처리된다', () => {
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
    expect(bar!.liveFeedback?.status).toBe('mentor-absent');
  });

  it('경험정리 미제출(attendanceStatus ABSENT) → 시작 전이어도 미진행 처리된다', () => {
    const bar = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 20,
          status: 'RESERVED',
          // 먼 미래(시작 전)라도 미제출이면 최우선 미진행.
          startDate: '2099-01-01T10:00:00',
          endDate: '2099-01-01T10:30:00',
          attendanceStatus: 'ABSENT',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(bar!.liveFeedback?.status).not.toBe('waiting');
    expect(bar!.liveFeedback?.status).toBe('cancelled');
    expect(bar!.liveFeedback?.attendanceStatus).toBe('ABSENT');
  });

  it('경험정리 미제출(attendanceStatus LATE) → 미진행 처리된다', () => {
    const bar = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 21,
          status: 'RESERVED',
          startDate: '2099-01-01T10:00:00',
          endDate: '2099-01-01T10:30:00',
          attendanceStatus: 'LATE',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(bar!.liveFeedback?.status).toBe('cancelled');
  });

  it('제출 완료(attendanceStatus PRESENT) + 시작 전 → 진행 예정(waiting) 유지', () => {
    const bar = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 22,
          status: 'RESERVED',
          startDate: '2099-01-01T10:00:00',
          endDate: '2099-01-01T10:30:00',
          attendanceStatus: 'PRESENT',
        }),
      ],
      [],
    ).find((b) => b.barType === 'live-feedback');
    expect(bar!.liveFeedback?.status).toBe('waiting');
  });

  it('미션 일자가 있으면 period 바 기간을 미션 시작일~종료일로 확정한다 (BE 반영 후)', () => {
    const bars = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 30,
          // 세션 시각(예약 시각)은 미션 기간 안의 특정 하루
          startDate: '2026-07-13T10:00:00',
          endDate: '2026-07-13T10:30:00',
          missionStartDate: '2026-07-12T00:00:00',
          missionEndDate: '2026-07-15T23:59:59',
        }),
      ],
      [],
    );
    const period = bars.find((b) => b.barType === 'live-feedback-period')!;
    // 세션 시각(07-13)이 아니라 미션 기간(07-12~07-15)으로 확정
    expect(period.startDate).toBe('2026-07-12');
    expect(period.endDate).toBe('2026-07-15');
    expect(period.feedbackStartDate).toBe('2026-07-12');
    expect(period.feedbackDeadline).toBe('2026-07-15');
  });

  it('미션 일자가 없으면(BE 미반영) period 바는 세션 min/max로 폴백한다', () => {
    const bars = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 31,
          startDate: '2026-07-13T10:00:00',
          endDate: '2026-07-13T10:30:00',
        }),
      ],
      [],
    );
    const period = bars.find((b) => b.barType === 'live-feedback-period')!;
    // 미션 일자 없음 → 세션 시각 기준
    expect(period.startDate).toBe('2026-07-13');
    expect(period.endDate).toBe('2026-07-13');
  });

  it('미션 일자가 null 이면 폴백한다 (미션 없는 라이브)', () => {
    const bars = deriveLiveFeedbackBars(
      [
        makeSession({
          feedbackId: 32,
          startDate: '2026-07-13T10:00:00',
          endDate: '2026-07-13T10:30:00',
          missionStartDate: null,
          missionEndDate: null,
        }),
      ],
      [],
    );
    const period = bars.find((b) => b.barType === 'live-feedback-period')!;
    expect(period.startDate).toBe('2026-07-13');
    expect(period.endDate).toBe('2026-07-13');
  });

  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(deriveLiveFeedbackBars([], [])).toEqual([]);
  });
});
