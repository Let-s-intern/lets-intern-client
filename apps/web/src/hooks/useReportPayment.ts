import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { useGetReportPriceDetail } from '../api/report';
import useReportApplicationStore from '../store/useReportApplicationStore';
import axios from '../utils/axios';

export interface ReportPriceInfo {
  report: number;
  option: number;
  feedback: number;
  reportDiscount: number;
  optionDiscount: number;
  feedbackDiscount: number;
  coupon: number;
  amount: number;
  isFeedbackApplied: boolean;
  final: boolean;
}

const initialPayment = {
  // 정가
  report: 0,
  option: 0,
  feedback: 0,
  // 할인 금액
  reportDiscount: 0,
  optionDiscount: 0,
  feedbackDiscount: 0,
  coupon: 0,
  amount: 0, // 결제 금액
  isFeedbackApplied: false,
  /** 계산 완료 여부 (payment -> application 로딩이 느려서 final로 판단함) */
  final: false,
};

export default function useReportPayment() {
  // Sprint7 서류 진단 쿠폰 기능 없음
  const [payment, setPayment] = useState<ReportPriceInfo>(initialPayment);

  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();
  const { data: reportPriceDetail } = useGetReportPriceDetail(
    reportApplication.reportId!,
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      try {
        const res = await axios.get(`/coupon`, {
          params: {
            code,
            programType: 'REPORT',
          },
        });
        const data = res.data.data;
        setReportApplication({
          couponId: data.couponId,
          couponDiscount: data.discount,
        });
        return data;
      } catch (error) {
        if (
          isAxiosError(error) &&
          (error.response?.status === 404 || error.response?.status === 400)
        ) {
          return error.response?.data;
        }
        console.error(error);
      }
    },
    [setReportApplication],
  );

  const cancelCoupon = useCallback(
    () =>
      setReportApplication({
        couponId: null,
        couponDiscount: 0,
        couponCode: '',
      }),
    [setReportApplication],
  );

  useEffect(() => {
    if (reportPriceDetail === undefined) return;

    setPayment(() => initialPayment); // 초기화하고 다시 계산

    const { reportPriceType, isFeedbackApplied, optionIds, couponId } =
      reportApplication;
    const { reportPriceInfos, feedbackPriceInfo, reportOptionInfos } =
      reportPriceDetail;
    const reportPriceInfo = reportPriceInfos?.find(
      (info) => info.reportPriceType === reportPriceType,
    );

    const report = reportPriceInfo?.price ?? 0;
    let option = 0;
    const reportDiscount = reportPriceInfo?.discountPrice ?? 0;
    let optionDiscount = 0;
    let feedbackDiscount = 0;
    const feedback = isFeedbackApplied
      ? (feedbackPriceInfo?.feedbackPrice ?? 0)
      : 0;

    // 사용자가 선택한 옵션 가격 책정
    for (const optionId of optionIds) {
      const optionInfo = reportOptionInfos?.find(
        (info) => info.reportOptionId === optionId,
      );

      if (optionInfo === undefined) continue;
      optionDiscount += optionInfo.discountPrice ?? 0;
      option += optionInfo.price ?? 0;
    }

    // 1:1 피드백 가격 책정
    if (isFeedbackApplied)
      feedbackDiscount = feedbackPriceInfo?.feedbackDiscountPrice ?? 0;

    setPayment((prev) => ({
      ...prev,
      report,
      option,
      feedback,
      reportDiscount,
      optionDiscount,
      feedbackDiscount,
      amount:
        report +
        option +
        feedback -
        (reportDiscount + optionDiscount + feedbackDiscount),
      isFeedbackApplied,
      // 쿠폰 가격 책정 (쿠폰은 1:1 피드백에 적용되지 않음)
      ...(couponId
        ? {
            coupon:
              reportApplication.couponDiscount === -1
                ? prev.amount - (prev.feedback - prev.feedbackDiscount)
                : (reportApplication.couponDiscount ?? 0),
            amount:
              reportApplication.couponDiscount === -1
                ? prev.feedback - prev.feedbackDiscount
                : prev.amount - (reportApplication.couponDiscount ?? 0),
          }
        : {}),
      final: true,
    }));
  }, [reportPriceDetail, reportApplication.couponId]);

  useEffect(() => {
    // 진단서 정보 업데이트
    setReportApplication(
      {
        amount: payment.amount,
        programPrice: payment.report + payment.feedback + payment.option,
        programDiscount:
          payment.reportDiscount +
          payment.feedbackDiscount +
          payment.optionDiscount,
      },
      payment.final === true ? true : undefined,
    );
  }, [payment, setReportApplication]);

  return { payment, applyCoupon, cancelCoupon };
}
