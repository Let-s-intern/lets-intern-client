import { formatKRW } from './membership';
import { getDiscountRate, PLAN_BENEFITS, PLAN_PRICE } from './plans';

describe('단일 플랜 표시 데이터', () => {
  it('정가 대비 특가 할인율은 84% (시안 카피 일치)', () => {
    expect(getDiscountRate(PLAN_PRICE.original, PLAN_PRICE.sale)).toBe(84);
  });

  it('정가 0 이하면 0% (0 나눗셈 방지)', () => {
    expect(getDiscountRate(0, 0)).toBe(0);
  });

  it('formatKRW 로 가격에 천단위 콤마가 붙는다', () => {
    expect(formatKRW(PLAN_PRICE.sale)).toBe('149,000');
    expect(formatKRW(PLAN_PRICE.original)).toBe('938,300');
  });

  it('혜택은 7종이다', () => {
    expect(PLAN_BENEFITS).toHaveLength(7);
  });
});
