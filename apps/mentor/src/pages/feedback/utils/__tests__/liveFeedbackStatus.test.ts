import { describe, expect, it } from 'vitest';

import {
  getLiveFeedbackBadgeVisual,
  resolveLiveFeedbackStatus,
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
      'CANCELED 이면 시각 무관하게 missed',
      'CANCELED' as const,
      new Date('2026-05-20T11:15:00+09:00'),
      'missed' as const,
    ],
    [
      'CANCELED 이면 시작 전이어도 missed',
      'CANCELED' as const,
      new Date('2026-05-20T09:00:00+09:00'),
      'missed' as const,
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

describe('getLiveFeedbackBadgeVisual', () => {
  it('각 상태별 한국어 라벨을 반환한다', () => {
    expect(getLiveFeedbackBadgeVisual('waiting').label).toBe('대기');
    expect(getLiveFeedbackBadgeVisual('inProgress').label).toBe('진행중');
    expect(getLiveFeedbackBadgeVisual('completed').label).toBe('완료');
    expect(getLiveFeedbackBadgeVisual('missed').label).toBe('미완료');
  });

  it('badgeClass 가 STATUS_BADGE 토큰을 사용한다', () => {
    expect(getLiveFeedbackBadgeVisual('waiting').badgeClass).toContain(
      'text-red',
    );
    expect(getLiveFeedbackBadgeVisual('inProgress').badgeClass).toContain(
      'text-blue',
    );
    expect(getLiveFeedbackBadgeVisual('completed').badgeClass).toContain(
      'text-green',
    );
    expect(getLiveFeedbackBadgeVisual('missed').badgeClass).toContain(
      'text-neutral',
    );
  });
});
