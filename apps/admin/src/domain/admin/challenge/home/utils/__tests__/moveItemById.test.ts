import { describe, expect, it } from 'vitest';
import { moveItemById } from '../moveItemById';

const items = [{ id: 10 }, { id: 20 }, { id: 30 }, { id: 40 }];

describe('moveItemById', () => {
  it('앞의 항목을 뒤 항목 자리로 옮긴다', () => {
    expect(moveItemById(items, 10, 30)?.map((i) => i.id)).toEqual([
      20, 30, 10, 40,
    ]);
  });

  it('뒤의 항목을 앞 항목 자리로 옮긴다', () => {
    expect(moveItemById(items, 40, 20)?.map((i) => i.id)).toEqual([
      10, 40, 20, 30,
    ]);
  });

  it('원본 배열을 바꾸지 않는다', () => {
    moveItemById(items, 10, 40);
    expect(items.map((i) => i.id)).toEqual([10, 20, 30, 40]);
  });

  it('같은 항목에 놓으면 null 이다', () => {
    expect(moveItemById(items, 20, 20)).toBeNull();
  });

  it('목록에 없는 id 면 null 이다', () => {
    expect(moveItemById(items, 10, 99)).toBeNull();
    expect(moveItemById(items, 99, 10)).toBeNull();
  });
});
