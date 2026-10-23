'use client';

import { useCancelApplicationMutation } from '@/api/application';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import OrderProgramInfo from '@/domain/program/OrderProgramInfo';
import DescriptionBox from '@/domain/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '@/domain/program/paymentSuccess/PaymentInfoRow';
import dayjs from '@/lib/dayjs';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import useCredit from './hooks/useCredit';
import ReportCreditSubRow from './ui/ReportCreditSubRow';
import {
  getVodPassRefundBlockedReason,
  getVodPassRefundErrorMessage,
} from './utils/vodPassRefund';
import { getVodPassInfoRows } from './utils/vodPassStatus';

const convertDateFormat = (date: string) => dayjs(date).format('YYYY.MM.DD');

const CreditDeletePage = () => {
  return (
    <section className="flex w-full flex-col px-5 md:px-0">
      <DescriptionBox type="DELETE" />
      <div className="flex w-full flex-col gap-y-10 py-8">
        <AsyncBoundary
          pendingFallback={
            <p className="text-neutral-0">결제내역을 불러오는 중입니다.</p>
          }
        >
          <CreditDeleteContent />
        </AsyncBoundary>
      </div>
    </section>
  );
};

export default CreditDeletePage;

const CreditDeleteContent = () => {
  const router = useRouter();
  const params = useParams<{ paymentId: string }>();
  const paymentId = params.paymentId;

  const [isChecked, setIsChecked] = useState(false);

  const {
    data: paymentDetail,
    expectedPartialRefundDeductionAmount,
    expectedTotalRefund,
    totalPayment,
    isCancelable,
    isVodPass,
    vodPass,
    isVodPassError,
    isVodPassLoading,
    refundableBundledVodPassPaymentId,
    hasUnrefundableBundledVodPass,
    hasLaterVodPass,
  } = useCredit(paymentId);

  const { mutate: tryCancelPayment } = useCancelApplicationMutation({
    applicationId: paymentDetail.programInfo.applicationId || 0,
    paymentId,
    successCallback: () => {
      router.push(`/mypage/credit/${paymentId}`);
    },
    errorCallback: (error) => {
      const err = error as AxiosError<{ status: number; message: string }>;
      // 이용권은 환불 확인 중 같은 409 사유를 BE 문구로 알려준다. 다른 상품의 안내는 그대로다
      const vodPassMessage = isVodPass
        ? getVodPassRefundErrorMessage(error)
        : null;
      alert(
        vodPassMessage
          ? `[결제 취소 실패]\n${vodPassMessage}`
          : '[결제 취소 실패]\n문제가 계속되는 경우 아래 채팅으로 문의 부탁드립니다.',
      );
      console.error(err);
    },
  });

  /*
    이용권은 환불 가능 여부가 이용권 목록에서 온다. 환불할 수 없거나 아직 확인하지 못했으면
    환불 버튼 대신 이유를 알려준다. 다른 상품은 이 화면에서 따로 막지 않는다.
  */
  const vodPassNotice = !isVodPass
    ? null
    : vodPass
      ? getVodPassRefundBlockedReason(vodPass)
      : isVodPassError
        ? '이용권 정보를 불러오지 못해 환불할 수 없습니다. 잠시 후 다시 시도해 주세요'
        : isVodPassLoading
          ? '이용권 정보를 확인하는 중입니다'
          : '현재 환불할 수 없는 이용권입니다';
  const isRefundBlocked = isVodPass && !isCancelable;

  return (
    <div
      className="flex w-full flex-col gap-y-10"
      data-program-text={paymentDetail.programInfo?.title}
    >
      <OrderProgramInfo
        {...paymentDetail.programInfo}
        accessMethod={paymentDetail.accessMethod}
        vodPassRows={vodPass ? getVodPassInfoRows(vodPass) : undefined}
      />
      <div className="flex w-full flex-col items-start justify-center gap-y-6">
        <div className="text-neutral-0 font-semibold">환불 정보</div>
        <div className="flex w-full flex-col items-start justify-start gap-y-3">
          <div className="border-neutral-0 text-neutral-0 flex w-full items-center justify-start gap-3 border-y-[1.5px] px-3 py-5 font-bold">
            <div>예정 환불금액</div>
            <div className="flex grow items-center justify-end">
              {expectedTotalRefund.toLocaleString()}원
            </div>
          </div>
          <div className="flex w-full flex-col px-3">
            <ReportCreditSubRow
              title="결제금액"
              content={totalPayment.toLocaleString() + '원'}
            />
            <ReportCreditSubRow
              title="환불 차감 금액"
              content={`-${(expectedPartialRefundDeductionAmount ?? 0).toLocaleString()}원`}
            />
            <div className="text-primary-dark py-2 text-xs font-medium">
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

          <hr className="border-neutral-85 w-full" />

          <div className="flex w-full flex-col">
            <PaymentInfoRow
              title="결제일자"
              content={
                paymentDetail.tossInfo
                  ? paymentDetail.tossInfo?.status === 'CANCELED' &&
                    paymentDetail.tossInfo.cancels
                    ? convertDateFormat(
                        paymentDetail.tossInfo?.cancels[0].canceledAt || '',
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
                  <div className="text-neutral-0 flex grow items-center justify-end">
                    <button
                      className="border-neutral-60 flex items-center justify-center rounded-sm border bg-white px-2.5 py-1.5 text-sm font-medium"
                      onClick={() => {
                        if (paymentDetail.tossInfo?.receipt) {
                          window.open(
                            paymentDetail.tossInfo.receipt.url || '',
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
        {/* 챌린지를 취소해도 함께 결제한 이용권은 자동으로 환불되지 않는다. 환불 금액에도 포함되지 않는다 */}
        {hasUnrefundableBundledVodPass && (
          <div className="bg-neutral-90 flex w-full flex-col gap-y-1 rounded-sm px-4 py-3 text-sm font-medium">
            <p className="text-neutral-0">
              함께 결제한 VOD 이용권은 이용이 시작되어 환불되지 않으며, 챌린지
              환불 금액에도 포함되지 않습니다
            </p>
          </div>
        )}
        {refundableBundledVodPassPaymentId !== null && (
          <div className="bg-neutral-90 flex w-full flex-col gap-y-1 rounded-sm px-4 py-3 text-sm font-medium">
            <p className="text-neutral-0">
              함께 결제한 VOD 이용권은 별도로 환불해야 합니다
            </p>
            <Link
              className="text-primary-dark underline underline-offset-2"
              href={`/mypage/credit/${refundableBundledVodPassPaymentId}/delete`}
            >
              VOD 이용권 환불하러 가기
            </Link>
          </div>
        )}
        {isVodPass && isCancelable && hasLaterVodPass && (
          <div className="bg-neutral-90 w-full rounded-sm px-4 py-3 text-sm font-medium">
            <p className="text-neutral-0">
              이 이용권을 환불해도 뒤에 예약된 이용권의 시작일은 앞당겨지지
              않습니다
            </p>
          </div>
        )}
        {isRefundBlocked ? (
          <>
            {vodPassNotice && (
              <p className="text-neutral-40 w-full text-sm font-medium">
                {vodPassNotice}
              </p>
            )}
            <button
              className="border-primary text-primary-dark h-[46px] w-full rounded-sm border-2 bg-neutral-100 px-5 py-2 font-medium"
              onClick={() => router.back()}
            >
              이전
            </button>
          </>
        ) : (
          <>
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
                className="border-primary text-primary-dark h-[46px] grow rounded-sm border-2 bg-neutral-100 px-5 py-2 font-medium"
                onClick={() => router.back()}
              >
                이전
              </button>
              <button
                className={`h-[46px] grow rounded-sm ${isChecked ? 'bg-primary' : 'bg-primary-20 cursor-not-allowed'} px-5 py-2 font-medium text-neutral-100`}
                onClick={() => {
                  if (isChecked) {
                    tryCancelPayment({
                      programType:
                        paymentDetail.programInfo.programType || 'CHALLENGE',
                    });
                  } else {
                    alert('환불 정보를 확인해주세요.');
                  }
                }}
              >
                결제 취소하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
