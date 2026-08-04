export interface ConfirmSentenceInput {
  /** 환불 금액이 실결제액과 같은가. */
  isFullRefund: boolean;
  refundAmount: number;
  /** 참여자 행까지 지우는가. */
  hardDelete: boolean;
}

/**
 * 실행 전에 그대로 입력해야 하는 문장.
 *
 * 클릭 두 번으로 남의 결제가 취소되는 것을 막는다. 문장은 금액과 삭제 여부에 따라
 * 네 갈래로 갈린다 — 문장이 실제 결과와 다르면 확인 절차가 무의미해지기 때문이다.
 *
 * 삭제를 켰을 때 문장이 길어지는 것은 의도적이다. 길수록 붙여넣기 전에 읽는다.
 * 삭제를 끈 두 문장의 뒷부분이 같은 이유는 부분 환불도 참여를 끝내기 때문이다.
 */
export const buildRefundConfirmSentence = ({
  isFullRefund,
  refundAmount,
  hardDelete,
}: ConfirmSentenceInput): string => {
  const subject = isFullRefund
    ? '이 유저를 전체 환불'
    : `이 유저에게 ${refundAmount.toLocaleString()}원을 환불`;

  if (hardDelete) {
    return `${subject}하고 제출한 미션까지 완전히 삭제합니다. 되돌릴 수 없습니다.`;
  }

  const action = isFullRefund ? `${subject} 시킵니다.` : `${subject}합니다.`;
  return `${action} 이 유저는 대시보드에 입장할 수 없습니다.`;
};
