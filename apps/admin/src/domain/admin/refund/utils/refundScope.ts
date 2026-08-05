import type { AdminRefundLog } from '@/api/adminRefund';

/**
 * 환불 금액이 원 결제액의 전부인지 일부인지.
 *
 * 실패한 건은 돈이 나가지 않았으므로 범위를 말할 수 없다. 환불액 0 을 그대로
 * 부분으로 읽으면 실패 이력이 부분 환불처럼 보인다.
 * 원 결제액이 없는 과거 이력도 단정하지 않는다.
 */
export const resolveRefundScope = (
  log: Pick<AdminRefundLog, 'status' | 'refundedAmount' | 'originalAmount'>,
): '전액' | '부분' | null => {
  if (log.status !== 'SUCCESS') return null;
  if (log.refundedAmount == null || log.originalAmount == null) return null;

  return log.refundedAmount === log.originalAmount ? '전액' : '부분';
};
