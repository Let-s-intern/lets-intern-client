import { getPurchaseFailure } from './purchaseFailure';

describe('getPurchaseFailure', () => {
  it('409 CONFLICT_APPLICATION 은 이미 신청한 것으로 본다', () => {
    expect(
      getPurchaseFailure({ status: 409, code: 'CONFLICT_APPLICATION' }),
    ).toBe('ALREADY_APPLIED');
  });

  it('400 INVALID_PRICE 는 가격이 바뀐 것으로 본다', () => {
    expect(getPurchaseFailure({ status: 400, code: 'INVALID_PRICE' })).toBe(
      'PRICE_CHANGED',
    );
  });

  it('다른 코드, 상태가 어긋난 코드, 코드 없는 오류는 알 수 없음이다', () => {
    expect(getPurchaseFailure({ status: 409, code: 'API_ERROR' })).toBe(
      'UNKNOWN',
    );
    expect(getPurchaseFailure({ status: 500, code: 'INVALID_PRICE' })).toBe(
      'UNKNOWN',
    );
    expect(getPurchaseFailure(new Error('Network Error'))).toBe('UNKNOWN');
    expect(getPurchaseFailure(undefined)).toBe('UNKNOWN');
  });
});
