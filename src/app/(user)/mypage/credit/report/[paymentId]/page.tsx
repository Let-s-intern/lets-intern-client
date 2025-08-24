'use client';

import dayjs from '@/lib/dayjs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import {
  convertReportPriceType,
  useGetReportPaymentDetailQuery,
} from '@/api/report';
import { useUserQuery } from '@/api/user';
import MoreButton from '@/components/common/mypage/ui/button/MoreButton';
import PaymentInfoRow from '@/components/common/program/paymentSuccess/PaymentInfoRow';
import Input from '@/components/common/ui/input/Input';
import {
  getCouponDiscountPrice,
  getFeedbackDiscountedPrice,
  getPercent,
  getReportDiscountedPrice,
  getReportPrice,
} from '@/lib/refund';
import ReportCreditRow from '@components/common/mypage/credit/ReportCreditRow';
import ReportCreditSubRow from '@components/common/mypage/credit/ReportCreditSubRow';
import { useMemo } from 'react';

const convertDateFormat = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const ReportCreditDetail = () => {
  const router = useRouter();
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

  const {
    data: userData,
    isLoading: userDataIsLoading,
    isError: userDataIsError,
  } = useUserQuery();

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

  const paymentInfo = reportPaymentDetail?.reportPaymentInfo;

  const isBasicCancelable = () => {
    // 0. 서류 제출 후 3시간 이내
    const isBefore3Hours =
      dayjs().diff(
        dayjs(reportPaymentDetail?.reportApplicationInfo.applyUrlDate),
        'hour',
      ) < 3;

    // 1. 서류 제출 후 3시간이후 ~ 진단서 발급 완료
    const isAfter3Hours =
      dayjs().diff(
        dayjs(reportPaymentDetail?.reportApplicationInfo.applyUrlDate),
        'hour',
      ) >= 3;

    // 2. 진단서 발급 완료 후
    const isAfterReportIssued =
      reportPaymentDetail?.reportApplicationInfo.reportApplicationStatus ===
        'REPORTED' ||
      reportPaymentDetail?.reportApplicationInfo.reportApplicationStatus ===
        'COMPLETED';

    if (isAfterReportIssued) return false;
    if (isBefore3Hours || isAfter3Hours) return true;
    else return false;
  };

  const isFeedbackCancelable = () => {
    // 0. 1:1피드백 결제하지 않은 경우 false
    if (
      !reportPaymentDetail?.reportApplicationInfo.reportFeedbackApplicationId
    ) {
      return false;
    }

    // 1. 일정 확정 이전
    const isBeforeFeedbackConfirmed =
      reportPaymentDetail?.reportApplicationInfo.reportFeedbackStatus ===
        'APPLIED' ||
      reportPaymentDetail?.reportApplicationInfo.reportFeedbackStatus ===
        'PENDING';

    // 2. 일정 확정 후 ~ 1:1 피드백 일정 24시간 이전
    const isAfterFeedbackConfirmed =
      reportPaymentDetail?.reportApplicationInfo.reportFeedbackStatus ===
        'CONFIRMED' &&
      reportPaymentDetail?.reportApplicationInfo.reportFeedbackDesiredDate &&
      dayjs().isBefore(
        dayjs(
          reportPaymentDetail.reportApplicationInfo.reportFeedbackDesiredDate,
        ).subtract(1, 'day'),
      );

    // 3. 1:1 피드백 일정 24시간 이전
    const isBeforeFeedbackDate =
      reportPaymentDetail?.reportApplicationInfo.reportFeedbackDesiredDate &&
      (dayjs().isSame(
        dayjs(
          reportPaymentDetail?.reportApplicationInfo.reportFeedbackDesiredDate,
        ).subtract(1, 'day'),
      ) ||
        (dayjs().isAfter(
          dayjs(
            reportPaymentDetail?.reportApplicationInfo
              .reportFeedbackDesiredDate,
          ).subtract(1, 'day'),
        ) &&
          dayjs().isBefore(
            dayjs(
              reportPaymentDetail?.reportApplicationInfo
                .reportFeedbackDesiredDate,
            ),
          )));

    // 4. 1:1 피드백 일정 이후
    const isAfterFeedbackDate =
      reportPaymentDetail?.reportApplicationInfo.reportFeedbackStatus ===
        'COMPLETED' ||
      (reportPaymentDetail?.reportApplicationInfo.reportFeedbackDesiredDate &&
        (dayjs().isSame(
          dayjs(
            reportPaymentDetail?.reportApplicationInfo
              .reportFeedbackDesiredDate,
          ),
        ) ||
          dayjs().isAfter(
            dayjs(
              reportPaymentDetail?.reportApplicationInfo
                .reportFeedbackDesiredDate,
            ),
          )));

    if (isAfterFeedbackDate) return false;
    if (
      isBeforeFeedbackDate ||
      isAfterFeedbackConfirmed ||
      isBeforeFeedbackConfirmed
    )
      return true;
    else return false;
  };

  const isCancelable = () => {
    if (
      !reportPaymentDetail ||
      (reportPaymentDetail.tossInfo &&
        reportPaymentDetail.tossInfo.status !== 'DONE') ||
      reportPaymentDetail.reportApplicationInfo.isCanceled
    ) {
      return false;
    }

    const isBasicCancel = isBasicCancelable();
    const isFeedbackCancel = isFeedbackCancelable();

    return isBasicCancel || isFeedbackCancel;
  };

  const isCanceled =
    reportPaymentDetail &&
    ((reportPaymentDetail.tossInfo &&
      reportPaymentDetail.tossInfo.status !== 'DONE') ||
      reportPaymentDetail.reportApplicationInfo.isCanceled === true)
      ? true
      : false;

  const isRefunded =
    reportPaymentDetail && reportPaymentDetail.reportPaymentInfo.isRefunded;

  const totalPayment = reportPaymentDetail
    ? getReportPrice(reportPaymentDetail.reportPaymentInfo) +
      (reportPaymentDetail.reportPaymentInfo.feedbackPriceInfo?.feedbackPrice ||
        0) -
      (reportPaymentDetail.reportPaymentInfo.programDiscount || 0) -
      getCouponDiscountPrice(reportPaymentDetail.reportPaymentInfo)
    : 0;

  const totalRefund = reportPaymentDetail
    ? (reportPaymentDetail.reportPaymentInfo.reportRefundPrice ?? 0) +
      (reportPaymentDetail.reportPaymentInfo.feedbackRefundPrice ?? 0)
    : 0;

  const reportPrice = useMemo(() => {
    return getReportPrice(paymentInfo);
  }, [paymentInfo]);

  const reportDiscountedPrice = useMemo(() => {
    return getReportDiscountedPrice(paymentInfo);
  }, [paymentInfo]);

  const couponDiscountPrice = useMemo(() => {
    return getCouponDiscountPrice(paymentInfo);
  }, [paymentInfo]);

  const feedbackDiscountedPrice = useMemo(() => {
    return getFeedbackDiscountedPrice(paymentInfo);
  }, [paymentInfo]);

  return (
    <section
      className="flex w-full flex-col px-5 md:px-0"
      data-program-text={reportPaymentDetail?.reportApplicationInfo?.title}
    >
      <div className="flex items-center justify-start gap-x-2">
        <img
          src="/icons/Arrow_Left_MD.svg"
          alt="arrow-left"
          className="h-6 w-6 cursor-pointer"
          onClick={() => {
            router.push(`/mypage/credit`);
          }}
        />
        <h1 className="text-lg font-medium text-neutral-0">결제상세</h1>
      </div>
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
              {isRefunded && (
                <div className="flex w-full gap-2 rounded-xxs bg-neutral-90 px-4 py-3">
                  <div className="text-sm font-semibold text-primary-dark">
                    페이백 완료
                  </div>
                  <div className="flex grow items-center justify-end">
                    {convertDateFormat(
                      reportPaymentDetail.tossInfo?.cancels
                        ? reportPaymentDetail.tossInfo.cancels[0].canceledAt
                          ? reportPaymentDetail.tossInfo.cancels[0].canceledAt
                          : ''
                        : reportPaymentDetail.reportPaymentInfo
                              ?.lastModifiedDate
                          ? reportPaymentDetail.reportPaymentInfo
                              .lastModifiedDate
                          : '',
                    )}
                  </div>
                </div>
              )}
              {!isRefunded && isCanceled && (
                <div className="flex w-full gap-2 rounded-xxs bg-neutral-90 px-4 py-3">
                  <div className="text-sm font-semibold text-system-error">
                    결제 취소
                  </div>
                  <div className="flex grow items-center justify-end">
                    {convertDateFormat(
                      reportPaymentDetail.tossInfo?.cancels
                        ? reportPaymentDetail.tossInfo.cancels[0].canceledAt
                          ? reportPaymentDetail.tossInfo.cancels[0].canceledAt
                          : ''
                        : (reportPaymentDetail.reportPaymentInfo?.createDate ??
                            ''),
                    )}
                  </div>
                </div>
              )}
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
              <div className="font-semibold text-neutral-0">참여자 정보</div>
              {!userData ? (
                userDataIsLoading ? (
                  <p className="text-neutral-0">
                    참여자 정보를 불러오는 중입니다.
                  </p>
                ) : userDataIsError ? (
                  <p className="text-neutral-0">
                    참여자 정보를 불러오는 중 오류가 발생했습니다.
                  </p>
                ) : (
                  <p className="text-neutral-0">참여자 정보가 없습니다.</p>
                )
              ) : (
                <div className="flex w-full flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-1-medium">
                      이름
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="김렛츠"
                      value={userData.name || ''}
                      onChange={() => {}}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="phoneNum" className="text-1-medium">
                      휴대폰 번호
                    </label>
                    <Input
                      id="phoneNum"
                      name="phoneNum"
                      placeholder="010-0000-0000"
                      value={userData.phoneNum || ''}
                      onChange={() => {}}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-1-medium">
                      이메일
                    </label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="example@example.com"
                      value={userData.email || ''}
                      onChange={() => {}}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              <div className="font-semibold text-neutral-0">
                {isCanceled ? '환불 정보' : '결제 정보'}
              </div>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="flex w-full flex-col items-center justify-start gap-y-2 border-y-[1.5px] border-neutral-0 px-3 py-5">
                  <div className="flex w-full items-center justify-start gap-3 font-bold text-neutral-0">
                    <div>{isCanceled ? '총 환불금액' : '총 결제금액'}</div>
                    <div className="flex grow items-center justify-end">
                      {reportPaymentDetail.tossInfo &&
                      typeof reportPaymentDetail.tossInfo.totalAmount ===
                        'number' &&
                      typeof reportPaymentDetail.tossInfo.balanceAmount ===
                        'number'
                        ? (isCanceled
                            ? reportPaymentDetail.tossInfo.totalAmount -
                              reportPaymentDetail.tossInfo.balanceAmount
                            : reportPaymentDetail.tossInfo.totalAmount
                          ).toLocaleString()
                        : reportPaymentDetail.reportPaymentInfo.finalPrice?.toLocaleString()}
                      원
                    </div>
                  </div>
                  {isCanceled && (
                    <div className="flex w-full flex-col">
                      <ReportCreditSubRow
                        title="총 결제금액"
                        content={`${totalPayment.toLocaleString()}원`}
                      />
                      <ReportCreditSubRow
                        title="환불 차감 금액"
                        content={`-${(reportPaymentDetail.tossInfo?.balanceAmount ?? 0).toLocaleString()}원`}
                      />
                    </div>
                  )}
                </div>
                <div className="flex w-full flex-col p-3">
                  <div className="flex w-full flex-col">
                    <ReportCreditRow
                      title={`서류 진단서 (${convertReportPriceType(reportPaymentDetail.reportApplicationInfo.reportPriceType)}+옵션) ${isCanceled ? '환불' : '결제'}금액`}
                      content={`${
                        isCanceled
                          ? (
                              reportPaymentDetail.reportPaymentInfo
                                .reportRefundPrice ?? 0
                            ).toLocaleString()
                          : (
                              reportDiscountedPrice - couponDiscountPrice
                            ).toLocaleString()
                      }원`}
                    />
                    {isCanceled ? (
                      <div className="flex w-full flex-col">
                        <ReportCreditSubRow
                          title="결제금액"
                          content={`${(
                            reportDiscountedPrice - couponDiscountPrice
                          ).toLocaleString()}원`}
                        />
                        {reportDiscountedPrice - couponDiscountPrice > 0 && (
                          <ReportCreditSubRow
                            title={`환불 차감 금액 (${getPercent({
                              originalPrice:
                                reportDiscountedPrice - couponDiscountPrice,
                              changedPrice:
                                reportDiscountedPrice -
                                couponDiscountPrice -
                                (reportPaymentDetail.reportPaymentInfo
                                  .reportRefundPrice ?? 0),
                            })}%)`}
                            content={`-${(
                              reportDiscountedPrice -
                              couponDiscountPrice -
                              (reportPaymentDetail.reportPaymentInfo
                                .reportRefundPrice ?? 0)
                            ).toLocaleString()}원`}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex w-full flex-col">
                        <ReportCreditSubRow
                          title="정가"
                          content={`${reportPrice.toLocaleString()}원`}
                        />
                        <ReportCreditSubRow
                          title="할인 금액"
                          content={`-${(
                            reportPrice - reportDiscountedPrice
                          ).toLocaleString()}원`}
                        />
                        <ReportCreditSubRow
                          title="쿠폰 할인 금액"
                          content={`-${couponDiscountPrice.toLocaleString()}원`}
                        />
                      </div>
                    )}
                  </div>
                  {reportPaymentDetail.reportApplicationInfo
                    .reportFeedbackApplicationId && (
                    <div className="flex w-full flex-col">
                      <ReportCreditRow
                        title={`1:1 온라인 상담 ${isCanceled ? '환불' : '결제'}금액`}
                        content={`${
                          isCanceled
                            ? (
                                reportPaymentDetail.reportPaymentInfo
                                  .feedbackRefundPrice ?? 0
                              ).toLocaleString()
                            : feedbackDiscountedPrice.toLocaleString()
                        }원`}
                      />
                      {isCanceled ? (
                        <div className="flex w-full flex-col">
                          <ReportCreditSubRow
                            title="결제금액"
                            content={`${feedbackDiscountedPrice.toLocaleString()}원`}
                          />
                          {feedbackDiscountedPrice > 0 && (
                            <ReportCreditSubRow
                              title={`환불 차감 금액 (${getPercent({
                                originalPrice: feedbackDiscountedPrice,
                                changedPrice:
                                  feedbackDiscountedPrice -
                                  (reportPaymentDetail.reportPaymentInfo
                                    .feedbackRefundPrice ?? 0),
                              })}%)`}
                              content={`-${(
                                feedbackDiscountedPrice -
                                (reportPaymentDetail.reportPaymentInfo
                                  .feedbackRefundPrice ?? 0)
                              ).toLocaleString()}원`}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex w-full flex-col">
                          <ReportCreditSubRow
                            title="정가"
                            content={`${(reportPaymentDetail.reportPaymentInfo.feedbackPriceInfo?.feedbackPrice ?? 0).toLocaleString()}원`}
                          />
                          <ReportCreditSubRow
                            title="할인 금액"
                            content={`-${(
                              reportPaymentDetail.reportPaymentInfo
                                .feedbackPriceInfo?.feedbackDiscountPrice ?? 0
                            ).toLocaleString()}원`}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {reportPaymentDetail.tossInfo &&
                    typeof reportPaymentDetail.tossInfo.totalAmount ===
                      'number' &&
                    typeof reportPaymentDetail.tossInfo.balanceAmount ===
                      'number' &&
                    reportPaymentDetail.tossInfo.totalAmount -
                      reportPaymentDetail.tossInfo.balanceAmount !==
                      (reportPaymentDetail.reportPaymentInfo
                        .reportRefundPrice ?? 0) +
                        (reportPaymentDetail.reportPaymentInfo
                          .feedbackRefundPrice ?? 0) && (
                      <>
                        <ReportCreditRow
                          title={`관리자 환불금액`}
                          content={`${(
                            reportPaymentDetail.tossInfo.totalAmount -
                            reportPaymentDetail.tossInfo.balanceAmount -
                            (reportPaymentDetail.reportPaymentInfo
                              .reportRefundPrice ?? 0) -
                            (reportPaymentDetail.reportPaymentInfo
                              .feedbackRefundPrice ?? 0)
                          ).toLocaleString()}원`}
                        />
                        <div className="flex w-full flex-col">
                          {reportPaymentDetail.tossInfo.cancels &&
                            reportPaymentDetail.tossInfo.cancels
                              .filter(
                                (cancel) => cancel.cancelAmount !== totalRefund,
                              )
                              .map((cancel, index) => (
                                <ReportCreditSubRow
                                  key={index}
                                  title={`${cancel.cancelReason}`}
                                  content={`${(cancel.cancelAmount ?? 0).toLocaleString()}원`}
                                />
                              ))}
                        </div>
                      </>
                    )}
                  {isCanceled && (
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
                  )}
                </div>
                <hr className="w-full border-neutral-85" />
                <div className="flex w-full flex-col py-3">
                  <PaymentInfoRow
                    title={
                      reportPaymentDetail.tossInfo?.status === 'CANCELED' ||
                      reportPaymentDetail.tossInfo?.status ===
                        'PARTIAL_CANCELED'
                        ? '환불일자'
                        : '결제일자'
                    }
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
              {isCancelable() ? (
                <button
                  className="flex w-full items-center justify-center rounded-sm bg-neutral-80 px-5 py-2.5 font-medium text-neutral-40"
                  onClick={() => {
                    router.push(
                      `/mypage/credit/report/${paymentId}/delete?applicationId=${applicationId}`,
                    );
                  }}
                >
                  결제 취소하기
                </button>
              ) : (
                <MoreButton
                  className="other_program w-full md:flex"
                  onClick={() => {
                    router.push('/report/landing');
                  }}
                >
                  진단 서비스 더 둘러보기
                </MoreButton>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ReportCreditDetail;
