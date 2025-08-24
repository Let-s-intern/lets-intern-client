'use client';

import { convertReportPriceType, useGetReportDetailQuery } from '@/api/report';
import Heading1 from '@/components/common/report/Heading1';
import Heading2 from '@/components/common/report/Heading2';
import Card from '@/components/common/report/ProgramCard';
import { paymentFailSearchParamsSchema } from '@/data/getPaymentSearchParams';
import useReportPayment from '@/hooks/useReportPayment';
import useReportProgramInfo from '@/hooks/useReportProgramInfo';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { searchParamsToObject } from '@/utils/network';
import ReportCreditRow from '@components/common/mypage/credit/ReportCreditRow';
import ReportCreditSubRow from '@components/common/mypage/credit/ReportCreditSubRow';
import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/** 처음부터 결제 실패 케이스일 시 이 페이지로 옵니다. 검증 단계에서의 실패는 PaymentResult에서 진행함. */
const ReportPaymentFail = () => {
  const isUpTo1280 = useMediaQuery('(max-width: 1280px)');
  const searchParams = useSearchParams();

  const { title, product, option } = useReportProgramInfo();
  const { data: reportApplication } = useReportApplicationStore();
  const { data: reportDetail } = useGetReportDetailQuery(
    reportApplication.reportId!,
  );
  const { payment } = useReportPayment();

  const params = useMemo(() => {
    const obj = searchParamsToObject(searchParams);
    const result = paymentFailSearchParamsSchema.safeParse(obj);
    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error(result.error);
      alert('잘못된 접근입니다.');
      return;
    }

    return result.data;
  }, [searchParams]);

  const paymentLink = useMemo(() => {
    if (isUpTo1280) {
      return `/report/payment/${reportDetail?.reportType?.toLocaleLowerCase()}/${reportApplication.reportId}`;
    }

    return `/report/apply/${reportDetail?.reportType?.toLocaleLowerCase()}/${reportApplication.reportId}`;
  }, [reportDetail, reportApplication.reportId, isUpTo1280]);

  const subTitle =
    reportApplication.optionIds.length === 0
      ? convertReportPriceType(reportApplication.reportPriceType)
      : `${convertReportPriceType(reportApplication.reportPriceType)} + 옵션`;

  return (
    <div className="mx-auto max-w-5xl px-5" data-program-text={title}>
      <Heading1>결제 확인하기</Heading1>
      <div className="flex min-h-52 w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-neutral-100 py-6">
          <div className="text-small20 font-semibold text-primary">
            결제가 실패했습니다❗️
          </div>
          <div className="text-xsmall16 text-neutral-20">{params?.message}</div>
        </div>
        <div className="flex w-full flex-col items-center justify-start gap-y-10 py-8">
          <div className="flex w-full flex-col items-start justify-center gap-6">
            <div className="text-xsmall16 font-semibold text-neutral-0">
              결제 프로그램
            </div>
            <Card
              imgSrc="/images/report-thumbnail.png"
              imgAlt="서류 진단서 프로그램 썸네일"
              title={title ?? ''}
              content={[
                { label: '상품', text: product },
                { label: '옵션', text: option },
              ]}
            />
          </div>
          <div className="flex w-full flex-col justify-center gap-6">
            <Heading2>결제 상세</Heading2>
            <div className="flex w-full items-center justify-between gap-x-4 bg-neutral-90 px-3 py-5">
              <div className="font-bold">예상 결제금액</div>
              <div className="font-bold">
                {payment.amount?.toLocaleString()}원
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center px-3">
              <div className="flex w-full flex-col">
                <ReportCreditRow
                  title={`서류진단서 (${subTitle})`}
                  content={
                    (
                      payment.report +
                      payment.option -
                      payment.reportDiscount -
                      payment.optionDiscount -
                      payment.coupon
                    ).toLocaleString() + '원'
                  }
                />
                <div className="flex w-full flex-col">
                  <ReportCreditSubRow
                    title="정가"
                    content={`${(payment.report + payment.option).toLocaleString()}원`}
                  />
                  <ReportCreditSubRow
                    title="할인 금액"
                    content={`-${(payment.reportDiscount + payment.optionDiscount).toLocaleString()}원`}
                  />
                  <ReportCreditSubRow
                    title="쿠폰 할인 금액"
                    content={`-${payment.coupon.toLocaleString()}원`}
                  />
                </div>
              </div>
              {payment.isFeedbackApplied && (
                <div className="flex w-full flex-col">
                  <ReportCreditRow
                    title="1:1 온라인 상담"
                    content={
                      (
                        payment.feedback - payment.feedbackDiscount
                      ).toLocaleString() + '원'
                    }
                  />
                  <div className="flex w-full flex-col">
                    <ReportCreditSubRow
                      title="정가"
                      content={`${payment.feedback.toLocaleString()}원`}
                    />
                    <ReportCreditSubRow
                      title="할인 금액"
                      content={`-${payment.feedbackDiscount.toLocaleString()}원`}
                    />
                  </div>
                </div>
              )}
            </div>
            <Link
              href={paymentLink}
              className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
            >
              다시 결제하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPaymentFail;