export interface ConfirmSentenceInput {
  /** 환불 금액이 실결제액과 같은가. */
  isFullRefund: boolean;
  refundAmount: number;
}

/**
 * 실행 전에 그대로 입력해야 하는 문장.
 *
 * 클릭 두 번으로 남의 결제가 취소되는 것을 막는다. 문장은 금액에 따라 달라진다 —
 * 문장이 실제 결과와 다르면 확인 절차가 무의미해지기 때문이다.
 *
 * 부분 환불도 참여를 끝내므로 뒷문장은 전액과 같다.
 */
export const buildRefundConfirmSentence = ({
  isFullRefund,
  refundAmount,
}: ConfirmSentenceInput): string => {
  const action = isFullRefund
    ? '이 유저를 전체 환불 시킵니다.'
    : `이 유저에게 ${refundAmount.toLocaleString()}원을 환불합니다.`;

  return `${action} 이 유저는 대시보드에 입장할 수 없습니다.`;
};
