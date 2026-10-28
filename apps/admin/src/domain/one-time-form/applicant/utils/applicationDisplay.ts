import type { AdminOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';

export type ApplicationStatus = 'PAID' | 'FREE' | 'CANCELED';

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;

/**
 * 결제 상태(계약 A8). 결제가 없으면 취소 여부보다 먼저 무료다.
 */
export const getApplicationStatus = (
  application: Pick<AdminOneTimeFormApplication, 'payment' | 'isCanceled'>,
): ApplicationStatus => {
  if (application.payment === null) return 'FREE';
  if (application.isCanceled) return 'CANCELED';
  return 'PAID';
};

/** `결제 완료`, `무료`, `취소(환불 39,000원)` */
export const getApplicationStatusLabel = (
  application: Pick<AdminOneTimeFormApplication, 'payment' | 'isCanceled'>,
) => {
  const status = getApplicationStatus(application);
  if (status === 'FREE') return '무료';
  if (status === 'CANCELED') {
    return `취소(환불 ${formatWon(application.payment.refundAmount)})`;
  }
  return '결제 완료';
};

/** 무료 폼은 `무료`, 0원 결제는 `0원` */
export const getPaymentAmountText = (
  payment: AdminOneTimeFormApplication['payment'],
) => (payment === null ? '무료' : formatWon(payment.paidAmount));

/** 스냅샷 순서(그룹 순서, 그룹 안 옵션 순서) 그대로 옵션 이름을 잇는다 */
export const getSelectedOptionsText = (
  selectedOptions: AdminOneTimeFormApplication['selectedOptions'],
) =>
  selectedOptions.length === 0
    ? '없음'
    : selectedOptions.map((option) => option.optionName).join(', ');
