import { describe, expect, it } from 'vitest';

import {
  getLiveFeedbackBadgeVisual,
  resolveLiveFeedbackStatus,
  resolveLiveSessionStatus,
} from '../liveFeedbackStatus';

describe('resolveLiveFeedbackStatus', () => {
  const start = '2026-05-20T11:00:00+09:00';
  const end = '2026-05-20T11:30:00+09:00';

  it.each([
    [
      'RESERVED + now < startAt → waiting',
      'RESERVED' as const,
      new Date('2026-05-20T10:00:00+09:00'),
      'waiting' as const,
    ],
    [
      'RESERVED + startAt ≤ now < endAt → inProgress',
      'RESERVED' as const,
      new Date('2026-05-20T11:15:00+09:00'),
      'inProgress' as const,
    ],
    [
      'RESERVED + now ≥ endAt → missed (BE 자동 전이 미배포 보완)',
      'RESERVED' as const,
      new Date('2026-05-20T12:00:00+09:00'),
      'missed' as const,
    ],
    [
      'COMPLETED 이면 시각 무관하게 completed',
      'COMPLETED' as const,
      new Date('2026-05-20T10:00:00+09:00'),
      'completed' as const,
    ],
    [
      'COMPLETED 이면 진행 중 시간이어도 completed',
      'COMPLETED' as const,
      new Date('2026-05-20T11:15:00+09:00'),
      'completed' as const,
    ],
    [
      'CANCELED(예약취소) 이면 시각 무관하게 cancelled',
      'CANCELED' as const,
      new Date('2026-05-20T11:15:00+09:00'),
      'cancelled' as const,
    ],
    [
      'CANCELED(예약취소) 이면 시작 전이어도 cancelled',
      'CANCELED' as const,
      new Date('2026-05-20T09:00:00+09:00'),
      'cancelled' as const,
    ],
  ])('%s', (_label, apiStatus, now, expected) => {
    expect(resolveLiveFeedbackStatus(apiStatus, start, end, now)).toBe(
      expected,
    );
  });

  it('startDate 가 잘못된 ISO 면 waiting 으로 폴백한다', () => {
    expect(
      resolveLiveFeedbackStatus('RESERVED', 'invalid', end, new Date()),
    ).toBe('waiting');
  });
});

describe('resolveLiveSessionStatus — 종료 후 출석 반영', () => {
  const start = '2026-05-20T11:00:00+09:00';
  const end = '2026-05-20T11:30:00+09:00';
  const afterEnd = new Date('2026-05-20T12:00:00+09:00');
  const beforeStart = new Date('2026-05-20T10:00:00+09:00');

  it('종료 후 RESERVED + 양측 참여 → completed (BE 미전이 보정)', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        mentorStatus: 'PRESENT',
        menteeStatus: 'PRESENT',
        startDate: start,
        endDate: end,
        now: afterEnd,
      }),
    ).toBe('completed');
  });

  it('종료 후 RESERVED + 멘토 출석 + 멘티 불참 → completed (멘토 출석만으로 완료)', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        mentorStatus: 'PRESENT',
        menteeStatus: 'ABSENT',
        startDate: start,
        endDate: end,
        now: afterEnd,
      }),
    ).toBe('completed');
  });

  it('종료 후 RESERVED + 멘토 불참 + 멘티 출석 → missed (멘토 미참여면 미진행)', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        mentorStatus: 'ABSENT',
        menteeStatus: 'PRESENT',
        startDate: start,
        endDate: end,
        now: afterEnd,
      }),
    ).toBe('missed');
  });

  it('종료 후 RESERVED + 멘토 출석 미체크(PENDING) → missed', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        startDate: start,
        endDate: end,
        now: afterEnd,
      }),
    ).toBe('missed');
  });

  it('시작 전에는 출석과 무관하게 waiting', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        mentorStatus: 'PRESENT',
        menteeStatus: 'PRESENT',
        startDate: start,
        endDate: end,
        now: beforeStart,
      }),
    ).toBe('waiting');
  });

  it('COMPLETED는 시간과 무관하게 completed', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'COMPLETED',
        startDate: start,
        endDate: end,
        now: beforeStart,
      }),
    ).toBe('completed');
  });
});

describe('resolveLiveSessionStatus — 경험정리 미제출(attendanceStatus)', () => {
  const start = '2026-05-20T11:00:00+09:00';
  const end = '2026-05-20T11:30:00+09:00';
  const during = new Date('2026-05-20T11:15:00+09:00');

  it('attendanceStatus ABSENT → 진행 중 시각이어도 cancelled(취소) (최우선)', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        attendanceStatus: 'ABSENT',
        startDate: start,
        endDate: end,
        now: during,
      }),
    ).toBe('cancelled');
  });

  it('attendanceStatus LATE → 진행 중 시각이어도 cancelled(취소) (최우선)', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        attendanceStatus: 'LATE',
        startDate: start,
        endDate: end,
        now: during,
      }),
    ).toBe('cancelled');
  });

  it('attendanceStatus PRESENT → 미제출 아님, 기존 시간 로직(inProgress)', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        attendanceStatus: 'PRESENT',
        startDate: start,
        endDate: end,
        now: during,
      }),
    ).toBe('inProgress');
  });

  it('attendanceStatus UPDATED → 미제출 아님, 기존 시간 로직(inProgress)', () => {
    expect(
      resolveLiveSessionStatus({
        rawStatus: 'RESERVED',
        attendanceStatus: 'UPDATED',
        startDate: start,
        endDate: end,
        now: during,
      }),
    ).toBe('inProgress');
  });
});

describe('getLiveFeedbackBadgeVisual', () => {
  it('각 상태별 한국어 라벨을 반환한다', () => {
    expect(getLiveFeedbackBadgeVisual('waiting').label).toBe('진행 예정');
    expect(getLiveFeedbackBadgeVisual('inProgress').label).toBe('진행 중');
    expect(getLiveFeedbackBadgeVisual('completed').label).toBe('진행 완료');
    expect(getLiveFeedbackBadgeVisual('missed').label).toBe('미진행');
    expect(getLiveFeedbackBadgeVisual('cancelled').label).toBe('취소');
  });

  it('badgeClass 색상: 진행예정=indigo/진행중=blue/완료=neutral/미진행·취소=연red(통일)', () => {
    expect(getLiveFeedbackBadgeVisual('waiting').badgeClass).toContain(
      'indigo',
    );
    expect(getLiveFeedbackBadgeVisual('inProgress').badgeClass).toContain(
      'text-blue',
    );
    expect(getLiveFeedbackBadgeVisual('completed').badgeClass).toContain(
      'text-neutral',
    );
    // 미진행·취소 = 연빨강 배경 + 빨강 글자(동일 색으로 통일)
    expect(getLiveFeedbackBadgeVisual('missed').badgeClass).toContain(
      'bg-red-50',
    );
    expect(getLiveFeedbackBadgeVisual('missed').badgeClass).toContain(
      'text-red',
    );
    expect(getLiveFeedbackBadgeVisual('cancelled').badgeClass).toContain(
      'bg-red-50',
    );
    expect(getLiveFeedbackBadgeVisual('cancelled').badgeClass).toContain(
      'text-red',
    );
  });
});
