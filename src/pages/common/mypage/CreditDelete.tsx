import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCancelApplicationMutation } from '../../../api/application';
import { usePaymentDetailQuery } from '../../../api/payment';
import DescriptionBox from '../../../components/common/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';

const convertDateFormat = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const calPercent = (price: number, discount: number) => {
  return Math.floor((discount / price) * 100);
};

const nearestTen = (amount: number): number => {
  return Math.floor(amount / 10) * 10;
};

const CreditDelete = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const { paymentId } = useParams<{ paymentId: string }>();

  const {
    data: paymentDetail,
    isLoading: paymentDetailIsLoading,
    isError: paymentDetailIsError,
  } = usePaymentDetailQuery(paymentId);

  const { mutate: tryCancelPayment } = useCancelApplicationMutation({
    applicationId: paymentDetail?.programInfo.applicationId || 0,
    successCallback: () => {
      navigate(`/mypage/credit/${paymentId}`);
    },
    errorCallback: (error) => {
      const err = error as AxiosError<{ status: number; message: string }>;
      alert(
        err.response ? err.response.data.message : '결제 취소에 실패했습니다.',
      );
      // console.error(error);
    },
  });

  const getRefundPercent = (): number => {
    const start = dayjs(paymentDetail?.programInfo.startDate);
    const end = dayjs(paymentDetail?.programInfo.endDate);
    const now = dayjs();
    if (now.isBefore(start)) {
      return 100;
    }

    const duration = end.diff(start, 'day') + 1;
    const d3 = start.add(Math.ceil(duration / 3), 'day');
    const d2 = start.add(Math.ceil(duration / 2), 'day');

    if (now.isBefore(d3)) return 66;
    if (now.isBefore(d2)) return 50;
    return 0;
  };

  const getTotalRefund = (): number => {
    if (
      paymentDetail?.paymentInfo.finalPrice === 0 ||
      !paymentDetail?.tossInfo?.balanceAmount ||
      paymentDetail.tossInfo.status !== 'DONE' ||
      !paymentDetail.priceInfo.price ||
      !paymentDetail.priceInfo.discount
    ) {
      return 0;
    }

    const couponPrice = paymentDetail.paymentInfo.couponDiscount || 0;
    const refundPrice = nearestTen(
      ((paymentDetail.priceInfo.price - paymentDetail.priceInfo.discount) *
        getRefundPercent()) /
        100 -
        couponPrice,
    );

    return Math.max(0, refundPrice);
  };

  const isPartialRefund = (): boolean => {
    if (getRefundPercent() === 66 || getRefundPercent() === 50) {
      return true;
    }
    return false;
  };
  return (
    <section
      className="flex w-full flex-col px-5 md:px-0"
      data-program-text={paymentDetail?.programInfo?.title}
    >
      <DescriptionBox type="DELETE" />
      <div className="flex w-full flex-col gap-y-10 py-8">
        {!paymentDetail ? (
          paymentDetailIsLoading ? (
            <p className="text-neutral-0">결제내역을 불러오는 중입니다.</p>
          ) : paymentDetailIsError ? (
            <p className="text-neutral-0">
              결제내역을 불러오는 중 오류가 발생했습니다.
            </p>
          ) : (
            <p className="text-neutral-0">결제내역이 없습니다.</p>
          )
        ) : (
          <>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              <div className="font-semibold text-neutral-0">프로그램 정보</div>
              <div className="flex w-full items-start justify-center gap-x-4">
                <img
                  className="h-[97px] w-[137px] rounded-sm object-cover"
                  src={paymentDetail.programInfo.thumbnail || ''}
                  alt="thumbnail"
                />
                <div className="flex grow flex-col items-start justify-center gap-y-3">
                  <div className="font-semibold">
                    {paymentDetail.programInfo.title}
                  </div>
                  <div className="flex w-full flex-col gap-y-1">
                    <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                      <div className="shrink-0 text-neutral-30">진행 일정</div>
                      <div className="text-primary-dark">{`${convertDateFormat(paymentDetail.programInfo.startDate || '')} - ${convertDateFormat(paymentDetail.programInfo.endDate || '')}`}</div>
                    </div>
                    {paymentDetail.programInfo.progressType && (
                      <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                        <div className="shrink-0 text-neutral-30">
                          진행 방식
                        </div>
                        <div className="text-primary-dark">{`${
                          paymentDetail.programInfo.progressType === 'ALL'
                            ? '온라인/오프라인'
                            : paymentDetail.programInfo.progressType ===
                                'ONLINE'
                              ? '온라인'
                              : '오프라인'
                        }`}</div>
                      </div>
                    )}
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
                    title="참여비용"
                    content={`${paymentDetail.priceInfo.price?.toLocaleString()}원`}
                  />
                  <PaymentInfoRow
                    title={`할인 (${paymentDetail.priceInfo.price && paymentDetail.priceInfo.discount ? calPercent(paymentDetail.priceInfo.price, paymentDetail.priceInfo.discount) : 0}%)`}
                    content={`-${paymentDetail.priceInfo.discount?.toLocaleString()}원`}
                  />
                  <PaymentInfoRow
                    title={`쿠폰할인`}
                    content={`-${(paymentDetail.paymentInfo?.couponDiscount === -1 ? (paymentDetail.priceInfo.price ? paymentDetail.priceInfo.price : 0) - (paymentDetail.priceInfo.discount ? paymentDetail.priceInfo.discount : 0) : paymentDetail.paymentInfo?.couponDiscount ? paymentDetail.paymentInfo.couponDiscount : 0)?.toLocaleString()}원`}
                  />
                  {isPartialRefund() && (
                    <PaymentInfoRow
                      title={`부분 환불 (${paymentDetail.programInfo.programType === 'CHALLENGE' ? '챌린지' : '라이브'})`}
                      content={`-${paymentDetail.tossInfo?.balanceAmount ? (paymentDetail.tossInfo.balanceAmount - getTotalRefund()).toLocaleString() : 0}원`}
                      subInfo={
                        <div className="text-xs font-medium text-primary-dark">
                          *환불 규정은{' '}
                          <a
                            className="underline underline-offset-2"
                            href="https://letscareer.oopy.io"
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
                      paymentDetail.tossInfo
                        ? paymentDetail.tossInfo?.status === 'CANCELED' &&
                          paymentDetail.tossInfo.cancels
                          ? convertDateFormat(
                              paymentDetail.tossInfo?.cancels[0].canceledAt ||
                                '',
                            )
                          : convertDateFormat(
                              paymentDetail.tossInfo?.requestedAt || '',
                            )
                        : convertDateFormat(
                            paymentDetail.paymentInfo.lastModifiedDate || '',
                          )
                    }
                  />
                  {paymentDetail.tossInfo && (
                    <>
                      <PaymentInfoRow
                        title="결제수단"
                        content={paymentDetail.tossInfo?.method || ''}
                      />
                      <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                        <div className="text-neutral-40">영수증</div>
                        <div className="flex grow items-center justify-end text-neutral-0">
                          <button
                            className="flex items-center justify-center rounded-sm border border-neutral-60 bg-white px-2.5 py-1.5 text-sm font-medium"
                            onClick={() => {
                              paymentDetail.tossInfo?.receipt &&
                                window.open(
                                  paymentDetail.tossInfo.receipt.url || '',
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
                      tryCancelPayment({
                        programType:
                          paymentDetail?.programInfo.programType || 'CHALLENGE',
                      });
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

export default CreditDelete;
