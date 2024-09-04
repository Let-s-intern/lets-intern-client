import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { convertReportPriceType, useDeleteReportApplication, useGetReportPaymentDetailQuery } from "../../../api/report";
import DescriptionBox from "../../../components/common/program/paymentSuccess/DescriptionBox";
import PaymentInfoRow from "../../../components/common/program/paymentSuccess/PaymentInfoRow";

const convertDateFormat = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const getPercent = ({
  originalPrice, changedPrice
}:{
  originalPrice: number,
  changedPrice: number
}) => {
  return Math.floor((changedPrice / originalPrice) * 100);
}

const nearestTen = (amount: number): number => {
  return Math.floor(amount / 10) * 10;
};

const ReportCreditDelete = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const {paymentId} = useParams<{paymentId: string}>();
  
  const {data: reportPaymentDetail, isLoading: reportPaymentDetailIsLoading, isError: reportPaymentDetailIsError} = useGetReportPaymentDetailQuery({
    applicationId: Number(applicationId),
    enabled: applicationId !== null,
  });

  const { mutate: tryCancelReportApplication } = useDeleteReportApplication({
    successCallback: () => {
      navigate(`/mypage/credit/report/${paymentId}?applicationId=${applicationId}`);
    },
    errorCallback: (error) => {
      const err = error as AxiosError<{ status: number; message: string }>;
      alert(
        err.response ? err.response.data.message : '결제 취소에 실패했습니다.',
      );
    },
  });

  const getOptionTitleList = () => {
    if (!reportPaymentDetail) return [];

    if (!reportPaymentDetail.reportPaymentInfo.reportOptionInfos || reportPaymentDetail.reportPaymentInfo.reportOptionInfos.length === 0) return '없음';

    return reportPaymentDetail.reportPaymentInfo.reportOptionInfos.map(option => option.title).join(', ');
  }

  const getReportPrice = () => {
    if (!reportPaymentDetail) return 0;

    const defaultReportPrice = reportPaymentDetail.reportPaymentInfo.reportPriceInfo.price;
    const optionsPrice = reportPaymentDetail.reportPaymentInfo.reportOptionInfos.reduce((acc, option) => {
      return acc + option.price;
    }, 0);

    return defaultReportPrice + optionsPrice;
  }

  const getReportDiscountedPrice = () => {
    if (!reportPaymentDetail) return 0;

    const originalPrice = getReportPrice();
    const discountPrice = reportPaymentDetail.reportPaymentInfo.reportPriceInfo.discountPrice;
    const optionsDiscountPrice = reportPaymentDetail.reportPaymentInfo.reportOptionInfos.reduce((acc, option) => {
      return acc + option.discountPrice;
    }, 0);

    return originalPrice - (discountPrice + optionsDiscountPrice);
  }

  const getFeedbackDiscountedPrice = () => {
    if (!reportPaymentDetail || !reportPaymentDetail.reportApplicationInfo.reportFeedbackApplicationId || !reportPaymentDetail.reportPaymentInfo.feedbackPriceInfo) return 0;

    return reportPaymentDetail.reportPaymentInfo.feedbackPriceInfo.feedbackPrice - reportPaymentDetail.reportPaymentInfo.feedbackPriceInfo.feedbackDiscountPrice;
  }

  const getDiscountPercent = () => {
    if (!reportPaymentDetail) return 0;

    const originalPrice = reportPaymentDetail.reportPaymentInfo.reportPriceInfo.price;
    const discountPrice = reportPaymentDetail.reportPaymentInfo.programDiscount;

    return getPercent({originalPrice, changedPrice: discountPrice});
  }

  const getCouponDiscountPrice = () => {
    if (!reportPaymentDetail || !reportPaymentDetail.reportPaymentInfo.couponDiscount) return 0;

    return reportPaymentDetail.reportPaymentInfo.couponDiscount === -1
      ? reportPaymentDetail.reportPaymentInfo.programPrice - reportPaymentDetail.reportPaymentInfo.programDiscount
      : reportPaymentDetail.reportPaymentInfo.couponDiscount;
  }

  const reportRefundPercent = () => {
    if (!reportPaymentDetail) return 0;
    
    const now = dayjs();

    // 결제 후 3시간 이내 : 100% 환불
    if (now.diff(dayjs(reportPaymentDetail.reportPaymentInfo.lastModifiedDate), 'hour') < 3) {
      return 1;
    }
    // 결제 후 3시간 후 ~ 진단서 수령(발급완료) 전 : 80% 환불
    if (now.diff(dayjs(reportPaymentDetail.reportPaymentInfo.lastModifiedDate), 'hour') >= 3 && reportPaymentDetail.reportApplicationInfo.reportApplicationStatus !== 'COMPLETED' && reportPaymentDetail.reportApplicationInfo.reportApplicationStatus !== 'REPORTED') {
      return 0.8;
    }
    // 진단서 수령(발급완료) 후 : 환불 불가
    if (reportPaymentDetail.reportApplicationInfo.reportApplicationStatus === 'COMPLETED' || reportPaymentDetail.reportApplicationInfo.reportApplicationStatus === 'REPORTED') {
      return 0;
    }
    return 0;
  }

  const feedbackRefundPercent = () => {
    if (!reportPaymentDetail || !reportPaymentDetail.reportApplicationInfo.reportFeedbackApplicationId) return 0;

    const now = dayjs();

    // 일정 확정 전 : 100% 환불
    if (reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus !== 'CONFIRMED' && reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus !== 'COMPLETED') {
      return 1;
    }
    // 일정 확정 후 ~ 확정된 일정 24시간 전 : 80% 환불
    if (reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus !== 'COMPLETED' && (
      reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus === 'CONFIRMED' && now.diff(dayjs(reportPaymentDetail.reportApplicationInfo.reportFeedbackDesiredDate), 'hour') > 24
    )) {
      return 0.8;
    }
    // 확정된 일정 전 24시간 이내 : 50% 환불
    if (reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus !== 'COMPLETED' && (
      reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus === 'CONFIRMED' && now.diff(dayjs(reportPaymentDetail.reportApplicationInfo.reportFeedbackDesiredDate), 'hour') <= 24 && now.diff(dayjs(reportPaymentDetail.reportApplicationInfo.reportFeedbackDesiredDate), 'hour') > 0
    )) {
      return 0.5;
    }
    // 확정된 일정 시간 이후 : 환불 불가
    if (reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus === 'COMPLETED' || (
      reportPaymentDetail.reportApplicationInfo.reportFeedbackStatus === 'CONFIRMED' && now.diff(dayjs(reportPaymentDetail.reportApplicationInfo.reportFeedbackDesiredDate), 'hour') <= 0
    )) {
      return 0;
    }

    return 0;
  }

  const getTotalRefund = ():number => {
    if (
      !reportPaymentDetail || reportPaymentDetail.reportPaymentInfo.finalPrice === 0 || !reportPaymentDetail.tossInfo?.balanceAmount || reportPaymentDetail.tossInfo.status !== 'DONE'
    ) {
      return 0;
    }

    const couponPrice = reportPaymentDetail.reportPaymentInfo.couponDiscount || 0;
    const refundPrice = nearestTen(
      (getReportDiscountedPrice() * reportRefundPercent()) + 
      (getFeedbackDiscountedPrice() * feedbackRefundPercent()) - 
      couponPrice
    )

    return Math.max(0, refundPrice)
  }

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
                  src="/images/report-banner.png"
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
                      <div className="text-primary-dark">{getOptionTitleList()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              <div className="font-semibold text-neutral-0">환불 정보</div>
              <div className="flex w-full flex-col items-start justify-start gap-y-3">
                <div className="flex w-full items-center justify-start gap-3 border-y-[1.5px] border-neutral-0 px-3 py-5 font-bold text-neutral-0">
                  <div>예정 환불금액</div>
                  <div className="flex grow items-center justify-end">
                    {getTotalRefund().toLocaleString()}원
                  </div>
                </div>
                <div className="flex w-full flex-col">
                <PaymentInfoRow
                    title={`서류 진단서 (${convertReportPriceType(reportPaymentDetail.reportApplicationInfo.reportPriceType)}+옵션)`}
                    content={`${getReportPrice().toLocaleString()}원`}
                  />
                  {
                    reportPaymentDetail.reportApplicationInfo.reportFeedbackApplicationId && (
                      <PaymentInfoRow
                        title='1:1 피드백'
                        content={`${reportPaymentDetail.reportPaymentInfo.feedbackPriceInfo?.feedbackPrice.toLocaleString() || 0}원`}
                      />
                    )
                  }
                  <PaymentInfoRow
                    title={`할인 (${getDiscountPercent()}%)`}
                    content={`-${reportPaymentDetail.reportPaymentInfo.programDiscount.toLocaleString()}원`}
                  />
                  <PaymentInfoRow
                    title={`쿠폰할인`}
                    content={`-${getCouponDiscountPrice().toLocaleString()}원`}
                  />
                  {reportRefundPercent() !== 1 && (
                    <PaymentInfoRow
                      title={`서류 진단서 (부분 환불 ${(1 - reportRefundPercent()) * 100}%)`}
                      content={`-${
                        (getReportDiscountedPrice() * (1 - reportRefundPercent())).toLocaleString()
                      }원`}
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
                  {feedbackRefundPercent() !== 1 && (
                    <PaymentInfoRow
                      title={`1:1 피드백 (부분 환불 ${(1 - feedbackRefundPercent()) * 100}%)`}
                      content={`-${
                        (getFeedbackDiscountedPrice() * (1 - feedbackRefundPercent())).toLocaleString()
                      }원`}
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
                            reportPaymentDetail.tossInfo?.cancels[0].canceledAt ||
                                '',
                            )
                          : convertDateFormat(
                            reportPaymentDetail.tossInfo?.requestedAt || '',
                            )
                        : convertDateFormat(
                          reportPaymentDetail.reportPaymentInfo.lastModifiedDate || '',
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
                                  reportPaymentDetail.tossInfo.receipt.url || '',
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
                  onClick={() => navigate(-1)}
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

export default ReportCreditDelete;
