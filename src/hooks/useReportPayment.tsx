import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetReportPriceDetail } from '../api/report';
import useReportApplicationStore from '../store/useReportApplicationStore';

export default function useReportPayment() {
  const { reportId } = useParams();

  const [priceInfo, setPriceInfo] = useState({
    report: 0,
    feedback: 0,
    discount: 0,
    coupon: 0,
    total: 0,
  });

  const { data: reportApplication } = useReportApplicationStore();
  const { data: reportPriceDetail } = useGetReportPriceDetail(Number(reportId));

  useEffect(() => {
    const reportPriceInfo = reportPriceDetail?.reportPriceInfos?.find(
      (info) => info.reportPriceType === reportApplication.reportPriceType,
    );
    const feedbackPriceInfo = reportPriceDetail?.feedbackPriceInfo;

    const report = reportPriceInfo?.price as number;
    const feedback = feedbackPriceInfo?.feedbackPrice as number;
    let discount = 0;
    let total = 0;

    discount += reportPriceInfo?.discountPrice as number;
    reportApplication.optionIds.forEach((optionId) => {
      discount += reportPriceDetail?.reportOptionInfos?.find(
        (info) => info.reportOptionId === optionId,
      )?.discountPrice as number;
    });

    if (reportApplication.isFeedbackApplied)
      discount += feedbackPriceInfo?.feedbackDiscountPrice as number;

    total = report + feedback - discount;

    setPriceInfo({
      report,
      feedback,
      discount,
      coupon: 0,
      total,
    });
  }, [reportPriceDetail]);

  return [priceInfo, setPriceInfo];
}
