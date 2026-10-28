import { describe, expect, it } from 'vitest';

import dayjs from '@/lib/dayjs';

import { getOneTimeFormStatus } from './oneTimeFormStatus';

const period = {
  startDate: '2026-11-01T00:00:00',
  endDate: '2026-11-10T23:59:59',
};

const statusAt = (now: string, isVisible = true) =>
  getOneTimeFormStatus({ ...period, isVisible }, dayjs(now));

describe('getOneTimeFormStatus', () => {
  it('비공개면 기간과 상관없이 비공개다', () => {
    expect(statusAt('2026-10-01T00:00:00', false)).toBe('HIDDEN');
    expect(statusAt('2026-11-05T00:00:00', false)).toBe('HIDDEN');
    expect(statusAt('2026-12-01T00:00:00', false)).toBe('HIDDEN');
  });

  it('시작 전이면 시작 전이다', () => {
    expect(statusAt('2026-10-31T23:59:59')).toBe('BEFORE');
  });

  it('시작 시각과 마감 시각은 진행 중에 포함된다', () => {
    expect(statusAt('2026-11-01T00:00:00')).toBe('OPEN');
    expect(statusAt('2026-11-05T12:00:00')).toBe('OPEN');
    expect(statusAt('2026-11-10T23:59:59')).toBe('OPEN');
  });

  it('마감 시각이 지나면 마감이다', () => {
    expect(statusAt('2026-11-11T00:00:00')).toBe('CLOSED');
  });
});
