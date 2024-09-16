import dayjs from 'dayjs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  convertReportPriceType,
  useGetReportPaymentDetailQuery,
} from '../../../api/report';
import { useUserQuery } from '../../../api/user';
import MoreButton from '../../../components/common/mypage/ui/button/MoreButton';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';
import Input from '../../../components/common/ui/input/Input';

const convertDateFormat = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const getPercent = ({
  originalPrice,
  changedPrice,
}: {
  originalPrice: number;
  changedPrice: number;
}) => {
  return Math.floor((changedPrice / originalPrice) * 100);
};

const ReportCreditDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const { paymentId } = useParams<{ paymentId: string }>();

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

  const getOptionTitleList = () => {
    if (!reportPaymentDetail) return [];

    if (
      !reportPaymentDetail.reportPaymentInfo.reportOptionInfos ||
      reportPaymentDetail.reportPaymentInfo.reportOptionInfos.length === 0
    )
      return '없음';

    return reportPaymentDetail.reportPaymentInfo.reportOptionInfos
      .map((option) => option?.title)
      .join(', ');
  };

  const getReportPrice = () => {
    if (!reportPaymentDetail) return 0;

    const defaultReportPrice =
      reportPaymentDetail.reportPaymentInfo.reportPriceInfo.price;
    const optionsPrice =
      reportPaymentDetail.reportPaymentInfo.reportOptionInfos.reduce(
        (acc, option) => {
          return acc + (option?.price ?? 0);
        },
        0,
      );

    return (defaultReportPrice ?? 0) + optionsPrice;
  };

  const getDiscountPercent = () => {
    if (!reportPaymentDetail) return 0;

    const originalPrice =
      reportPaymentDetail.reportPaymentInfo.reportPriceInfo.price;
    const discountPrice = reportPaymentDetail.reportPaymentInfo.programDiscount;

    return getPercent({
      originalPrice: originalPrice ?? 0,
      changedPrice: discountPrice ?? 0,
    });
  };

  const getCouponDiscountPrice = () => {
    if (
      !reportPaymentDetail ||
      !reportPaymentDetail.reportPaymentInfo.couponDiscount
    )
      return 0;

    return reportPaymentDetail.reportPaymentInfo.couponDiscount === -1
      ? (reportPaymentDetail.reportPaymentInfo.programPrice ?? 0) -
          (reportPaymentDetail.reportPaymentInfo.programDiscount ?? 0)
      : reportPaymentDetail.reportPaymentInfo.couponDiscount;
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

    const now = dayjs();
    const {
      reportApplicationStatus,
      reportFeedbackDesiredDate,
      reportFeedbackStatus,
    } = reportPaymentDetail.reportApplicationInfo;

    // 진단서 수령 후 - 환불 불가
    const isAfterReportIssued = reportApplicationStatus === 'COMPLETED';

    // 1:1 첨삭 일정 확정 후 - 확정된 시간 이후 - 환불 불가
    const isAfterFeedbackConfirmed =
      reportFeedbackStatus === 'COMPLETED' ||
      (reportFeedbackStatus === 'CONFIRMED' &&
        reportFeedbackDesiredDate &&
        (now.isAfter(reportFeedbackDesiredDate) ||
          now.isSame(reportFeedbackDesiredDate)));

    // 환불 가능한지 확인
    return !isAfterReportIssued || !isAfterFeedbackConfirmed;
  };

  const isCanceled =
    reportPaymentDetail &&
    ((reportPaymentDetail.tossInfo &&
      reportPaymentDetail.tossInfo.status !== 'DONE') ||
      reportPaymentDetail.reportApplicationInfo.isCanceled === true)
      ? true
      : false;

  const totalPayment = reportPaymentDetail
    ? getReportPrice() +
      (reportPaymentDetail.reportPaymentInfo.feedbackPriceInfo?.feedbackPrice ||
        0) -
      (reportPaymentDetail.reportPaymentInfo.programDiscount || 0) -
      getCouponDiscountPrice()
    : 0;

  const totalRefund = reportPaymentDetail
    ? (reportPaymentDetail.reportPaymentInfo.reportRefundPrice ?? 0) +
      (reportPaymentDetail.reportPaymentInfo.feedbackRefundPrice ?? 0)
    : 0;

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
            navigate(`/mypage/credit`);
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
              {isCanceled ? (
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
                        : reportPaymentDetail.reportPaymentInfo
                              ?.lastModifiedDate
                          ? reportPaymentDetail.reportPaymentInfo
                              .lastModifiedDate
                          : '',
                    )}
                  </div>
                </div>
              ) : null}
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
                      <div className="text-primary-dark">{`서류 진단서 (${convertReportPriceType(reportPaymentDetail.reportApplicationInfo.reportPriceType)}${reportPaymentDetail.reportApplicationInfo.reportFeedbackApplicationId ? ', 1:1 피드백' : ''})`}</div>
                    </div>
                    <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                      <div className="shrink-0 text-neutral-30">옵션</div>
                      <div className="text-primary-dark">
                        {getOptionTitleList()}
                      </div>
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
              <div className="flex w-full flex-col items-start justify-start gap-y-3">
                <div className="flex w-full flex-col items-center justify-start gap-3 border-y-[1.5px] border-neutral-0 px-3 py-5">
                  <div className="flex w-full items-center justify-start gap-3 font-bold text-neutral-0">
                    <div>{isCanceled ? '총 환불금액' : '총 결제금액'}</div>
                    <div className="flex grow items-center justify-end">
                      {reportPaymentDetail.tossInfo
                        ? reportPaymentDetail.tossInfo.status !== 'DONE' &&
                          reportPaymentDetail.tossInfo.cancels
                          ? reportPaymentDetail.tossInfo.cancels[0].cancelAmount?.toLocaleString()
                          : reportPaymentDetail.tossInfo.balanceAmount?.toLocaleString()
                        : reportPaymentDetail.reportPaymentInfo.finalPrice?.toLocaleString()}
                      원
                    </div>
                  </div>
                  {isCanceled && (
                    <div className="flex w-full flex-col">
                      <div className="flex w-full items-center justify-between gap-3 py-2 text-xsmall14 text-neutral-45">
                        <div>총 결제금액</div>
                        <div className="flex grow items-center justify-end">
                          {totalPayment.toLocaleString()}원
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between gap-3 py-2 text-xsmall14 text-neutral-45">
                        <div>{`환불 차감 금액 (${getPercent({
                          originalPrice: totalPayment,
                          changedPrice: totalPayment - totalRefund,
                        })}%)`}</div>
                        <div className="flex grow items-center justify-end">
                          {(totalPayment - totalRefund).toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex w-full flex-col">
                  <PaymentInfoRow
                    title={`서류 진단서 (${convertReportPriceType(reportPaymentDetail.reportApplicationInfo.reportPriceType)}+옵션)`}
                    content={`${getReportPrice().toLocaleString()}원`}
                  />
                  {reportPaymentDetail.reportApplicationInfo
                    .reportFeedbackApplicationId && (
                    <PaymentInfoRow
                      title="1:1 피드백"
                      content={`${reportPaymentDetail.reportPaymentInfo.feedbackPriceInfo?.feedbackPrice?.toLocaleString() || 0}원`}
                    />
                  )}
                  <PaymentInfoRow
                    title={`할인 (${getDiscountPercent()}%)`}
                    content={
                      reportPaymentDetail.reportPaymentInfo.programDiscount ===
                      0
                        ? '0원'
                        : `-${reportPaymentDetail.reportPaymentInfo.programDiscount?.toLocaleString()}원`
                    }
                  />
                  <PaymentInfoRow
                    title={`쿠폰할인`}
                    content={
                      getCouponDiscountPrice() === 0
                        ? '0원'
                        : `-${getCouponDiscountPrice().toLocaleString()}원`
                    }
                  />
                  {reportPaymentDetail.tossInfo?.status ===
                    'PARTIAL_CANCELED' && (
                    <>
                      <PaymentInfoRow
                        title={`서류 진단서 (부분 환불 ${getPercent({
                          originalPrice: getReportPrice(),
                          changedPrice:
                            reportPaymentDetail.reportPaymentInfo
                              .reportRefundPrice ?? 0,
                        })}%)`}
                        content={
                          !reportPaymentDetail.reportPaymentInfo
                            .reportRefundPrice
                            ? '0원'
                            : `-${reportPaymentDetail.reportPaymentInfo.reportRefundPrice?.toLocaleString()}원`
                        }
                        subInfo={
                          <div className="text-xs font-medium text-primary-dark">
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
                        }
                      />
                      {reportPaymentDetail.reportApplicationInfo
                        .reportFeedbackApplicationId && (
                        <PaymentInfoRow
                          title={`1:1 피드백 (부분 환불 ${getPercent({
                            originalPrice:
                              reportPaymentDetail.reportPaymentInfo
                                .feedbackPriceInfo?.feedbackPrice || 0,
                            changedPrice:
                              reportPaymentDetail.reportPaymentInfo
                                .feedbackRefundPrice || 0,
                          })}%)`}
                          content={`-${reportPaymentDetail.reportPaymentInfo.feedbackRefundPrice?.toLocaleString() || 0}원`}
                          subInfo={
                            <div className="text-xs font-medium text-primary-dark">
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
                          }
                        />
                      )}
                    </>
                  )}
                </div>
                <hr className="w-full border-neutral-85" />
                <div className="flex w-full flex-col">
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
                              reportPaymentDetail.tossInfo?.receipt &&
                                window.open(
                                  reportPaymentDetail.tossInfo.receipt.url ||
                                    '',
                                  '_blank',
                                );
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
                    navigate(
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
                    navigate('/report/landing');
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
