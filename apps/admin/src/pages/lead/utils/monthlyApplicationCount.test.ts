import { describe, expect, it } from 'vitest';

import { monthlyApplicationCount } from './monthlyApplicationCount';

describe('monthlyApplicationCount', () => {
  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(monthlyApplicationCount([])).toEqual([]);
  });

  it('단일 월 데이터는 단일 포인트로 변환된다', () => {
    const result = monthlyApplicationCount([
      { createDate: '2026-05-10T09:00:00' },
      { createDate: '2026-05-28T18:30:00' },
    ]);
    expect(result).toEqual([{ month: '2026-05', count: 2 }]);
  });

  it('연속 2개월 데이터는 2개 포인트로 변환된다', () => {
    const result = monthlyApplicationCount([
      { createDate: '2026-04-10T09:00:00' },
      { createDate: '2026-05-11T18:30:00' },
    ]);
    expect(result).toEqual([
      { month: '2026-04', count: 1 },
      { month: '2026-05', count: 1 },
    ]);
  });

  it('사이에 빈 월이 있어도 count:0으로 채운다', () => {
    const result = monthlyApplicationCount([
      { createDate: '2026-01-10T09:00:00' },
      { createDate: '2026-04-14T18:30:00' },
    ]);
    expect(result).toEqual([
      { month: '2026-01', count: 1 },
      { month: '2026-02', count: 0 },
      { month: '2026-03', count: 0 },
      { month: '2026-04', count: 1 },
    ]);
  });

  it('invalid date 문자열은 건너뛴다', () => {
    const result = monthlyApplicationCount([
      { createDate: 'not-a-date' },
      { createDate: '2026-05-10T09:00:00' },
    ]);
    expect(result).toEqual([{ month: '2026-05', count: 1 }]);
  });
});
