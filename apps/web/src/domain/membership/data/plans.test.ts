import { formatKRW } from './membership';
import { getDiscountRate, PLAN_BENEFITS, PLAN_PRICE } from './plans';

describe('단일 플랜 표시 데이터', () => {
  it('폴백 정가 대비 판매가 할인율은 80%', () => {
    // 얼리버드(169,900원 / 82%)는 2026-08-27 로 끝났다. 값을 되돌리면 여기서 걸린다.
    expect(getDiscountRate(PLAN_PRICE.original, PLAN_PRICE.sale)).toBe(80);
  });

  it('formatKRW 로 가격에 천단위 콤마가 붙는다', () => {
    expect(formatKRW(PLAN_PRICE.sale)).toBe('184,000');
    expect(formatKRW(PLAN_PRICE.original)).toBe('938,300');
  });

  it('혜택은 4종이다 (커뮤니티는 멤버십 전용이 아니라 뺐다)', () => {
    expect(PLAN_BENEFITS).toHaveLength(4);
  });
});

describe('getDiscountRate — 배지를 그릴 수 있는 값인지', () => {
  it('정가 938,300 / 판매가 184,000 이면 80 (현재 배지 값)', () => {
    // 배지 숫자를 코드에 박지 않고 이 계산으로 만든다. 어드민에서 가격을 바꾸면
    // 배지도 따라 바뀌어야 하기 때문이다.
    expect(getDiscountRate(938300, 184000)).toBe(80);
  });

  it('정가가 0 이면 0 → 호출부가 배지를 렌더하지 않는다', () => {
    // 0 나눗셈으로 Infinity 가 배지에 찍히는 것을 막는다.
    expect(getDiscountRate(0, 169900)).toBe(0);
    expect(getDiscountRate(0, 0)).toBe(0);
  });

  it('정가가 음수여도 0', () => {
    expect(getDiscountRate(-1000, 100)).toBe(0);
  });

  it('특가가 정가보다 비싸면 0 → 음수 할인율을 화면에 내지 않는다', () => {
    // 어드민이 할인 금액을 0 으로 두고 옵션가만 올리면 실제로 생기는 조합이다.
    expect(getDiscountRate(100000, 150000)).toBe(0);
  });

  it('정가와 특가가 같으면 0', () => {
    expect(getDiscountRate(100000, 100000)).toBe(0);
  });
});
