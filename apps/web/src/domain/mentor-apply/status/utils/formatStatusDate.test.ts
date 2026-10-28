import { formatReplyDate, formatSubmittedDate } from './formatStatusDate';

describe('formatStatusDate', () => {
  it('신청일을 시안 형식으로 바꾼다', () => {
    expect(formatSubmittedDate('2026-10-28T14:03:00')).toBe('2026. 10. 28.');
    expect(formatSubmittedDate('2026-01-05T09:00:00.123')).toBe('2026. 1. 5.');
  });

  it('예상 회신일을 월, 일, 요일로 바꾼다', () => {
    expect(formatReplyDate('2026-11-04')).toBe('11월 4일 (수)');
    expect(formatReplyDate('2026-11-08')).toBe('11월 8일 (일)');
  });
});
