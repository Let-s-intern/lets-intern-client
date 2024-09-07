import { useEffect, useState } from 'react';

import { isAxiosError } from 'axios';
import { useGetReportPriceDetail } from '../api/report';
import useReportApplicationStore from '../store/useReportApplicationStore';
import axios from '../utils/axios';

export interface ReportPriceInfo {
  report: number;
  feedback: number;
  discount: number;
  coupon: number;
  total: number;
}

export default function useReportPayment() {
  // Sprint7 서류 진단 쿠폰 기능 없음
  const [payment, setPayment] = useState({
    report: 0,
    feedback: 0,
    discount: 0,
    coupon: 0,
    total: 0,
  });

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
      setPayment((prev) => ({
        ...prev,
        coupon: res.data.data.discount,
      }));
      return res.data.data;
    } catch (error) {
      if (
        isAxiosError(error) &&
        (error.response?.status === 404 || error.response?.status === 400)
      )
        return error.response?.data;
      console.error(error);
    }
  };

  const cancelCoupon = () => {
    setPayment((prev) => ({
      ...prev,
      coupon: 0,
    }));
  };

  useEffect(() => {
    if (reportPriceDetail === undefined) return;

    const reportPriceInfo = reportPriceDetail.reportPriceInfos?.find(
      (info) => info.reportPriceType === reportApplication.reportPriceType,
    );
    const feedbackPriceInfo = reportPriceDetail.feedbackPriceInfo;
    const feedback = reportApplication.isFeedbackApplied
      ? (feedbackPriceInfo?.feedbackPrice as number)
      : 0;
    let report = reportPriceInfo?.price as number; // 진단서 + 선택한 옵션 가격
    let discount = 0;

    discount += reportPriceInfo?.discountPrice as number;
    // 사용자가 선택한 옵션 가격 책정
    reportApplication.optionIds.forEach((optionId) => {
      const optionInfo = reportPriceDetail.reportOptionInfos?.find(
        (info) => info.reportOptionId === optionId,
      );
      if (optionInfo !== undefined) {
        discount += optionInfo.discountPrice as number;
        report += optionInfo.price as number;
      }
    });
    // 1:1 피드백 가격 책정
    if (reportApplication.isFeedbackApplied)
      discount += feedbackPriceInfo?.feedbackDiscountPrice as number;
    // 결제 금액 책정
    const total = report + feedback - discount;

    setPayment({
      report,
      feedback,
      discount,
      coupon: 0,
      total,
    });
    setReportApplication({
      amount: total,
      programPrice: report + feedback,
      programDiscount: discount,
    });
  }, [reportPriceDetail]);

  return { payment, applyCoupon, cancelCoupon };
}
