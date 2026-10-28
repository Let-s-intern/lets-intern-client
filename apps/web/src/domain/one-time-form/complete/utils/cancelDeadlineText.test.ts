import { formatMonthDayWithWeekday } from './cancelDeadlineText';

describe('formatMonthDayWithWeekday', () => {
  // 시안의 "11.10(월)" 은 달력과 다르다. 2026-11-10 은 화요일이다
  it('월.일(요일) 로 만든다', () => {
    expect(formatMonthDayWithWeekday('2026-11-10T23:59:59')).toBe('11.10(화)');
    expect(formatMonthDayWithWeekday('2026-11-30T23:59:59')).toBe('11.30(월)');
  });

  it('한 자리 달과 날은 0 을 채운다', () => {
    expect(formatMonthDayWithWeekday('2027-01-05T00:00:00')).toBe('01.05(화)');
  });
});
