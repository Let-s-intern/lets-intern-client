import { describe, expect, it } from 'vitest';

import { categoryCount } from './categoryCount';

interface Sample {
  field: string | null;
}

describe('categoryCount', () => {
  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(categoryCount([], (item: Sample) => item.field)).toEqual([]);
  });

  it('단일 카테고리 3건은 count 3 버킷 하나로 변환된다', () => {
    const items: Sample[] = [
      { field: '개발' },
      { field: '개발' },
      { field: '개발' },
    ];
    expect(categoryCount(items, (item) => item.field)).toEqual([
      { label: '개발', count: 3 },
    ]);
  });

  it('여러 카테고리는 카운트 내림차순으로 정렬된다', () => {
    const items: Sample[] = [
      { field: '개발' },
      { field: '디자인' },
      { field: '개발' },
      { field: '기획' },
      { field: '개발' },
      { field: '디자인' },
    ];
    expect(categoryCount(items, (item) => item.field)).toEqual([
      { label: '개발', count: 3 },
      { label: '디자인', count: 2 },
      { label: '기획', count: 1 },
    ]);
  });

  it("null/빈문자열/'-' 값은 '미입력' 버킷에 누적된다", () => {
    const items: Sample[] = [
      { field: null },
      { field: '' },
      { field: '-' },
      { field: '개발' },
    ];
    const result = categoryCount(items, (item) => item.field);
    expect(result).toEqual([
      { label: '미입력', count: 3 },
      { label: '개발', count: 1 },
    ]);
  });

  it('topN=2, 카테고리 4개면 상위 2개 + 기타 1개 = 길이 3', () => {
    const items: Sample[] = [
      { field: 'A' },
      { field: 'A' },
      { field: 'A' },
      { field: 'B' },
      { field: 'B' },
      { field: 'C' },
      { field: 'D' },
    ];
    const result = categoryCount(items, (item) => item.field, { topN: 2 });
    expect(result).toEqual([
      { label: 'A', count: 3 },
      { label: 'B', count: 2 },
      { label: '기타', count: 2 },
    ]);
  });

  it('topN=2, 카테고리 2개면 기타 버킷이 생성되지 않는다 (길이 2)', () => {
    const items: Sample[] = [
      { field: 'A' },
      { field: 'A' },
      { field: 'B' },
    ];
    const result = categoryCount(items, (item) => item.field, { topN: 2 });
    expect(result).toEqual([
      { label: 'A', count: 2 },
      { label: 'B', count: 1 },
    ]);
    expect(result).toHaveLength(2);
  });

  it('excludeEmpty: true이면 미입력 값이 결과에서 완전히 제외된다', () => {
    const items: Sample[] = [
      { field: null },
      { field: '' },
      { field: '-' },
      { field: '개발' },
      { field: '개발' },
      { field: '디자인' },
    ];
    const result = categoryCount(items, (item) => item.field, {
      excludeEmpty: true,
    });
    expect(result).toEqual([
      { label: '개발', count: 2 },
      { label: '디자인', count: 1 },
    ]);
    expect(result.some((b) => b.label === '미입력')).toBe(false);
  });

  it('excludeEmpty: true이고 모든 값이 미입력이면 빈 배열을 반환한다', () => {
    const items: Sample[] = [
      { field: null },
      { field: '' },
      { field: '-' },
    ];
    const result = categoryCount(items, (item) => item.field, {
      excludeEmpty: true,
    });
    expect(result).toEqual([]);
  });

  it('emptyLabel, restLabel 옵션을 커스텀할 수 있다', () => {
    const items: Sample[] = [
      { field: null },
      { field: 'A' },
      { field: 'A' },
      { field: 'B' },
      { field: 'C' },
    ];
    const result = categoryCount(items, (item) => item.field, {
      topN: 2,
      emptyLabel: 'N/A',
      restLabel: 'Others',
    });
    expect(result).toEqual([
      { label: 'A', count: 2 },
      { label: 'N/A', count: 1 },
      { label: 'Others', count: 2 },
    ]);
  });
});
