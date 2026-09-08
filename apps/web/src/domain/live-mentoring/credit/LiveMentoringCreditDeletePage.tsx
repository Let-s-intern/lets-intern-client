'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCancelLiveMentoringApplicationMutation } from '@/api/live-mentoring/liveMentoring';
import { formatPrice } from '../constants';
import { formatReservationPeriod } from '../mypage/MentoringApplicationCard';
import { readServerError } from '../utils/serverError';
import { useLiveMentoringRefund } from './hooks/useLiveMentoringRefund';

/**
 * 수수료 정책 툴팁 (시안 `4-0`).
 *
 * PRD 7-2 확정 정책(`prd-1대1-라이브멘토링-환불정책.md`) — 예약 시작 24시간 전까지,
 * 또는 결제 후 1시간 이내면 수수료가 없다. 그 뒤 예약 시작 전까지는 50%, 시작 시각
 * 이후는 환불이 없다. 문구에 퍼센트는 적어도 되지만 계산 자체는 서버 값을 따른다 —
 * 실제 적용된 수수료는 아래 행에 서버 값으로 뜬다.
 */
const FEE_POLICY_NOTICE =
  '예약 시작 24시간 전 이후 취소 시, 멘토의 사전 준비 시간이 반영되어 결제 금액의 50%가 취소 수수료로 부과됩니다. 결제 후 1시간 이내에는 이 기준과 무관하게 전액 환불됩니다.';

const Row = ({
  label,
  value,
  strong = false,
  accent = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
}) => (
  <div className="flex w-full items-center justify-between gap-4 text-sm">
    <span
      className={strong ? 'text-neutral-0 font-semibold' : 'text-neutral-30'}
    >
      {label}
    </span>
    <span
      className={
        accent
          ? 'text-system-error font-semibold'
          : strong
            ? 'text-neutral-0 font-semibold'
            : 'text-neutral-0'
      }
    >
      {value}
    </span>
  </div>
);

interface LiveMentoringCreditDeletePageProps {
  applicationId: number;
}

/**
 * 1대1 라이브 멘토링 결제 취소·환불 (시안 `4-0` · `4-1`).
 *
 * **금액은 한 줄도 계산하지 않는다.** 예정 환불금액·취소 수수료·수수료율 모두 서버
 * `refund-preview` 가 준 값을 그대로 그린다. 같은 계산이 화면에도 있으면 반드시
 * 어긋나고, 어긋난 금액으로 취소를 누르면 사용자가 본 것과 다른 돈이 돌아간다.
 */
const LiveMentoringCreditDeletePage = ({
  applicationId,
}: LiveMentoringCreditDeletePageProps) => {
  const router = useRouter();
  const { application, refundPreview, isLoading, error } =
    useLiveMentoringRefund(applicationId);
  const cancelApplication =
    useCancelLiveMentoringApplicationMutation(applicationId);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // 서버가 취소 불가로 판단한 건은 버튼을 열지 않는다.
  const canCancel =
    isConfirmed &&
    (refundPreview?.cancelable ?? false) &&
    !cancelApplication.isPending;

  const handleCancel = () => {
    if (!canCancel) return;
    setCancelError(null);
    cancelApplication.mutate(undefined, {
      onSuccess: () => router.push('/mypage/credit'),
      onError: (cause) => setCancelError(readServerError(cause).message),
    });
  };

  return (
    <section className="flex w-full flex-col px-5 md:px-0">
      <div className="flex items-center justify-start gap-x-2">
        <img
          src="/icons/Arrow_Left_MD.svg"
          alt="이전"
          className="h-6 w-6 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-neutral-0 text-lg font-medium">결제 취소</h1>
      </div>

      {isLoading ? (
        <p className="text-neutral-0 py-8">환불 정보를 불러오는 중입니다.</p>
      ) : error || !refundPreview ? (
        <p className="text-neutral-0 py-8">
          {error?.message ?? '환불 정보를 불러오지 못했습니다.'}
        </p>
      ) : (
        <section className="flex w-full flex-col gap-y-10 py-8">
          <div className="flex w-full flex-col items-start gap-y-6">
            <div className="text-neutral-0 font-semibold">환불 정보</div>

            <div className="bg-neutral-95 flex w-full items-center justify-between gap-4 rounded-sm px-4 py-3">
              <span className="text-neutral-0 text-sm font-semibold">
                예정 환불금액
              </span>
              <span className="text-primary text-base font-bold">
                {formatPrice(refundPreview.refundAmount)}
              </span>
            </div>

            <div className="flex w-full flex-col gap-y-3">
              <Row
                label="결제 상품"
                value={formatPrice(refundPreview.originalPrice)}
              />
              {refundPreview.productDiscount > 0 && (
                <Row
                  label="할인"
                  value={`-${formatPrice(refundPreview.productDiscount)}`}
                />
              )}
              {refundPreview.couponDiscount > 0 && (
                <Row
                  label="쿠폰 할인"
                  value={`-${formatPrice(refundPreview.couponDiscount)}`}
                />
              )}
              {/*
                수수료율과 금액 모두 서버 값이다. 0% 면 뗄 것이 없으므로 행을 감춘다 —
                "취소 수수료 0원" 은 읽는 사람에게 아무것도 알려주지 않는다.
              */}
              {refundPreview.cancelFeePercent > 0 && (
                <Row
                  label={`취소 수수료 (${refundPreview.cancelFeePercent}%)`}
                  value={`-${formatPrice(refundPreview.cancelFee)}`}
                  accent
                />
              )}
              <div className="border-neutral-85 w-full border-t pt-3">
                <Row
                  label="총 결제금액"
                  value={formatPrice(refundPreview.paidAmount)}
                  strong
                />
              </div>
            </div>

            <p className="text-neutral-45 text-xs leading-relaxed">
              {FEE_POLICY_NOTICE}
            </p>

            {application && (
              <p className="text-neutral-45 text-xs">
                예약 일시{' '}
                {formatReservationPeriod(
                  application.reservationStartAt,
                  application.reservationEndAt,
                )}
              </p>
            )}
          </div>

          {/* 시안 4-1 — 확인 체크 전에는 실행할 수 없다 */}
          <label className="text-neutral-30 flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(event) => setIsConfirmed(event.target.checked)}
              className="accent-primary mt-0.5 h-4 w-4"
            />
            위 환불 금액과 취소 수수료를 확인했으며, 결제 취소에 동의합니다.
          </label>

          {cancelError && (
            <p className="text-system-error text-sm">{cancelError}</p>
          )}

          <button
            type="button"
            onClick={handleCancel}
            disabled={!canCancel}
            className="bg-primary disabled:bg-neutral-80 disabled:text-neutral-40 w-full rounded-sm py-3 text-sm font-medium text-white"
          >
            {cancelApplication.isPending ? '취소하는 중…' : '결제 취소하기'}
          </button>
        </section>
      )}
    </section>
  );
};

export default LiveMentoringCreditDeletePage;
