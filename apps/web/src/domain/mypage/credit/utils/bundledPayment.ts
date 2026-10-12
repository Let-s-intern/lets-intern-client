import type { PaymentDetailType } from '@/api/payment/paymentSchema';

/**
 * 한 번의 PG 승인에 묶인 결제(챌린지 + VOD 이용권)의 상세를 이 행 기준으로 맞춘다 (LC-3438).
 *
 * 상세 응답의 `tossInfo` 는 PG 거래 전체다. 합계·잔액·상태가 묶음 단위라 그대로 두면
 * 챌린지 환불 화면에 이용권 금액이 "환불 차감"으로 보이고, 이용권만 환불해도 챌린지가
 * 취소된 것으로 보인다(PG 상태가 PARTIAL_CANCELED 가 되기 때문). 환불·상세 계산은
 * `tossInfo` 를 행 단위로 읽으므로 입력을 행 기준으로 바꿔 넘긴다. 계산식은 그대로다.
 *
 * - 항목이 둘 미만이거나 이 행의 금액을 찾지 못하면 원본을 그대로 돌려준다
 * - 행 금액은 `paymentItems[].paidAmount`(구매 당시 금액)이고, 환불된 행의 환불액은
 *   `paymentInfo.finalPrice` 다(환불 후 서버가 환불액으로 덮어쓴다)
 */
export function scopePaymentDetailToRow(
  detail: PaymentDetailType,
  paymentId: number,
): PaymentDetailType {
  const items = detail.paymentItems ?? [];
  const { tossInfo } = detail;
  if (items.length < 2 || !tossInfo) {
    return detail;
  }

  const own = items.find((item) => item.paymentId === paymentId);
  if (!own || typeof own.paidAmount !== 'number') {
    return detail;
  }

  const isRowCanceled = detail.programInfo.isCanceled === true;
  const refundedAmount = isRowCanceled
    ? Math.min(own.paidAmount, detail.paymentInfo.finalPrice ?? 0)
    : 0;

  const transactionStatus = tossInfo.status;
  const status = isRowCanceled
    ? transactionStatus === 'DONE'
      ? 'CANCELED'
      : transactionStatus
    : transactionStatus === 'CANCELED' ||
        transactionStatus === 'PARTIAL_CANCELED'
      ? 'DONE'
      : transactionStatus;

  return {
    ...detail,
    tossInfo: {
      ...tossInfo,
      totalAmount: own.paidAmount,
      balanceAmount: own.paidAmount - refundedAmount,
      status,
    },
  };
}
