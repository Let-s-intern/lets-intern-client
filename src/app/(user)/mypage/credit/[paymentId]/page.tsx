'use client';

import { useUserQuery } from '@/api/user';
import Input from '@/common/ui/input/Input';
import ReportCreditSubRow from '@/domain/mypage/credit/ReportCreditSubRow';
import MoreButton from '@/domain/mypage/ui/button/MoreButton';
import OrderProgramInfo from '@/domain/program/OrderProgramInfo';
import PaymentInfoRow from '@/domain/program/paymentSuccess/PaymentInfoRow';
import useCredit from '@/hooks/useCredit';
import dayjs from '@/lib/dayjs';
import { useParams, useRouter } from 'next/navigation';

const convertDateFormat = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const CreditDetail = () => {
  const router = useRouter();
  const params = useParams<{ paymentId: string }>();
  const paymentId = params.paymentId;

  const {
    data: paymentDetail,
    isLoading: paymentDetailIsLoading,
    isError: paymentDetailIsError,
    isRefunded,
    isCanceled,
    isCancelable,
    totalRefund,
    isPayback,
    productAmount,
    partialRefundDeductionAmount,
    couponDiscountAmount,
    totalPayment,
    discountAmount,
  } = useCredit(paymentId);

  const {
    data: userData,
    isLoading: userDataIsLoading,
    isError: userDataIsError,
  } = useUserQuery();

  return (
    <section
      className="flex w-full flex-col px-5 md:px-0"
      data-program-text={paymentDetail?.programInfo?.title}
    >
      <div className="flex items-center justify-start gap-x-2">
        {/* 이전 버튼 */}
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

      <section className="flex w-full flex-col gap-y-10 py-8">
        {!paymentDetail ? (
          // 로딩 중
          paymentDetailIsLoading ? (
            <p className="text-neutral-0">결제내역을 불러오는 중입니다.</p>
          ) : // 에러 발생
          paymentDetailIsError ? (
            <p className="text-neutral-0">
              결제내역을 불러오는 중 오류가 발생했습니다.
            </p>
          ) : (
            // 결제 내역 없음
            <p className="text-neutral-0">결제내역이 없습니다.</p>
          )
        ) : (
          <>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              {/* 환불 내역 */}
              {isRefunded && (
                <section className="flex w-full gap-2 rounded-xxs bg-neutral-90 px-4 py-3">
                  <div className="text-sm font-semibold text-primary-dark">
                    페이백 완료
                  </div>
                  <div className="flex grow items-center justify-end">
                    {convertDateFormat(
                      paymentDetail.tossInfo?.cancels
                        ? paymentDetail.tossInfo.cancels[0].canceledAt
                          ? paymentDetail.tossInfo.cancels[0].canceledAt
                          : ''
                        : paymentDetail.paymentInfo?.lastModifiedDate
                          ? paymentDetail.paymentInfo.lastModifiedDate
                          : '',
                    )}
                  </div>
                </section>
              )}

              {/* 결제 취소 */}
              {!isRefunded && isCanceled && (
                <section className="flex w-full gap-2 rounded-xxs bg-neutral-90 px-4 py-3">
                  <div className="text-sm font-semibold text-system-error">
                    결제 취소
                  </div>
                  <div className="flex grow items-center justify-end">
                    {convertDateFormat(
                      paymentDetail.tossInfo?.cancels
                        ? paymentDetail.tossInfo.cancels[0].canceledAt
                          ? paymentDetail.tossInfo.cancels[0].canceledAt
                          : ''
                        : paymentDetail.paymentInfo?.lastModifiedDate
                          ? paymentDetail.paymentInfo.lastModifiedDate
                          : '',
                    )}
                  </div>
                </section>
              )}
              {/* 주문 정보 */}
              <OrderProgramInfo {...paymentDetail.programInfo} />
            </div>

            {/* 참여자 정보 */}
            <section className="flex w-full flex-col items-start justify-center gap-y-6">
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
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              )}
            </section>

            {/* 환불/결제 정보 */}
            <section className="flex w-full flex-col items-start justify-center gap-y-6">
              <div className="font-semibold text-neutral-0">
                {isCanceled ? '환불 정보' : '결제 정보'}
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-y-3">
                <div className="flex w-full items-center justify-start gap-3 border-y-[1.5px] border-neutral-0 px-3 py-5 font-bold text-neutral-0">
                  <div>{isCanceled ? '총 환불금액' : '총 결제금액'}</div>
                  <div className="flex grow items-center justify-end">
                    {paymentDetail.tossInfo &&
                    typeof paymentDetail.tossInfo.totalAmount === 'number' &&
                    typeof paymentDetail.tossInfo.balanceAmount === 'number'
                      ? (isCanceled
                          ? totalRefund
                          : paymentDetail.tossInfo.totalAmount
                        ).toLocaleString()
                      : paymentDetail.paymentInfo.finalPrice?.toLocaleString()}
                    원
                  </div>
                </div>

                <div className="flex w-full flex-col px-3">
                  {/* [결제 내역] 정가 표시 */}
                  {!isCanceled && (
                    <ReportCreditSubRow
                      title="정가"
                      content={productAmount.toLocaleString() + '원'}
                    />
                  )}

                  {/* [환불 내역] 결제 금액 표시 */}
                  {isCanceled && (
                    <ReportCreditSubRow
                      title="결제금액"
                      content={totalPayment.toLocaleString() + '원'}
                    />
                  )}
                  {/* 환불 내역에서는 숨김 */}
                  {!isCanceled && (
                    <ReportCreditSubRow
                      title="할인금액"
                      content={`-${discountAmount.toLocaleString()}원`}
                    />
                  )}
                  {/* 환불 내역에서는 숨김 */}
                  {!isCanceled && (
                    <ReportCreditSubRow
                      title="쿠폰 할인 금액"
                      content={`-${(couponDiscountAmount ?? 0).toLocaleString()}원`}
                    />
                  )}
                  {/* [환불된 내역] 환불 차감 금액 표시 */}
                  {isCanceled && (
                    <ReportCreditSubRow
                      title={isPayback ? '페이백 금액' : '환불 차감 금액'}
                      content={`-${partialRefundDeductionAmount.toLocaleString()}원`}
                    />
                  )}

                  {/* [환불된 내역] 환불 규정 표시 */}
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

                <div className="flex w-full flex-col">
                  <PaymentInfoRow
                    title={
                      paymentDetail.tossInfo?.status === 'CANCELED' ||
                      paymentDetail.tossInfo?.status === 'PARTIAL_CANCELED'
                        ? '환불일자'
                        : '결제일자'
                    }
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
                            paymentDetail.paymentInfo.createDate || '',
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
                              if (paymentDetail.tossInfo?.receipt) {
                                window.open(
                                  paymentDetail.tossInfo.receipt.url ?? '',
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
              {isCancelable ? (
                <button
                  className="flex w-full items-center justify-center rounded-sm bg-neutral-80 px-5 py-2.5 font-medium text-neutral-40"
                  onClick={() => {
                    router.push(`/mypage/credit/${paymentId}/delete`);
                  }}
                >
                  결제 취소하기
                </button>
              ) : (
                <MoreButton
                  className="other_program w-full md:flex"
                  onClick={() => {
                    router.push('/program');
                  }}
                >
                  다른 프로그램 둘러보기
                </MoreButton>
              )}
            </section>
          </>
        )}
      </section>
    </section>
  );
};

export default CreditDetail;
