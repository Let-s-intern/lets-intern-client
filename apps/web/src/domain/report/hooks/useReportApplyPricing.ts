import { ReportPriceDetail } from '@/api/report';
import { ReportApplication } from '@/store/useReportApplicationStore';
import { useMemo } from 'react';

/**
 * ReportApplyBottomSheet 의 가격/옵션 파생값 계산.
 * 라디오 플랜 선택(radioValue/reportDiagnosisPlan)은 렌더와 강하게 얽혀 있어 컴포넌트에 두고,
 * priceDetail + reportApplication 으로부터 순수 계산되는 옵션 분류·금액만 분리한다.
 */
export function useReportApplyPricing({
  priceDetail,
  reportApplication,
}: {
  priceDetail: ReportPriceDetail;
  reportApplication: ReportApplication;
}) {
  const { isFeedbackApplied } = reportApplication;

  // 현직자 피드백 옵션
  const employeeOptionInfos = priceDetail.reportOptionInfos?.filter(
    (info) => !info.optionTitle?.startsWith('+'),
  );

  // 자기소개서 문항 추가 옵션
  const questionOptionInfos = priceDetail.reportOptionInfos?.filter((info) =>
    info.optionTitle?.startsWith('+'),
  );

  // 사용자가 추가한 문항 추가 옵션
  const selectedQuestionOptions = useMemo(() => {
    let length = 0;
    const price = questionOptionInfos?.reduce((acc, curr) => {
      if (reportApplication.optionIds.includes(curr.reportOptionId)) {
        length++;
        return acc + (curr.price ?? 0);
      }
      return acc;
    }, 0);
    const discount = questionOptionInfos?.reduce((acc, curr) => {
      if (reportApplication.optionIds.includes(curr.reportOptionId))
        return acc + (curr.discountPrice ?? 0);
      return acc;
    }, 0);
    return { length, price, discount };
  }, [reportApplication, questionOptionInfos]);

  const reportFinalPrice = useMemo(() => {
    let result = 0;

    const reportPrice = priceDetail?.reportPriceInfos?.find(
      (item) => item.reportPriceType === reportApplication.reportPriceType,
    );

    if (reportPrice) {
      result += reportPrice.price ?? 0;
    }

    result += reportApplication.optionIds.reduce((acc, optionId) => {
      const option = priceDetail?.reportOptionInfos?.find(
        (option) => option.reportOptionId === optionId,
      );

      if (!option) {
        return acc;
      }

      return acc + (option.price ?? 0);
    }, 0);

    return result;
  }, [
    priceDetail?.reportOptionInfos,
    priceDetail?.reportPriceInfos,
    reportApplication,
  ]);

  const reportFinalDiscountPrice = useMemo(() => {
    let result = 0;

    const reportPrice = priceDetail?.reportPriceInfos?.find(
      (item) => item.reportPriceType === reportApplication.reportPriceType,
    );

    if (reportPrice) {
      result += reportPrice.discountPrice ?? 0;
    }

    result += reportApplication.optionIds.reduce((acc, optionId) => {
      const option = priceDetail?.reportOptionInfos?.find(
        (option) => option.reportOptionId === optionId,
      );

      if (!option) {
        return acc;
      }

      return acc + (option.discountPrice ?? 0);
    }, 0);

    return result;
  }, [
    priceDetail?.reportOptionInfos,
    priceDetail?.reportPriceInfos,
    reportApplication,
  ]);

  const feedbackFinalPrice = isFeedbackApplied
    ? (priceDetail?.feedbackPriceInfo?.feedbackPrice ?? 0)
    : 0;
  const feedbackFinalDiscountPrice = isFeedbackApplied
    ? (priceDetail?.feedbackPriceInfo?.feedbackDiscountPrice ?? 0)
    : 0;

  const optionsAvailable =
    priceDetail.reportOptionInfos && priceDetail.reportOptionInfos.length > 0;

  return {
    employeeOptionInfos,
    questionOptionInfos,
    selectedQuestionOptions,
    reportFinalPrice,
    reportFinalDiscountPrice,
    feedbackFinalPrice,
    feedbackFinalDiscountPrice,
    optionsAvailable,
  };
}
