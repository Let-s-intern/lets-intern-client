// 신청 요청이 거부된 이유. 서버 에러 코드(ApiError.code)와 HTTP 상태가 모두 맞을 때만 가른다.
// 공유 getOrderErrorMessage 는 넓히지 않고 구매 팝업 안에서만 판정한다
export type PurchaseFailure = 'ALREADY_APPLIED' | 'PRICE_CHANGED' | 'UNKNOWN';

export const getPurchaseFailure = (error: unknown): PurchaseFailure => {
  const { status, code } = (error ?? {}) as {
    status?: unknown;
    code?: unknown;
  };
  if (status === 409 && code === 'CONFLICT_APPLICATION') {
    return 'ALREADY_APPLIED';
  }
  if (status === 400 && code === 'INVALID_PRICE') return 'PRICE_CHANGED';
  return 'UNKNOWN';
};
