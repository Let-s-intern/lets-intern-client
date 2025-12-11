'use client';

import dayjs from '@/lib/dayjs';
import { AxiosError } from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

import {
  convertReportPriceType,
  useDeleteReportApplication,
  useGetReportPaymentDetailQuery,
} from '@/api/report';
import ReportCreditRow from '@/domain/mypage/credit/ReportCreditRow';
import ReportCreditSubRow from '@/domain/mypage/credit/ReportCreditSubRow';
import DescriptionBox from '@/domain/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '@/domain/program/paymentSuccess/PaymentInfoRow';
import {
  getCouponDiscountPrice,
  getFeedbackDiscountedPrice,
  getFeedbackRefundPercent,
  getReportDiscountedPrice,
  getReportRefundPercent,
  getTotalRefund,
  nearestTen,
} from '@/lib/refund';

const convertDateFormat = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const ReportCreditDeleteContent = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const params = useParams<{ paymentId: string }>();
  const paymentId = params.paymentId;

  const {
    data: reportPaymentDetail,
    isLoading: reportPaymentDetailIsLoading,
    isError: reportPaymentDetailIsError,
  } = useGetReportPaymentDetailQuery({
    applicationId: Number(applicationId),
    enabled: applicationId !== null,
  });

  const { mutate: tryCancelReportApplication } = useDeleteReportApplication({
    successCallback: () => {
      router.push(
        `/mypage/credit/report/${paymentId}?applicationId=${applicationId}`,
      );
    },
    errorCallback: (error) => {
      const err = error as AxiosError<{ status: number; message: string }>;
      alert(
        err.response ? err.response.data.message : '결제 취소에 실패했습니다.',
      );
    },
  });

  const optionTitle = useMemo(() => {
    if (reportPaymentDetail?.reportPaymentInfo.reportOptionInfos.length === 0)
      return '없음';

    const titleList =
      reportPaymentDetail?.reportPaymentInfo.reportOptionInfos.map((option) =>
        option?.optionTitle.startsWith('+') ? '문항 추가' : option?.optionTitle,
      );

    // "문항 추가" 중복 제거
    return [...new Set(titleList)].join(', ');
  }, [reportPaymentDetail?.reportPaymentInfo.reportOptionInfos]);

  const applicationInfo = reportPaymentDetail?.reportApplicationInfo;
  const paymentInfo = reportPaymentDetail?.reportPaymentInfo;

  const reportDiscountedPrice = useMemo(() => {
    return getReportDiscountedPrice(paymentInfo);
  }, [paymentInfo]);

  const couponDiscountPrice = useMemo(() => {
    return getCouponDiscountPrice(paymentInfo);
  }, [paymentInfo]);

  const feedbackRefundPercent = useMemo(() => {
    return getFeedbackRefundPercent({
      now: dayjs(),
      paymentInfo,
      reportFeedbackStatus:
        reportPaymentDetail?.reportApplicationInfo.reportFeedbackStatus,
      reportFeedbackDesiredDate: dayjs(
        reportPaymentDetail?.reportApplicationInfo.reportFeedbackDesiredDate,
      ),
    });
  }, [paymentInfo, reportPaymentDetail]);

  const feedbackDiscountPrice = useMemo(() => {
    return getFeedbackDiscountedPrice(paymentInfo);
  }, [paymentInfo]);

  const totalRefund = useMemo(() => {
    if (!reportPaymentDetail) {
      return 0;
    }

    return getTotalRefund({
      now: dayjs(),
      applicationInfo,
      paymentInfo,
      reportApplicationStatus:
        reportPaymentDetail.reportApplicationInfo.reportApplicationStatus,
      reportFeedbackStatus:
        reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus,
      reportFeedbackDesiredDate: dayjs(
        reportPaymentDetail.reportApplicationInfo.reportFeedbackDesiredDate,
      ),
    });
  }, [paymentInfo, reportPaymentDetail]);

  const reportRefundPercent = useMemo(() => {
    if (!reportPaymentDetail) {
      return 0;
    }

    return getReportRefundPercent({
      now: dayjs(),
      applicationInfo,
      paymentInfo,
      reportApplicationStatus:
        reportPaymentDetail.reportApplicationInfo.reportApplicationStatus,
    });
  }, [paymentInfo, reportPaymentDetail, applicationInfo]);

  return (
    <section
      className="flex w-full flex-col px-5 md:px-0"
      data-program-text={reportPaymentDetail?.reportApplicationInfo?.title}
    >
      <DescriptionBox type="DELETE" />
      <div className="flex w-full flex-col gap-y-10 py-8">
        {!reportPaymentDetail ? (
          reportPaymentDetailIsLoading ? (
            <p className="text-neutral-0">결제내역을 불러오는 중입니다.</p>
          ) : reportPaymentDetailIsError ? (
            <p className="text-neutral-0">
              결제내역을 불러오는 중 오류가 발생했습니다.
            </p>
          ) : (
            <p className="text-neutral-0">결제내역이 없습니다.</p>
          )
        ) : (
          <>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              <div className="font-semibold text-neutral-0">결제 프로그램</div>
              <div className="flex w-full items-start justify-center gap-x-4">
                <img
                  className="h-[97px] w-[137px] rounded-sm object-cover"
                  src="/images/report-banner.jpg"
                  alt="thumbnail"
                />
                <div className="flex grow flex-col items-start justify-center gap-y-3">
                  <div className="font-semibold">
                    {reportPaymentDetail.reportApplicationInfo.title}
                  </div>
                  <div className="flex w-full flex-col gap-y-1">
                    <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                      <div className="shrink-0 text-neutral-30">상품</div>
                      <div className="text-primary-dark">{`서류 진단서 (${convertReportPriceType(reportPaymentDetail.reportApplicationInfo.reportPriceType)}${reportPaymentDetail.reportApplicationInfo.reportFeedbackApplicationId ? ', 1:1 온라인 상담' : ''})`}</div>
                    </div>
                    <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                      <div className="shrink-0 text-neutral-30">옵션</div>
                      <div className="text-primary-dark">{optionTitle}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              <div className="font-semibold text-neutral-0">환불 정보</div>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="flex w-full items-center justify-start gap-3 border-y-[1.5px] border-neutral-0 px-3 py-5">
                  <div className="flex w-full items-center justify-start gap-3 font-bold text-neutral-0">
                    <div>예정 환불금액</div>
                    <div className="flex grow items-center justify-end">
                      {totalRefund.toLocaleString()}원
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col p-3">
                  <div className="flex w-full flex-col">
                    <ReportCreditRow
                      title={`서류 진단서 (${convertReportPriceType(reportPaymentDetail.reportApplicationInfo.reportPriceType)}+옵션) 예정 환불 금액`}
                      content={
                        Math.max(
                          0,
                          nearestTen(
                            reportDiscountedPrice * reportRefundPercent,
                          ) - couponDiscountPrice,
                        ).toLocaleString() + '원'
                      }
                    />
                    <div className="flex w-full flex-col">
                      <ReportCreditSubRow
                        title="결제금액"
                        content={`${(reportDiscountedPrice - couponDiscountPrice).toLocaleString()}원`}
                      />
                      {reportDiscountedPrice - couponDiscountPrice > 0 && (
                        <ReportCreditSubRow
                          title={`환불 차감 금액 (${Math.ceil((1 - reportRefundPercent) * 100)}%)`}
                          content={`-${(
                            reportDiscountedPrice -
                            couponDiscountPrice -
                            Math.max(
                              0,
                              nearestTen(
                                reportDiscountedPrice * reportRefundPercent,
                              ) - couponDiscountPrice,
                            )
                          ).toLocaleString()}원`}
                        />
                      )}
                    </div>
                  </div>
                  {reportPaymentDetail.reportApplicationInfo
                    .reportFeedbackApplicationId && (
                    <div className="flex w-full flex-col">
                      <ReportCreditRow
                        title={`1:1 온라인 상담 예정 환불 금액`}
                        content={
                          nearestTen(
                            feedbackDiscountPrice * feedbackRefundPercent,
                          ).toLocaleString() + '원'
                        }
                      />
                      <div className="flex w-full flex-col">
                        <ReportCreditSubRow
                          title="결제금액"
                          content={`${feedbackDiscountPrice.toLocaleString()}원`}
                        />
                        <ReportCreditSubRow
                          title={`환불 차감 금액 (${Math.ceil((1 - feedbackRefundPercent) * 100)}%)`}
                          content={`-${(
                            feedbackDiscountPrice -
                            nearestTen(
                              feedbackDiscountPrice * feedbackRefundPercent,
                            )
                          ).toLocaleString()}원`}
                        />
                      </div>
                    </div>
                  )}
                  <div className="py-2 text-xs font-medium text-primary-dark">
                    *환불 규정은{' '}
                    <a
                      className="underline underline-offset-2"
                      href="https://letscareer.oopy.io/5eb0ebdd-e10c-4aa1-b28a-8bd0964eca0b"
                      target="_blank"
                      rel="noreferrer"
                    >
                      자주 묻는 질문
                    </a>
                    을 참고해주세요
                  </div>
                </div>
                <hr className="w-full border-neutral-85" />
                <div className="flex w-full flex-col">
                  <PaymentInfoRow
                    title="결제일자"
                    content={
                      reportPaymentDetail.tossInfo
                        ? reportPaymentDetail.tossInfo?.status === 'CANCELED' &&
                          reportPaymentDetail.tossInfo.cancels
                          ? convertDateFormat(
                              reportPaymentDetail.tossInfo?.cancels[0]
                                .canceledAt || '',
                            )
                          : convertDateFormat(
                              reportPaymentDetail.tossInfo?.requestedAt || '',
                            )
                        : convertDateFormat(
                            reportPaymentDetail.reportPaymentInfo
                              .lastModifiedDate || '',
                          )
                    }
                  />
                  {reportPaymentDetail.tossInfo && (
                    <>
                      <PaymentInfoRow
                        title="결제수단"
                        content={reportPaymentDetail.tossInfo?.method || ''}
                      />
                      <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                        <div className="text-neutral-40">영수증</div>
                        <div className="flex grow items-center justify-end text-neutral-0">
                          <button
                            className="flex items-center justify-center rounded-sm border border-neutral-60 bg-white px-2.5 py-1.5 text-sm font-medium"
                            onClick={() => {
                              if (reportPaymentDetail.tossInfo?.receipt) {
                                window.open(
                                  reportPaymentDetail.tossInfo.receipt.url ||
                                    '',
                                  '_blank',
                                );
                              }
                            }}
                          >
                            영수증 보기
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div
                className="flex cursor-pointer items-center gap-x-3"
                onClick={() => setIsChecked(!isChecked)}
              >
                <img
                  src={
                    isChecked
                      ? '/icons/check-circle.svg'
                      : '/icons/check-circle-uncheck.svg'
                  }
                  alt="checkbox"
                />
                <p
                  className={`font-medium ${isChecked ? 'text-primary' : 'text-black/35'}`}
                >
                  환불 정보를 확인하셨나요?
                </p>
              </div>
              <div className="flex w-full items-center gap-x-3">
                <button
                  className="h-[46px] grow rounded-sm border-2 border-primary bg-neutral-100 px-5 py-2 font-medium text-primary-dark"
                  onClick={() => router.back()}
                >
                  이전
                </button>
                <button
                  className={`h-[46px] grow rounded-sm ${isChecked ? 'bg-primary' : 'cursor-not-allowed bg-primary-20'} px-5 py-2 font-medium text-neutral-100`}
                  onClick={() => {
                    if (isChecked) {
                      tryCancelReportApplication(Number(applicationId));
                    } else {
                      alert('환불 정보를 확인해주세요.');
                    }
                  }}
                >
                  결제 취소하기
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const ReportCreditDelete = () => (
  <Suspense fallback={null}>
    <ReportCreditDeleteContent />
  </Suspense>
);

export default ReportCreditDelete;
