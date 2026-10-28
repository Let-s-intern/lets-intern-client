import {
  formatApplyPeriod,
  formatDotDate,
  formatMonthDay,
} from './applyPeriodText';

describe('applyPeriodText', () => {
  it('날짜를 점으로 잇는다', () => {
    expect(formatDotDate('2026-11-02T10:30:00')).toBe('2026.11.02');
  });

  it('같은 해 기간은 끝 날짜의 연도를 뺀다', () => {
    expect(
      formatApplyPeriod('2026-11-01T00:00:00', '2026-11-10T23:59:59'),
    ).toBe('2026.11.01 ~ 11.10');
  });

  it('해를 넘기는 기간은 두 날짜 모두 연도를 쓴다', () => {
    expect(
      formatApplyPeriod('2026-12-20T00:00:00', '2027-01-05T23:59:59'),
    ).toBe('2026.12.20 ~ 2027.01.05');
  });

  it('월일을 한글로 쓴다', () => {
    expect(formatMonthDay('2026-11-01T00:00:00')).toBe('11월 1일');
  });
});
