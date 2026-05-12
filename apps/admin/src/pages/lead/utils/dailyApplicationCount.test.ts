import { describe, expect, it } from 'vitest';

import { dailyApplicationCount } from './dailyApplicationCount';

describe('dailyApplicationCount', () => {
  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(dailyApplicationCount([])).toEqual([]);
  });

  it('1일치 데이터 1건은 단일 포인트로 변환된다', () => {
    const result = dailyApplicationCount([
      { createDate: '2026-05-10T09:00:00' },
    ]);
    expect(result).toEqual([{ date: '2026-05-10', count: 1 }]);
  });

  it('연속된 1일 간격 2건은 2개 포인트로 변환된다', () => {
    const result = dailyApplicationCount([
      { createDate: '2026-05-10T09:00:00' },
      { createDate: '2026-05-11T18:30:00' },
    ]);
    expect(result).toEqual([
      { date: '2026-05-10', count: 1 },
      { date: '2026-05-11', count: 1 },
    ]);
  });

  it('사이에 3일 공백이 있는 데이터는 빈 일자를 count:0으로 채워 총 길이가 5가 된다', () => {
    const result = dailyApplicationCount([
      { createDate: '2026-05-10T09:00:00' },
      { createDate: '2026-05-14T18:30:00' },
    ]);
    expect(result).toEqual([
      { date: '2026-05-10', count: 1 },
      { date: '2026-05-11', count: 0 },
      { date: '2026-05-12', count: 0 },
      { date: '2026-05-13', count: 0 },
      { date: '2026-05-14', count: 1 },
    ]);
    expect(result).toHaveLength(5);
  });

  it('같은 일자 3건은 count:3 단일 포인트가 된다', () => {
    const result = dailyApplicationCount([
      { createDate: '2026-05-10T09:00:00' },
      { createDate: '2026-05-10T12:00:00' },
      { createDate: '2026-05-10T18:30:00' },
    ]);
    expect(result).toEqual([{ date: '2026-05-10', count: 3 }]);
  });

  it('타임존이 없는 ISO 문자열도 일자(YYYY-MM-DD)를 동일하게 추출한다', () => {
    const result = dailyApplicationCount([
      { createDate: '2026-05-12T13:24:00' },
      { createDate: '2026-05-12T23:59:00' },
    ]);
    expect(result).toEqual([{ date: '2026-05-12', count: 2 }]);
  });
});
