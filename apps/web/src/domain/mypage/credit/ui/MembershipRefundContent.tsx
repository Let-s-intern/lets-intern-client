// 올인원패스 유저 환불 화면(결제 취소 페이지의 멤버십 분기). preview로 예정 환불액 노출 후 실행.
'use client';

import type { PaymentDetailType } from '@/api/payment/paymentSchema';
import {
  useMembershipExtensionRefundPreview,
  useMembershipRefundMutation,
  useMembershipRefundPreview,
} from '@/domain/all-in-one-pass/api/refund';
import OrderProgramInfo from '@/domain/program/OrderProgramInfo';
import PaymentInfoRow from '@/domain/program/paymentSuccess/PaymentInfoRow';
import dayjs from '@/lib/dayjs';
import { ApiError } from '@letscareer/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReportCreditSubRow from './ReportCreditSubRow';

const won = (n?: number | null) => `${(n ?? 0).toLocaleString()}원`;

// preview가 막히는 사유별 안내. REVIEW_REQUIRED는 어드민 수동 처리 대상이라 문의로 유도
const refundBlockedMessage = (error: unknown): string => {
  const code = error instanceof ApiError ? error.code : undefined;
  if (code === 'MEMBERSHIP_REFUND_NOT_AVAILABLE')
    return '이용 기간이 만료되어 환불이 불가합니다.';
  if (code === 'MEMBERSHIP_REFUND_REVIEW_REQUIRED')
    return '환불 확인이 필요한 결제입니다. 1:1문의 부탁드립니다.';
  return '지금은 환불이 불가합니다. 잠시 후 다시 시도해주세요.';
};

interface Props {
  paymentId: string;
  paymentDetail: PaymentDetailType;
}

export default function MembershipRefundContent({
  paymentId,
  paymentDetail,
}: Props) {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const applicationId = paymentDetail.programInfo.applicationId ?? 0;
  const extensionId = paymentDetail.programInfo.extensionId ?? null;
  const isExtension = extensionId != null;

  const baseQuery = useMembershipRefundPreview(applicationId, !isExtension);
  const extQuery = useMembershipExtensionRefundPreview(
    applicationId,
    extensionId ?? undefined,
    isExtension,
  );
  const query = isExtension ? extQuery : baseQuery;
  const mutation = useMembershipRefundMutation(paymentId);

  const paid = isExtension
    ? (extQuery.data?.paidAmount ?? 0)
    : (baseQuery.data?.paidAmount ?? 0);
  const refundAmount = isExtension
    ? (extQuery.data?.refundAmount ?? 0)
    : (baseQuery.data?.refund?.refundAmount ?? 0);
  const deduction = Math.max(0, paid - refundAmount);

  const paidAt =
    paymentDetail.tossInfo?.approvedAt ??
    paymentDetail.paymentInfo.createDate ??
    '';

  const handleRefund = () => {
    if (!isChecked) {
      alert('환불 정보를 확인해주세요.');
      return;
    }
    mutation.mutate(
      { applicationId, extensionId: extensionId ?? undefined },
      {
        onSuccess: () => router.push(`/mypage/credit/${paymentId}`),
        onError: () =>
          alert(
            '[환불 실패]\n문제가 계속되는 경우 아래 채팅으로 문의 부탁드립니다.',
          ),
      },
    );
  };

  return (
    <div
      className="flex w-full flex-col gap-y-10"
      data-program-text={paymentDetail.programInfo?.title}
    >
      <OrderProgramInfo
        {...paymentDetail.programInfo}
        accessMethod={paymentDetail.accessMethod}
      />

      <div className="flex w-full flex-col items-start justify-center gap-y-6">
        <div className="font-semibold text-neutral-0">환불 정보</div>

        {query.isLoading ? (
          <p className="w-full text-sm font-medium text-neutral-40">
            환불 정보를 불러오는 중입니다.
          </p>
        ) : query.isError ? (
          <>
            <p className="mb-10 w-full text-sm font-medium text-neutral-40">
              {refundBlockedMessage(query.error)}
            </p>
            <button
              className="h-[46px] w-full rounded-sm border-2 border-primary bg-neutral-100 px-5 py-2 font-medium text-primary-dark"
              onClick={() => router.back()}
            >
              이전
            </button>
          </>
        ) : (
          <>
            <div className="flex w-full flex-col items-start justify-start gap-y-3">
              <div className="flex w-full items-center justify-start gap-3 border-y-[1.5px] border-neutral-0 px-3 py-5 font-bold text-neutral-0">
                <div>예정 환불금액</div>
                <div className="flex grow items-center justify-end">
                  {won(refundAmount)}
                </div>
              </div>
              <div className="flex w-full flex-col px-3">
                <ReportCreditSubRow title="결제금액" content={won(paid)} />
                <ReportCreditSubRow
                  title="환불 차감 금액"
                  content={`-${won(deduction)}`}
                />
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
                  content={paidAt ? dayjs(paidAt).format('YYYY.MM.DD') : '-'}
                />
                {paymentDetail.tossInfo?.method && (
                  <PaymentInfoRow
                    title="결제수단"
                    content={paymentDetail.tossInfo.method}
                  />
                )}
              </div>
            </div>

            <div className="w-full rounded-sm bg-neutral-90 px-4 py-3 text-sm font-medium">
              <p className="text-neutral-0">
                환불 시 해당 올인원패스 및 혜택 이용이 종료됩니다.
              </p>
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
                disabled={mutation.isPending}
                onClick={handleRefund}
              >
                결제 취소하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
