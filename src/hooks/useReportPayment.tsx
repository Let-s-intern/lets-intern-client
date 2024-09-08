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
      const data = res.data.data;

      setPayment((prev) => ({
        ...prev,
        coupon: data.discount,
        total: prev.total - data.discount,
      }));
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

  const cancelCoupon = () => {
    const prevCoupon = payment.coupon;
    setPayment((prev) => ({
      ...prev,
      coupon: 0,
      total: prev.total + prevCoupon,
    }));
  };

  useEffect(() => {
    if (reportPriceDetail === undefined) return;

    const reportPriceInfo = reportPriceDetail.reportPriceInfos?.find(
      (info) => info.reportPriceType === reportApplication.reportPriceType,
    );
    const feedbackPriceInfo = reportPriceDetail.feedbackPriceInfo;
    let report = reportPriceInfo?.price ?? 0; // 진단서 + 선택한 옵션 가격
    let discount = 0;

    discount += reportPriceInfo?.discountPrice ?? 0;
    // 사용자가 선택한 옵션 가격 책정
    reportApplication.optionIds.forEach((optionId) => {
      const optionInfo = reportPriceDetail.reportOptionInfos?.find(
        (info) => info.reportOptionId === optionId,
      );
      if (optionInfo !== undefined) {
        discount += optionInfo.discountPrice ?? 0;
        report += optionInfo.price ?? 0;
      }
    });

    // 1:1 피드백 가격 책정
    if (reportApplication.isFeedbackApplied)
      discount += feedbackPriceInfo?.feedbackDiscountPrice ?? 0;

    setPayment((prev) => ({
      ...prev,
      discount,
      report,
      feedback: reportApplication.isFeedbackApplied
        ? (feedbackPriceInfo?.feedbackPrice ?? 0)
        : 0,
    }));

    // 쿠폰 가격 책정
    if (reportApplication.couponId !== null) {
      axios.get(`/coupon/admin/${reportApplication.couponId}`).then((res) => {
        const data = couponInfoSchema.parse(res.data.data.couponInfo);
        setPayment((prev) => ({
          ...prev,
          coupon: data.discount ?? 0,
          total:
            prev.report + prev.feedback - prev.discount - (data.discount ?? 0),
        }));
      });
    } else {
      setPayment((prev) => ({
        ...prev,
        total: prev.report + prev.feedback - prev.discount,
      }));
    }
  }, [reportPriceDetail]);

  useEffect(() => {
    setReportApplication({
      amount: payment.total,
      programPrice: payment.report + payment.feedback,
      programDiscount: payment.discount,
    });
  }, [payment]);

  return { payment, applyCoupon, cancelCoupon };
}
