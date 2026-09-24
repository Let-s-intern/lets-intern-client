import {
  getIndividualTotal,
  getSaveAmount,
  INDIVIDUAL_ITEMS,
  PASS_INCLUDE_LINES,
  type PricingItem,
} from './pricing';

describe('pricing (개편 시안 11)', () => {
  it('개별 구매 6줄과 패스 혜택 6줄이다', () => {
    expect(INDIVIDUAL_ITEMS).toHaveLength(6);
    expect(PASS_INCLUDE_LINES).toHaveLength(6);
  });

  /*
   * 합계를 따로 적어 두지 않는 이유가 이것이다. 한 줄의 금액이 바뀌면 합계도 바뀌어야
   * 하는데, 두 곳에 적으면 한쪽만 고쳐진다.
   */
  it('합계가 6줄의 합과 같다', () => {
    const sum = INDIVIDUAL_ITEMS.reduce((acc, item) => acc + item.price, 0);

    expect(getIndividualTotal()).toBe(sum);
    expect(getIndividualTotal()).toBe(392000);
  });

  it('한 줄의 금액이 바뀌면 합계가 따라 바뀐다', () => {
    const items: PricingItem[] = [
      { label: 'A', price: 10000 },
      { label: 'B', price: 5000 },
    ];

    expect(getIndividualTotal(items)).toBe(15000);
  });

  it('SAVE 는 합계 − 패스가다', () => {
    expect(getSaveAmount(175900)).toBe(getIndividualTotal() - 175900);
    expect(getSaveAmount(175900)).toBe(216100);
  });

  it('패스가가 바뀌면 SAVE 도 따라 바뀐다', () => {
    expect(getSaveAmount(100000)).toBe(getIndividualTotal() - 100000);
    expect(getSaveAmount(200000)).toBe(getIndividualTotal() - 200000);
  });

  /*
   * 어드민에서 패스 가격을 합계보다 높게 잡으면 음수가 된다. 화면에 "−10,000원 SAVE" 가
   * 남는 것보다 0 으로 떨어뜨려 호출부가 칩을 숨기게 한다.
   */
  it('패스가가 합계보다 비싸면 SAVE 는 0 이다', () => {
    expect(getSaveAmount(getIndividualTotal() + 10000)).toBe(0);
  });
});
