import {
  ReportApplicationStatus,
  ReportFeedbackStatus,
  ReportPaymentInfo,
} from '@/api/report';
import dayjs from 'dayjs';

/** 10의 자리에서 내림합니다. */
export const nearestTen = (amount: number): number => {
  return Math.floor(amount / 10) * 10;
};

export const getReportPrice = (
  paymentInfo?: ReportPaymentInfo | null,
): number => {
  if (!paymentInfo) {
    return 0;
  }

  const defaultReportPrice = paymentInfo.reportPriceInfo.price;
  const optionsPrice = paymentInfo.reportOptionInfos.reduce((acc, option) => {
    return acc + (option?.price ?? 0);
  }, 0);

  return (defaultReportPrice ?? 0) + optionsPrice;
};

export const getReportDiscountedPrice = (
  paymentInfo?: ReportPaymentInfo | null,
): number => {
  if (!paymentInfo) {
    return 0;
  }

  const originalPrice = getReportPrice(paymentInfo);
  const discountPrice = paymentInfo.reportPriceInfo.discountPrice;
  const optionsDiscountPrice = paymentInfo.reportOptionInfos.reduce(
    (acc, option) => {
      return acc + (option?.discountPrice ?? 0);
    },
    0,
  );

  return originalPrice - ((discountPrice ?? 0) + optionsDiscountPrice);
};

export const getFeedbackDiscountedPrice = (
  paymentInfo?: ReportPaymentInfo | null,
): number => {
  if (!paymentInfo || !paymentInfo.feedbackPriceInfo) {
    return 0;
  }

  return (
    (paymentInfo.feedbackPriceInfo.feedbackPrice ?? 0) -
    (paymentInfo.feedbackPriceInfo.feedbackDiscountPrice ?? 0)
  );
};

export const getPercent = ({
  originalPrice,
  changedPrice,
}: {
  originalPrice: number;
  changedPrice: number;
}) => {
  return originalPrice === 0
    ? 0
    : Math.ceil((changedPrice / originalPrice) * 100);
};

export const getDiscountPercent = (
  paymentInfo?: ReportPaymentInfo | null,
): number => {
  if (!paymentInfo) {
    return 0;
  }

  const originalPrice = paymentInfo.reportPriceInfo.price;
  const discountPrice =
    paymentInfo.programDiscount ?? paymentInfo.reportPriceInfo.price;

  return getPercent({
    originalPrice: originalPrice ?? 0,
    changedPrice: discountPrice ?? 0,
  });
};

export const getCouponDiscountPrice = (
  paymentInfo?: ReportPaymentInfo | null,
): number => {
  if (!paymentInfo || !paymentInfo.couponDiscount) {
    return 0;
  }

  return paymentInfo.couponDiscount === -1
    ? (paymentInfo.programPrice ?? 0) - (paymentInfo.programDiscount ?? 0)
    : paymentInfo.couponDiscount;
};

export const getReportRefundPercent = ({
  now,
  paymentInfo,
  reportApplicationStatus,
}: {
  paymentInfo?: ReportPaymentInfo | null | undefined;
  now: dayjs.Dayjs;
  reportApplicationStatus: ReportApplicationStatus;
}) => {
  if (!paymentInfo) {
    return 0;
  }

  // 상태가 "신청완료"일 때 결제 후 3시간 이내 : 100% 환불
  if (
    reportApplicationStatus === 'APPLIED' &&
    now.diff(dayjs(paymentInfo.createDate), 'hour') < 3
  ) {
    return 1;
  }

  /**
   * 아래와 같은 케이스일 시 80% 환불
   *
   * 1. 상태가 "신청완료"이면서 결제 후 3시간 이후일 때
   * 2. 상태가 "진단중"일 때
   * 3. 상태가 "진단서 업로드"일 때
   */
  if (
    (reportApplicationStatus === 'APPLIED' &&
      now.diff(dayjs(paymentInfo.createDate), 'hour') >= 3) ||
    reportApplicationStatus === 'REPORTING' ||
    reportApplicationStatus === 'REPORTED'
  ) {
    return 0.8;
  }

  // 진단서 수령(발급완료) 후 : 환불 불가
  if (reportApplicationStatus === 'COMPLETED') {
    return 0;
  }

  return 0;
};

export const getFeedbackRefundPercent = ({
  now,
  paymentInfo,
  reportFeedbackStatus,
  reportFeedbackDesiredDate,
}: {
  paymentInfo?: ReportPaymentInfo | null | undefined;
  now: dayjs.Dayjs;
  reportFeedbackStatus: ReportFeedbackStatus | null | undefined;
  reportFeedbackDesiredDate?: dayjs.Dayjs | null | undefined;
}) => {
  if (!paymentInfo || !paymentInfo.feedbackPriceInfo || !reportFeedbackStatus) {
    return 0;
  }

  // 일정 확정 전 : 100% 환불
  if (
    reportFeedbackStatus === 'APPLIED' ||
    reportFeedbackStatus === 'PENDING'
  ) {
    return 1;
  }

  if (!reportFeedbackDesiredDate) {
    throw new Error('일정이 확정되었는데 일정이 없습니다.');
  }

  const remainingHours = reportFeedbackDesiredDate.diff(now, 'hour');
  // 일정 확정 후 ~ 확정된 일정 24시간 전 : 80% 환불
  if (reportFeedbackStatus === 'CONFIRMED' && remainingHours >= 24) {
    return 0.8;
  }

  // 확정된 일정 전 24시간 이내 : 50% 환불
  if (
    reportFeedbackStatus === 'CONFIRMED' &&
    remainingHours < 24 &&
    remainingHours >= 0
  ) {
    return 0.5;
  }

  // 확정된 일정 시간 이후 : 환불 불가
  if (
    reportFeedbackStatus === 'COMPLETED' ||
    (reportFeedbackStatus === 'CONFIRMED' && remainingHours < 0)
  ) {
    return 0;
  }

  return 0;
};

export const getTotalRefund = ({
  paymentInfo,
  reportApplicationStatus,
  reportFeedbackStatus,
  now,
  reportFeedbackDesiredDate,
}: {
  paymentInfo?: ReportPaymentInfo | null | undefined;
  reportApplicationStatus: ReportApplicationStatus;
  now: dayjs.Dayjs;
  reportFeedbackStatus: ReportFeedbackStatus | null | undefined;
  reportFeedbackDesiredDate: dayjs.Dayjs | null | undefined;
}) => {
  if (!paymentInfo || paymentInfo.finalPrice === 0) {
    return 0;
  }

  const couponPrice = paymentInfo.couponDiscount || 0;

  const refundReportPrice =
    getReportDiscountedPrice(paymentInfo) *
    getReportRefundPercent({ now, paymentInfo, reportApplicationStatus });

  const refundFeedbackPrice =
    getFeedbackDiscountedPrice(paymentInfo) *
    getFeedbackRefundPercent({
      now,
      paymentInfo,
      reportFeedbackStatus,
      reportFeedbackDesiredDate,
    });

  const refundPrice = nearestTen(
    Math.max(0, refundReportPrice - couponPrice) + refundFeedbackPrice,
  );

  return refundPrice;
};
