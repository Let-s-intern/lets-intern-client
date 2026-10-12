/*
  `orderResult.ts` 는 `PostApplicationInterface` 타입만 가져오지만 `@/api/application` 을
  import 하는 순간 axios 계열 모듈이 딸려 온다. 타입 import 라 런타임에는 지워지지만 안전을 위해 막는다.
*/
jest.mock('@/utils/axios', () => ({ __esModule: true, default: {} }));
jest.mock('@/utils/axiosV2', () => ({ __esModule: true, default: {} }));
jest.mock('@letscareer/api', () => ({
  __esModule: true,
  fetchJson: jest.fn(),
}));

import {
  buildPostApplicationBody,
  getOrderErrorMessage,
  PAYMENT_ORDER_CONFLICT_MESSAGE,
  VOD_PASS_PRODUCT_CHANGED_MESSAGE,
  type OrderRequestForm,
} from './orderResult';

const FORM: OrderRequestForm = {
  couponId: '3',
  priceId: 2,
  isFree: false,
  totalPrice: 99000,
  contactEmail: 'qa@letscareer.test',
  question: '',
  vodPassProductId: 0,
  vodPassPrice: 0,
  vodPassDurationDays: 0,
};

const PARAMS = { orderId: 'letsAB12', paymentKey: 'pk_1', amount: 99000 };

describe('buildPostApplicationBody', () => {
  it('이용권을 고르지 않으면 이용권 키가 본문에 없고 기존 본문과 같다', () => {
    const body = buildPostApplicationBody(FORM, PARAMS);

    expect(body).toEqual({
      paymentInfo: {
        couponId: 3,
        priceId: 2,
        paymentKey: 'pk_1',
        orderId: 'letsAB12',
        amount: '99000',
      },
      contactEmail: 'qa@letscareer.test',
      motivate: '',
      question: '',
    });
    expect(Object.keys(body)).not.toContain('vodPassProductId');
    expect(Object.keys(body)).not.toContain('vodPassExpectedPrice');
    expect(Object.keys(body)).not.toContain('vodPassExpectedDurationDays');
  });

  it('이용권을 골랐으면 세 필드를 모두 넣고 amount 는 Toss 쿼리 값을 그대로 쓴다', () => {
    const body = buildPostApplicationBody(
      {
        ...FORM,
        vodPassProductId: 7,
        vodPassPrice: 29000,
        vodPassDurationDays: 30,
      },
      { ...PARAMS, amount: 128000 },
    );

    expect(body.vodPassProductId).toBe(7);
    expect(body.vodPassExpectedPrice).toBe(29000);
    expect(body.vodPassExpectedDurationDays).toBe(30);
    // 이미 이용권이 합산된 금액이다. 여기서 다시 더하지 않는다
    expect(body.paymentInfo.amount).toBe('128000');
  });

  it('이용권 필드가 없던 시절의 저장 상태(undefined)는 미선택으로 본다', () => {
    const legacyForm = {
      ...FORM,
      vodPassProductId: undefined,
      vodPassPrice: undefined,
      vodPassDurationDays: undefined,
    };

    const body = buildPostApplicationBody(legacyForm, PARAMS);

    expect(Object.keys(body)).not.toContain('vodPassProductId');
  });

  it('무료 신청이면 paymentKey 를 비우고 amount 는 스토어 합계를 쓴다', () => {
    const body = buildPostApplicationBody(
      { ...FORM, isFree: true, totalPrice: 0 },
      { orderId: 'letsAB12' },
    );

    expect(body.paymentInfo.paymentKey).toBeNull();
    expect(body.paymentInfo.amount).toBe('0');
  });

  it('Toss amount 가 없으면 스토어 합계로 대신한다', () => {
    const body = buildPostApplicationBody(FORM, {
      orderId: 'letsAB12',
      paymentKey: 'pk_1',
    });

    expect(body.paymentInfo.amount).toBe('99000');
  });

  it('쿠폰이 없으면 couponId 는 null, priceId 가 없으면 -1 이다', () => {
    const body = buildPostApplicationBody(
      { ...FORM, couponId: '', priceId: null },
      PARAMS,
    );

    expect(body.paymentInfo.couponId).toBeNull();
    expect(body.paymentInfo.priceId).toBe(-1);
  });
});

describe('getOrderErrorMessage', () => {
  it('409 VOD_PASS_PRODUCT_CHANGED 는 다시 선택하라는 문구다', () => {
    expect(
      getOrderErrorMessage({ status: 409, code: 'VOD_PASS_PRODUCT_CHANGED' }),
    ).toBe('VOD 이용권 가격·기간이 변경되었으니 다시 선택해 주세요');
    expect(VOD_PASS_PRODUCT_CHANGED_MESSAGE).toBe(
      'VOD 이용권 가격·기간이 변경되었으니 다시 선택해 주세요',
    );
  });

  it('409 PAYMENT_ORDER_CONFLICT 는 결제 내역을 확인하라는 문구다', () => {
    expect(
      getOrderErrorMessage({ status: 409, code: 'PAYMENT_ORDER_CONFLICT' }),
    ).toBe('이미 처리된 주문과 정보가 다릅니다. 결제 내역을 확인해 주세요');
    expect(PAYMENT_ORDER_CONFLICT_MESSAGE).toBe(
      '이미 처리된 주문과 정보가 다릅니다. 결제 내역을 확인해 주세요',
    );
  });

  it('코드를 알 수 없는 409 는 구분하지 않는다 (기존 문구)', () => {
    expect(getOrderErrorMessage({ status: 409, code: 'API_ERROR' })).toBeNull();
    expect(getOrderErrorMessage({ status: 409 })).toBeNull();
  });

  it('409 가 아니면 같은 코드여도 구분하지 않는다', () => {
    expect(
      getOrderErrorMessage({ status: 400, code: 'VOD_PASS_PRODUCT_CHANGED' }),
    ).toBeNull();
    expect(
      getOrderErrorMessage({ status: 500, code: 'PAYMENT_ORDER_CONFLICT' }),
    ).toBeNull();
  });

  it('INVALID_PRICE 등 그 밖의 실패는 구분하지 않는다', () => {
    expect(
      getOrderErrorMessage({ status: 400, code: 'INVALID_PRICE' }),
    ).toBeNull();
  });

  it('객체가 아닌 값은 구분하지 않는다', () => {
    expect(getOrderErrorMessage(null)).toBeNull();
    expect(getOrderErrorMessage(undefined)).toBeNull();
    expect(getOrderErrorMessage('error')).toBeNull();
  });
});
