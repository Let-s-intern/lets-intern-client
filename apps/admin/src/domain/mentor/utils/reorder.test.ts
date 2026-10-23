import { describe, expect, it } from 'vitest';

import { moveToRank, swap } from './reorder';

const items = ['A', 'B', 'C', 'D', 'E'];

describe('moveToRank', () => {
  it('위로 끼워 넣으면 사이 항목이 한 칸씩 밀린다', () => {
    expect(moveToRank(items, 2, 1)).toEqual(['C', 'A', 'B', 'D', 'E']);
  });

  it('아래로 끼워 넣으면 사이 항목이 한 칸씩 당겨진다', () => {
    expect(moveToRank(items, 1, 4)).toEqual(['A', 'C', 'D', 'B', 'E']);
  });

  it('1 미만은 1위, 개수 초과는 마지막으로 맞춘다', () => {
    expect(moveToRank(items, 2, 0)).toEqual(['C', 'A', 'B', 'D', 'E']);
    expect(moveToRank(items, 2, 99)).toEqual(['A', 'B', 'D', 'E', 'C']);
  });

  it('원본 배열을 바꾸지 않는다', () => {
    const original = [...items];
    moveToRank(items, 0, 3);
    expect(items).toEqual(original);
  });
});

describe('swap', () => {
  it('두 위치를 맞바꾼다', () => {
    expect(swap(items, 1, 2)).toEqual(['A', 'C', 'B', 'D', 'E']);
  });

  it('범위 밖이면 원본을 그대로 돌려준다', () => {
    expect(swap(items, 4, 5)).toBe(items);
    expect(swap(items, -1, 0)).toBe(items);
  });
});
