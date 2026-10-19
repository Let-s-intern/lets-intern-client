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
  getOrderErrorMessage,
  getVodPassResultNotice,
  isVodPassProductChangedError,
  PAYMENT_ORDER_CONFLICT_MESSAGE,
  VOD_PASS_PRODUCT_CHANGED_MESSAGE,
} from './orderResult';

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

describe('isVodPassProductChangedError', () => {
  it('409 VOD_PASS_PRODUCT_CHANGED 만 참이다', () => {
    expect(
      isVodPassProductChangedError({
        status: 409,
        code: 'VOD_PASS_PRODUCT_CHANGED',
      }),
    ).toBe(true);
    expect(
      isVodPassProductChangedError({
        status: 409,
        code: 'PAYMENT_ORDER_CONFLICT',
      }),
    ).toBe(false);
    expect(
      isVodPassProductChangedError({
        status: 400,
        code: 'VOD_PASS_PRODUCT_CHANGED',
      }),
    ).toBe(false);
    expect(isVodPassProductChangedError(null)).toBe(false);
  });
});

describe('getVodPassResultNotice', () => {
  const base = {
    applicationId: 91,
    startsAt: '2026-10-16T10:00:00+09:00',
    endsAt: '2027-01-14T10:00:00+09:00',
  };

  it('ACTIVE 는 지금부터 이용할 수 있다고 안내한다', () => {
    expect(getVodPassResultNotice({ ...base, status: 'ACTIVE' })).toBe(
      'VOD 이용권을 지금부터 이용할 수 있습니다. 이용 기간은 2026.10.16 ~ 2027.01.14 입니다',
    );
  });

  it('SCHEDULED 는 시작 예정일을 안내한다', () => {
    expect(getVodPassResultNotice({ ...base, status: 'SCHEDULED' })).toContain(
      '2026.10.16부터 VOD 이용권 이용이 시작됩니다',
    );
  });

  it('기간이나 상태를 모르면 마이페이지 확인 안내로 대신한다', () => {
    const fallback = /마이페이지 결제 내역에서 확인할 수 있습니다/;

    expect(getVodPassResultNotice(null)).toMatch(fallback);
    expect(getVodPassResultNotice(undefined)).toMatch(fallback);
    expect(
      getVodPassResultNotice({ ...base, status: 'ACTIVE', endsAt: null }),
    ).toMatch(fallback);
    expect(getVodPassResultNotice({ ...base, status: 'UNKNOWN' })).toMatch(
      fallback,
    );
  });
});
