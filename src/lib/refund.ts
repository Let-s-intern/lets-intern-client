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
    return acc + option.price;
  }, 0);

  return defaultReportPrice + optionsPrice;
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
      return acc + option.discountPrice;
    },
    0,
  );

  return originalPrice - (discountPrice + optionsDiscountPrice);
};

export const getFeedbackDiscountedPrice = (
  paymentInfo?: ReportPaymentInfo | null,
): number => {
  if (!paymentInfo || !paymentInfo.feedbackPriceInfo) {
    return 0;
  }

  return (
    paymentInfo.feedbackPriceInfo.feedbackPrice -
    paymentInfo.feedbackPriceInfo.feedbackDiscountPrice
  );
};

export const getPercent = ({
  originalPrice,
  changedPrice,
}: {
  originalPrice: number;
  changedPrice: number;
}) => {
  return Math.floor((changedPrice / originalPrice) * 100);
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

  return getPercent({ originalPrice, changedPrice: discountPrice });
};

export const getCouponDiscountPrice = (
  paymentInfo?: ReportPaymentInfo | null,
): number => {
  if (!paymentInfo || !paymentInfo.couponDiscount) {
    return 0;
  }

  return paymentInfo.couponDiscount === -1
    ? paymentInfo.programPrice - paymentInfo.programDiscount
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

  // 결제 후 3시간 이내 : 100% 환불
  if (now.diff(dayjs(paymentInfo.createDate), 'hour') < 3) {
    return 1;
  }

  // 결제 후 3시간 후 ~ 진단서 수령(발급완료) 전 : 80% 환불
  if (
    now.diff(dayjs(paymentInfo.createDate), 'hour') >= 3 &&
    reportApplicationStatus !== 'COMPLETED' &&
    reportApplicationStatus !== 'REPORTED'
  ) {
    return 0.8;
  }

  // 진단서 수령(발급완료) 후 : 환불 불가
  if (
    reportApplicationStatus === 'COMPLETED' ||
    reportApplicationStatus === 'REPORTED'
  ) {
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
    reportFeedbackStatus !== 'CONFIRMED' &&
    reportFeedbackStatus !== 'COMPLETED'
  ) {
    return 1;
  }

  if (!reportFeedbackDesiredDate) {
    throw new Error('일정이 확정되었는데 일정이 없습니다.');
  }

  // 일정 확정 후 ~ 확정된 일정 24시간 전 : 80% 환불
  const remainingHours = reportFeedbackDesiredDate.diff(now, 'hour');

  if (
    reportFeedbackStatus !== 'COMPLETED' &&
    reportFeedbackStatus === 'CONFIRMED' &&
    remainingHours >= 24
  ) {
    return 0.8;
  }

  // 확정된 일정 전 24시간 이내 : 50% 환불
  if (
    reportFeedbackStatus !== 'COMPLETED' &&
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
