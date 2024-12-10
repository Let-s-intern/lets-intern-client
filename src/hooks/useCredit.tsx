import dayjs from 'dayjs';
import { useMemo } from 'react';

import { usePaymentDetailQuery } from '@/api/payment';

/** 프로그램 결제 내역 로직 */
export default function useCredit(paymentId?: string | number) {
  const { data, isLoading, isError } = usePaymentDetailQuery(String(paymentId));

  // 결제 취소 가능한 프로그램이면 true 아니면 false
  const isCancelable = useMemo(() => {
    if (
      !data ||
      (data.tossInfo && data.tossInfo?.status !== 'DONE') ||
      data.programInfo.isCanceled
    ) {
      return false;
    }

    if (data.programInfo.programType === 'CHALLENGE') {
      const start = dayjs(data.programInfo.startDate);
      const end = dayjs(data.programInfo.endDate);
      const now = dayjs();

      const duration = end.diff(start, 'day') + 1;
      const mid = Math.ceil(duration / 2);

      return now.isBefore(start.add(mid, 'day'));
    } else {
      return dayjs().isBefore(dayjs(data.programInfo.startDate));
    }
  }, [data]);

  // 결제 취소된 내역이면 true
  const isCanceled =
    data &&
    ((data.tossInfo && data.tossInfo.status !== 'DONE') ||
      data.programInfo.isCanceled === true)
      ? true
      : false;

  // 페이백 내역이면 true
  const isRefunded = data && data.paymentInfo.isRefunded;

  // 총 결제금액
  const totalPayment = useMemo(() => {
    if (!data) return 0;

    return data.tossInfo && data.tossInfo.totalAmount
      ? data.tossInfo.totalAmount
      : (data.priceInfo.price ?? 0) -
          (data.priceInfo.discount ?? 0) -
          (data.paymentInfo?.couponDiscount === -1
            ? (data.priceInfo.price ? data.priceInfo.price : 0) -
              (data.priceInfo.discount ? data.priceInfo.discount : 0)
            : data.paymentInfo?.couponDiscount
              ? data.paymentInfo.couponDiscount
              : 0);
  }, [data]);

  // 총 환불금액
  const totalRefund = useMemo(() => {
    if (!data) return 0;

    return (
      (data.tossInfo?.totalAmount ?? 0) - (data.tossInfo?.balanceAmount ?? 0)
    );
  }, [data]);

  // 결제상품 금액 = 이용료 + 보증금
  const productAmount = useMemo(() => {
    if (!data) return 0;

    return (data.priceInfo.price ?? 0) + (data.paymentInfo.paybackPrice ?? 0);
  }, [data]);

  // 할인율
  const discountPercent = useMemo(() => {
    if (!data) return 0;
    return (((data.priceInfo.discount ?? 0) / productAmount) * 100).toFixed(0);
  }, [data, productAmount]);

  // 부분환불 비율
  const refundPercent = useMemo(() => {
    const start = dayjs(data?.programInfo.startDate);
    const end = dayjs(data?.programInfo.endDate);
    const now = dayjs();

    // 프로그램 시작 전이면 전액 환불
    if (now.isBefore(start)) {
      return 1;
    }

    /** 부분 환불 규정
     * 챌린지 진행 1/3 전이면: 2/3 부분환불
     * 챌린지 진행 1/2 전이면: 1/2 부분환불
     */
    const duration = end.diff(start, 'day') + 1;
    const d3 = start.add(Math.ceil(duration / 3), 'day');
    const d2 = start.add(Math.ceil(duration / 2), 'day');

    if (now.isBefore(d3)) return 2 / 3;
    if (now.isBefore(d2)) return 1 / 2;
    return 0;
  }, [data]);

  // 예정 환불금액
  const expectedTotalRefund = useMemo(() => {
    /** 0원 환불
     * 1. 무료 프로그램: 결제 금액이 0원인 경우
     * 2. 프로그램 모두 수료한 경우
     */
    if (
      data?.paymentInfo.finalPrice === 0 ||
      !data?.tossInfo?.balanceAmount ||
      data.tossInfo.status !== 'DONE' ||
      !data.priceInfo.price ||
      !data.priceInfo.discount
    ) {
      return 0;
    }

    /** 환불 로직
     * 1. 전액 환불: 최종 결제 금액
     * 2. 부분 환불: (최종 결제 금액 + 쿠폰 금액) * (환불 퍼센트) - 쿠폰 금액
     */
    const couponPrice = data.paymentInfo.couponDiscount || 0;
    const refundPrice = nearestTen(
      ((data.paymentInfo.finalPrice ?? 0) +
        (data.paymentInfo.couponDiscount ?? 0)) *
        refundPercent -
        couponPrice,
    );

    return Math.max(0, refundPrice);
  }, [data, refundPercent]);

  /** CreditDelete 페이지에서 사용
   * isPartialRefundExpected: 부분 환불이 예상되면 true
   * expectedPartialRefundDeductionAmount: 부분 환불에서 차감될 금액 (렛츠커리어가 먹을 금액)
   */
  const isPartialRefundExpected =
    expectedTotalRefund !== data?.paymentInfo.finalPrice;
  const expectedPartialRefundDeductionAmount =
    totalPayment - expectedTotalRefund;

  /** CreditDetail 페이지에서 사용
   * isPartialRefunded: 부분환불 한 내역이면 true
   * partialRefundDeductionAmount: 부분 환불에서 차감된 금액 (렛츠커리어가 먹은 금액)
   */
  const isPartialRefunded = totalRefund !== data?.tossInfo?.totalAmount;
  const partialRefundDeductionAmount =
    (data?.tossInfo?.totalAmount ?? 0) - totalRefund;

  // 페이백으로 인한 환불
  const isPayback = useMemo(
    () =>
      data?.tossInfo?.cancels &&
      data?.tossInfo.cancels.find(
        (cancel) => cancel.cancelReason === '챌린지 페이백',
      ),
    [data?.tossInfo],
  );

  return {
    data,
    isLoading,
    isError,
    productAmount,
    discountPercent,
    isRefunded,
    isCanceled,
    isCancelable,
    refundPercent,
    isPartialRefundExpected,
    expectedPartialRefundDeductionAmount,
    expectedTotalRefund,
    isPayback,
    isPartialRefunded,
    partialRefundDeductionAmount,
    totalRefund,
  };
}

const nearestTen = (amount: number): number => {
  return Math.floor(amount / 10) * 10;
};
