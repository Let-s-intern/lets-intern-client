import type {
  MyOneTimeFormApplication,
  OneTimeFormAnswerItem,
} from '@/api/one-time-form/oneTimeFormSchema';
import { formatMonthDayWithWeekday } from '../../complete/utils/cancelDeadlineText';
import { formatWon } from '../../payment/utils/paymentAmount';
import { formatDotDate } from '../../utils/applyPeriodText';

export type MyApplicationStatus =
  | 'CANCELABLE'
  | 'PAST_DEADLINE'
  | 'CANCELED'
  | 'NONE';

/** U2 응답으로 화면 상태를 고른다. isCancelable 은 서버가 마감과 취소 여부로 계산한 값이다(계약 U2) */
export const deriveMyApplicationStatus = (
  application: MyOneTimeFormApplication,
): MyApplicationStatus => {
  if (!application) return 'NONE';
  if (application.isCanceled) return 'CANCELED';
  return application.isCancelable ? 'CANCELABLE' : 'PAST_DEADLINE';
};

/** 신청 시점 기본 금액 = 결제액 - 옵션 스냅샷 추가 금액 합(계약 6.2) */
export const calculateBasePrice = (
  paidAmount: number,
  selectedOptions: { additionalPrice: number }[],
) =>
  selectedOptions.reduce(
    (rest, option) => rest - option.additionalPrice,
    paidAmount,
  );

/** 답을 한 줄 문자열로. 체크박스는 쉼표로 잇고, 첨부는 파일명만 쓴다(열지 않는다) */
export const formatAnswerValue = (value: OneTimeFormAnswerItem['value']) => {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return value.name;
  return String(value);
};

/** "2026-11-02T13:24:00" -> "2026.11.02 13:24" */
export const formatDotDateTime = (dateTime: string) =>
  `${formatDotDate(dateTime)} ${dateTime.slice(11, 16)}`;

/** 상태별 안내 문구(시안 5절). 0원·무료는 돌려줄 돈이 없어 환불 문장을 뺀다 */
export const buildStatusNotice = (
  application: NonNullable<MyOneTimeFormApplication>,
): string => {
  const { cancelDeadline, payment, canceledAt } = application;
  const paidAmount = payment?.paidAmount ?? 0;
  const refundAmount = payment?.refundAmount ?? 0;

  switch (deriveMyApplicationStatus(application)) {
    case 'CANCELED': {
      const canceledText = canceledAt
        ? `${formatDotDateTime(canceledAt)}에 취소했어요.`
        : '취소한 신청이에요.';
      return refundAmount > 0
        ? `${canceledText} ${formatWon(refundAmount)}을 결제한 수단으로 돌려드려요.`
        : canceledText;
    }
    case 'PAST_DEADLINE':
      return `취소 기간(${cancelDeadline.slice(5, 10).replace('-', '.')}까지)이 지나 직접 취소할 수 없어요. 사정이 있으면 채널톡으로 문의해 주세요.`;
    default: {
      const deadlineText = `${formatMonthDayWithWeekday(cancelDeadline)} ${cancelDeadline.slice(11, 16)}까지 취소할 수 있어요.`;
      return paidAmount > 0
        ? `${deadlineText} 취소하면 결제 금액 전액을 돌려드려요.`
        : deadlineText;
    }
  }
};
