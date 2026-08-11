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
 * 환불 범위.
 *
 * Payment.updateRefundPrice 가 남기는 흔적을 쓴다. 환불하면 원 결제액이 originalPrice 로
 * 옮겨가고 finalPrice 에 환불액이 덮어써지므로, 두 값이 같으면 전액이다.
 *
 * originalPrice 는 서버에서 null 이 아니라 0 으로 내려온다(엔티티 기본값). 그래서 0 을
 * 두 갈래로 읽어야 한다 — finalPrice 도 0 이면 0원 결제를 취소한 것이고, finalPrice 가
 * 남아 있으면 updateRefundPrice 가 돌지 않은 레거시 행이라 범위를 알 수 없다.
 */
const resolveScope = (
  finalPrice: number | null,
  originalPrice: number | null,
): '전체' | '부분' | null => {
  if (finalPrice == null || originalPrice == null) return null;
  if (originalPrice === 0) return finalPrice === 0 ? '전체' : null;
  return finalPrice === originalPrice ? '전체' : '부분';
};

/**
 * `환불여부` 표시.
 *
 * 예전에는 Y/N 뿐이라 유저가 규정대로 받은 환불과 운영이 예외로 처리한 환불이 같은 값으로 섞였다.
 * 어드민 환불도 금액을 지정할 수 있게 되면서 전체·부분을 함께 보여준다.
 */
export const resolveRefundLabel = ({
  isCanceled,
  isAdminRefunded,
  finalPrice,
  originalPrice,
}: RefundLabelInput): RefundLabel => {
  if (!isCanceled) return { text: 'N', isRefunded: false, isAdmin: false };

  const scope = resolveScope(finalPrice, originalPrice);

  if (isAdminRefunded) {
    // 금액을 모르는 과거 이력은 전체로 둔다. 어드민 환불이 전액뿐이던 시절의 건이다.
    return {
      text: `어드민 ${scope ?? '전체'} 환불`,
      isRefunded: true,
      isAdmin: true,
    };
  }

  return {
    text: scope == null ? '유저 환불' : `유저 ${scope} 환불`,
    isRefunded: true,
    isAdmin: false,
  };
};

export interface RefundableInput {
  isCanceled: boolean;
  hasUser: boolean;
  finalPrice: number | null;
}

export interface RefundableState {
  canRefund: boolean;
  /** 부분 환불이 성립하는지. 실결제액이 0원이면 나눌 금액이 없다. */
  canPartialRefund: boolean;
  reason: string;
}

/**
 * 환불 버튼을 누를 수 있는지.
 *
 * 고아 신청서(user_id 가 NULL 이라 이름이 비는 행)는 대상자를 특정할 수 없어 확인 단계 자체가
 * 성립하지 않는다. 운영 DB 에 13건 있다. 서버도 알림톡·감사 로그 스냅샷에 user 를 쓰므로
 * 그대로 실행하면 NPE 가 난다.
 *
 * 0원 결제(100% 할인 쿠폰, 어드민 테스트 참여)는 전체 환불만 허용한다. 서버가 PG 호출을
 * 건너뛰고 참여만 취소하므로 취소 자체는 정상 동작이다.
 */
export const resolveRefundableState = ({
  isCanceled,
  hasUser,
  finalPrice,
}: RefundableInput): RefundableState => {
  if (isCanceled)
    return { canRefund: false, canPartialRefund: false, reason: '환불 완료' };
  if (!hasUser)
    return {
      canRefund: false,
      canPartialRefund: false,
      reason: '참여자 정보 없음',
    };
  return {
    canRefund: true,
    canPartialRefund: (finalPrice ?? 0) > 0,
    reason: '',
  };
};
