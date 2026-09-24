import { formatKRW } from './membership';
import { getDiscountRate, PLAN_BENEFITS, PLAN_NAME, PLAN_PRICE } from './plans';

describe('단일 플랜 표시 데이터 (시안 15)', () => {
  it('상품명은 랜딩·GNB·결제 시트와 같은 이름이다', () => {
    expect(PLAN_NAME).toBe('마케팅 취준 올인원 패스');
  });

  it('폴백 판매가는 175,900원이다', () => {
    expect(PLAN_PRICE.sale).toBe(175900);
    expect(formatKRW(PLAN_PRICE.sale)).toBe('175,900');
  });

  /*
   * 시안 15 의 가격 카드에는 취소선도 할인 배지도 없다. 정가를 판매가와 같게 두어
   * 할인율이 0 이 되고, 호출부가 배지를 렌더하지 않는다. 없는 정가를 지어내면
   * 화면에 거짓 할인율이 뜬다.
   */
  it('정가와 판매가가 같아 할인 배지가 뜨지 않는다', () => {
    expect(getDiscountRate(PLAN_PRICE.original, PLAN_PRICE.sale)).toBe(0);
  });

  it('혜택은 7종이다', () => {
    expect(PLAN_BENEFITS).toHaveLength(7);
  });
});

describe('getDiscountRate', () => {
  it('정가가 0 이하면 0 을 돌려준다', () => {
    expect(getDiscountRate(0, 1000)).toBe(0);
  });

  it('판매가가 정가보다 비싸면 0 을 돌려준다', () => {
    expect(getDiscountRate(1000, 2000)).toBe(0);
  });
});
