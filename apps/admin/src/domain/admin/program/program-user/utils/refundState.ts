/** 어드민 테스트 참여로 만들어진 결제. paymentKey 와 orderId 에 같은 값이 들어간다. */
const TEST_PAYMENT_PREFIX = 'TEST_CHALLENGE_';

export const isTestPayment = (orderId: string | null): boolean =>
  !!orderId && orderId.startsWith(TEST_PAYMENT_PREFIX);

export interface RefundLabelInput {
  isCanceled: boolean;
  isAdminRefunded: boolean;
  finalPrice: number | null;
  originalPrice: number | null;
}

export interface RefundLabel {
  text: string;
  isRefunded: boolean;
  isAdmin: boolean;
}

/**
 * `환불여부` 표시.
 *
 * 예전에는 Y/N 뿐이라 유저가 규정대로 받은 환불과 운영이 예외로 처리한 환불이 같은 값으로 섞였다.
 *
 * 전체·부분 판별은 Payment.updateRefundPrice 가 남기는 흔적을 쓴다. 환불하면 원 결제액이
 * originalPrice 로 옮겨가고 finalPrice 에 환불액이 덮어써지므로, 두 값이 같으면 전액이다.
 * 어드민 환불은 언제나 전액이라 범위를 따로 계산하지 않는다.
 */
export const resolveRefundLabel = ({
  isCanceled,
  isAdminRefunded,
  finalPrice,
  originalPrice,
}: RefundLabelInput): RefundLabel => {
  if (!isCanceled) return { text: 'N', isRefunded: false, isAdmin: false };

  if (isAdminRefunded) {
    return { text: '어드민 전체 환불', isRefunded: true, isAdmin: true };
  }

  // originalPrice 가 없으면 전체·부분을 판단할 근거가 없다. 단정하지 않는다.
  if (originalPrice == null || finalPrice == null) {
    return { text: '유저 환불', isRefunded: true, isAdmin: false };
  }

  return {
    text: finalPrice === originalPrice ? '유저 전체 환불' : '유저 부분 환불',
    isRefunded: true,
    isAdmin: false,
  };
};

export interface RefundableInput {
  isCanceled: boolean;
  hasUser: boolean;
  isTestPayment: boolean;
}

export interface RefundableState {
  canRefund: boolean;
  reason: string;
}

/**
 * 환불 버튼을 누를 수 있는지.
 *
 * 고아 신청서(user_id 가 NULL 이라 이름이 비는 행)는 대상자를 특정할 수 없어 확인 단계 자체가
 * 성립하지 않는다. 운영 DB 에 13건 있다.
 */
export const resolveRefundableState = ({
  isCanceled,
  hasUser,
  isTestPayment: testPayment,
}: RefundableInput): RefundableState => {
  if (isCanceled) return { canRefund: false, reason: '환불 완료' };
  if (!hasUser) return { canRefund: false, reason: '참여자 정보 없음' };
  if (testPayment) return { canRefund: false, reason: '테스트 결제' };
  return { canRefund: true, reason: '' };
};
