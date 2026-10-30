import { getMembershipOrderError } from './orderError';

describe('getMembershipOrderError', () => {
  it.each([
    [409, 'VOD_PASS_PRODUCT_CHANGED'],
    [404, 'VOD_PASS_PRODUCT_NOT_FOUND'],
    [409, 'VOD_PASS_SALE_NOT_ENABLED'],
    [400, 'VOD_PASS_PURCHASE_MONTHS_EXCEEDED'],
    [409, 'VOD_PASS_TOTAL_MONTHS_EXCEEDED'],
    [400, 'MEMBERSHIP_PAYMENT_AMOUNT_MISMATCH'],
  ])('%s %s 는 안내와 함께 다시 고르게 한다', (status, code) => {
    const result = getMembershipOrderError({ status, code });
    expect(result?.needsReselect).toBe(true);
    expect(result?.message).toBeTruthy();
  });

  it('판매 종료는 VOD 없이 다시 신청하라고 안내한다', () => {
    expect(
      getMembershipOrderError({
        status: 409,
        code: 'VOD_PASS_SALE_NOT_ENABLED',
      })?.message,
    ).toBe(
      'VOD 이용권 판매가 종료되었어요. VOD 이용권 없이 다시 신청해 주세요',
    );
  });

  it('주문 충돌은 결제 내역 확인 안내만 하고 다시 고르게 하지 않는다', () => {
    expect(
      getMembershipOrderError({ status: 409, code: 'PAYMENT_ORDER_CONFLICT' }),
    ).toEqual({
      message: '이미 처리된 주문과 정보가 다릅니다. 결제 내역을 확인해 주세요',
      needsReselect: false,
    });
  });

  it.each([
    null,
    'error',
    new Error('network'),
    { status: 500, code: 'INTERNAL_SERVER_ERROR' },
  ])('구분할 수 없는 실패 %p 는 null 이다', (error) => {
    expect(getMembershipOrderError(error)).toBeNull();
  });
});
