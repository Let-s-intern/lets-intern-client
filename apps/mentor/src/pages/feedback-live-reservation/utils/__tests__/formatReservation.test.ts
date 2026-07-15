import { describe, expect, it } from 'vitest';

import {
  formatCreateDate,
  formatDateTimeRange,
  formatTime,
  toDateKey,
} from '../formatReservation';

describe('formatReservation', () => {
  it('formatTime은 HH:mm을 추출한다', () => {
    expect(formatTime('2025-10-16T17:30:00')).toBe('17:30');
  });

  it('formatTime은 잘못된 입력에 빈 문자열을 반환한다', () => {
    expect(formatTime('invalid')).toBe('');
  });

  it('formatDateTimeRange는 "YYYY년 M월 D일 요일 HH:mm-HH:mm" 형식', () => {
    expect(
      formatDateTimeRange('2025-10-16T17:30:00', '2025-10-16T18:00:00'),
    ).toBe('2025년 10월 16일 목요일 17:30-18:00');
  });

  it('formatCreateDate는 null/undefined를 "—"로 표기한다', () => {
    expect(formatCreateDate(null)).toBe('—');
    expect(formatCreateDate(undefined)).toBe('—');
    expect(formatCreateDate('bad')).toBe('—');
  });

  it('formatCreateDate는 "YYYY-MM-DD HH:mm" 형식', () => {
    expect(formatCreateDate('2025-10-10T13:20:00')).toBe('2025-10-10 13:20');
  });

  it('toDateKey는 로컬 날짜 키를 추출하고 빈 입력은 null', () => {
    expect(toDateKey('2025-11-12T16:00:00')).toBe('2025-11-12');
    expect(toDateKey(null)).toBeNull();
    expect(toDateKey('')).toBeNull();
  });
});
