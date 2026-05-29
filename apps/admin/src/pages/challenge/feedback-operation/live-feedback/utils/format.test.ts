import { describe, expect, it } from 'vitest';
import { formatApplyDateTime, formatReservationDateTime } from './format';

describe('formatReservationDateTime', () => {
  it('YYYY년 M월 D일 요일 HH:mm-HH:mm 형식으로 포맷한다', () => {
    // 2026-05-29 는 금요일
    expect(
      formatReservationDateTime('2026-05-29T17:00:00', '2026-05-29T17:30:00'),
    ).toBe('2026년 5월 29일 금요일 17:00-17:30');
  });

  it('월/일은 0 패딩 없이 표기한다', () => {
    // 2026-01-05 는 월요일
    expect(
      formatReservationDateTime('2026-01-05T09:00:00', '2026-01-05T09:30:00'),
    ).toBe('2026년 1월 5일 월요일 09:00-09:30');
  });
});

describe('formatApplyDateTime', () => {
  it('YYYY-MM-DD HH:mm 형식으로 포맷한다', () => {
    expect(formatApplyDateTime('2026-05-20T09:05:00')).toBe('2026-05-20 09:05');
  });
});
