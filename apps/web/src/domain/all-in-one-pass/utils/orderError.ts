// 올인원패스 신청 생성 실패 사유별 안내 (LC-3533). 챌린지 domain/program/paymentSuccess/orderResult.ts 와 같은 방식이다.
// 아래 거절은 모두 서버가 토스 승인 전에 검증해 결제되지 않은 상태다 (MembershipApplicationServiceImpl).

export interface MembershipOrderError {
  message: string;
  /** VOD 선택이나 금액을 다시 골라야 하는 거절. 신청폼을 다시 받고 플랜 선택부터 하게 한다 */
  needsReselect: boolean;
}

const VOD_PASS_RESELECT_MESSAGES: Record<string, string> = {
  VOD_PASS_PRODUCT_CHANGED:
    'VOD 이용권 가격·기간이 변경되었으니 다시 선택해 주세요',
  VOD_PASS_PRODUCT_NOT_FOUND:
    'VOD 이용권 상품을 찾을 수 없어요. 다시 선택해 주세요',
  VOD_PASS_SALE_NOT_ENABLED:
    'VOD 이용권 판매가 종료되었어요. VOD 이용권 없이 다시 신청해 주세요',
  VOD_PASS_PURCHASE_MONTHS_EXCEEDED:
    '구매할 수 있는 VOD 이용 기간을 넘었어요. 개월 수를 다시 선택해 주세요',
  VOD_PASS_TOTAL_MONTHS_EXCEEDED:
    '보유할 수 있는 VOD 이용 기간을 넘었어요. 개월 수를 다시 선택해 주세요',
  MEMBERSHIP_PAYMENT_AMOUNT_MISMATCH:
    '결제 금액이 변경되었어요. 플랜을 다시 선택해 주세요',
};

const PAYMENT_ORDER_CONFLICT_MESSAGE =
  '이미 처리된 주문과 정보가 다릅니다. 결제 내역을 확인해 주세요';

/**
 * 구분해 안내할 거절이면 문구와 재선택 여부, 아니면 null (기존 실패 화면 그대로).
 * axios 인터셉터가 응답 에러를 ApiError(status, code)로 감싸 던진다. 서버 에러 코드는 이름이 겹치지 않아 code 로만 가른다.
 */
export function getMembershipOrderError(
  error: unknown,
): MembershipOrderError | null {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const { code } = error as { code?: unknown };
  if (typeof code !== 'string') {
    return null;
  }
  if (code === 'PAYMENT_ORDER_CONFLICT') {
    return { message: PAYMENT_ORDER_CONFLICT_MESSAGE, needsReselect: false };
  }
  const message = VOD_PASS_RESELECT_MESSAGES[code];
  return message ? { message, needsReselect: true } : null;
}
