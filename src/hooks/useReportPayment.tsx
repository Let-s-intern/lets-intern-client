import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { couponInfoSchema } from '@/api/coupon';
import { useGetReportPriceDetail } from '../api/report';
import useReportApplicationStore from '../store/useReportApplicationStore';
import axios from '../utils/axios';

export interface ReportPriceInfo {
  report: number;
  feedback: number;
  discount: number;
  coupon: number;
  total: number;
  isFeedbackApplied: boolean;
}

const initialPayment = {
  report: 0,
  feedback: 0,
  discount: 0,
  coupon: 0,
  total: 0,
  isFeedbackApplied: false,
};

export default function useReportPayment() {
  // Sprint7 서류 진단 쿠폰 기능 없음
  const [payment, setPayment] = useState<ReportPriceInfo>(initialPayment);

  const { data: reportApplication, setReportApplication } =
    useReportApplicationStore();
  const { data: reportPriceDetail } = useGetReportPriceDetail(
    reportApplication.reportId!,
  );

  const applyCoupon = async (code: string) => {
    try {
      const res = await axios.get(`/coupon`, {
        params: {
          code,
          programType: 'REPORT',
        },
      });
      const data = res.data.data;

      setReportApplication({ couponId: data.couponId });
      return data;
    } catch (error) {
      if (
        isAxiosError(error) &&
        (error.response?.status === 404 || error.response?.status === 400)
      ) {
        return error.response?.data;
      } else {
        console.error(error);
      }
    }
  };

  const cancelCoupon = () => setReportApplication({ couponId: null });

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
    let report = reportPriceInfo?.price ?? 0; // 진단서 + 선택한 옵션 가격
    let discount = reportPriceInfo?.discountPrice ?? 0;
    const feedback = isFeedbackApplied
      ? (feedbackPriceInfo?.feedbackPrice ?? 0)
      : 0;

    // 사용자가 선택한 옵션 가격 책정
    for (const optionId of optionIds) {
      const optionInfo = reportOptionInfos?.find(
        (info) => info.reportOptionId === optionId,
      );
      if (optionInfo === undefined) continue;
      discount += optionInfo.discountPrice ?? 0;
      report += optionInfo.price ?? 0;
    }

    // 1:1 피드백 가격 책정
    if (isFeedbackApplied)
      discount += feedbackPriceInfo?.feedbackDiscountPrice ?? 0;

    setPayment((prev) => ({
      ...prev,
      discount,
      report,
      feedback,
      total: report + feedback - discount,
      isFeedbackApplied,
    }));

    // 쿠폰 가격 책정
    if (couponId === null) return;

    axios.get(`/coupon/admin/${couponId}`).then(async (res) => {
      const { discount } = couponInfoSchema.parse(res.data.data.couponInfo);
      setPayment((prev) => ({
        ...prev,
        coupon: discount === -1 ? (prev.total ?? 0) : (discount ?? 0),
        total: discount === -1 ? 0 : prev.total - (discount ?? 0),
      }));
    });
  }, [reportPriceDetail, reportApplication.couponId]);

  useEffect(() => {
    // 진단서 정보 업데이트
    setReportApplication({
      amount: payment.total,
      programPrice: payment.report + payment.feedback,
      programDiscount: payment.discount,
    });
  }, [payment]);

  return { payment, applyCoupon, cancelCoupon };
}
