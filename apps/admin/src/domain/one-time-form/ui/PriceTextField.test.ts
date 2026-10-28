import { describe, expect, it } from 'vitest';

import { parsePriceInput } from './PriceTextField';

describe('parsePriceInput', () => {
  it('쉼표를 지우고 숫자로 읽는다', () => {
    expect(parsePriceInput('29,000')).toBe(29000);
  });

  it('빼기 기호를 지워 음수가 될 수 없다', () => {
    expect(parsePriceInput('-5,000')).toBe(5000);
  });

  it('0 과 빈 칸은 0원이다', () => {
    expect(parsePriceInput('0')).toBe(0);
    expect(parsePriceInput('')).toBe(0);
  });

  it('서버 int 범위를 넘지 않게 9자리까지만 받는다', () => {
    expect(parsePriceInput('12345678901')).toBe(123456789);
  });
});
