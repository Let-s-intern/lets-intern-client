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

  it('invalid date 문자열이 섞여 있어도 무한 루프 없이 valid 항목만 집계한다', { timeout: 5000 }, () => {
    const result = dailyApplicationCount([
      { createDate: 'not-a-date' },
      { createDate: '2026-05-10T09:00:00' },
      { createDate: 'also-invalid' },
      { createDate: '2026-05-11T18:30:00' },
    ]);
    expect(result).toEqual([
      { date: '2026-05-10', count: 1 },
      { date: '2026-05-11', count: 1 },
    ]);
  });

  it('모든 항목이 invalid date이면 빈 배열을 반환한다', { timeout: 5000 }, () => {
    const result = dailyApplicationCount([
      { createDate: 'not-a-date' },
      { createDate: 'also-invalid' },
    ]);
    expect(result).toEqual([]);
  });

  describe('cumulative 옵션', () => {
    it('빈 입력은 cumulative: true에서도 빈 배열을 반환한다', () => {
      expect(dailyApplicationCount([], { cumulative: true })).toEqual([]);
    });

    it('cumulative: true이면 결과 길이는 동일하고 count는 단조 증가한다', () => {
      const applications = [
        { createDate: '2026-05-10T09:00:00' },
        { createDate: '2026-05-11T18:30:00' },
        { createDate: '2026-05-11T20:00:00' },
        { createDate: '2026-05-13T12:00:00' },
      ];

      const base = dailyApplicationCount(applications);
      const cumulative = dailyApplicationCount(applications, {
        cumulative: true,
      });

      expect(cumulative).toHaveLength(base.length);
      for (let i = 1; i < cumulative.length; i++) {
        expect(cumulative[i].count).toBeGreaterThanOrEqual(
          cumulative[i - 1].count,
        );
      }
      // 마지막 누적값은 createDate가 있는 신청자 총 수와 같다.
      expect(cumulative[cumulative.length - 1].count).toBe(applications.length);
    });

    it('사이에 빈 일자가 있어도 누적값이 유지되어 감소하지 않는다', () => {
      const result = dailyApplicationCount(
        [
          { createDate: '2026-05-10T09:00:00' },
          { createDate: '2026-05-14T18:30:00' },
        ],
        { cumulative: true },
      );

      expect(result).toEqual([
        { date: '2026-05-10', count: 1 },
        { date: '2026-05-11', count: 1 },
        { date: '2026-05-12', count: 1 },
        { date: '2026-05-13', count: 1 },
        { date: '2026-05-14', count: 2 },
      ]);
    });
  });
});
