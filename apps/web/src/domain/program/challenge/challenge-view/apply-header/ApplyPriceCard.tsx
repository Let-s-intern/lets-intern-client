'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

export type ApplyButtonState = 'OPEN' | 'APPLIED' | 'CLOSED';

/** 가격 카드에 보이는 금액. 챌린지 플랜이든 가이드북이든 이 모양으로 넘긴다 */
export interface PriceSummary {
  regularPrice: number;
  discountAmount: number;
  discountPercentage: number;
  /** 패스 혜택 할인. 0 이면 줄을 숨긴다 */
  membershipDiscount: number;
  /** 미션 환급액. 0 이면 줄을 숨긴다 */
  deposit: number;
  /** 실제 결제 금액 */
  paymentPrice: number;
}

const APPLY_BUTTON_TEXT: Record<Exclude<ApplyButtonState, 'OPEN'>, string> = {
  APPLIED: '이미 신청이 완료되었습니다',
  CLOSED: '모집이 마감되었습니다',
};

export const ApplyButton = ({
  state,
  label,
  onClick,
}: {
  state: ApplyButtonState;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    disabled={state !== 'OPEN'}
    onClick={onClick}
    className="apply_button w-full rounded-md bg-primary px-6 py-3 text-small18 font-medium text-white disabled:bg-neutral-80 disabled:text-neutral-40"
  >
    {state === 'OPEN' ? label : APPLY_BUTTON_TEXT[state]}
  </button>
);

interface Props {
  price: PriceSummary;
  applyButton: ReactNode;
  /** 열린 올인원 패스로 가는 링크. 없으면 패스 카드를 숨긴다 */
  passHref: string | null;
  /** 패스 회원이 신청할 때 내는 금액. null 이면 패스 카드를 숨긴다 */
  passPrice: number | null;
}

function ApplyPriceCard({ price, applyButton, passHref, passPrice }: Props) {
  const {
    regularPrice,
    discountAmount,
    discountPercentage,
    membershipDiscount,
    deposit,
    paymentPrice,
  } = price;

  const passDiscountPercent =
    paymentPrice > 0 && passPrice !== null
      ? Math.round(((paymentPrice - passPrice) / paymentPrice) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex flex-col bg-white py-2 md:px-4">
        <p className="text-small18 font-bold text-neutral-0">최종 결제 금액</p>

        <div className="mt-2 flex flex-col gap-2 text-xsmall16 text-neutral-20">
          <div className="flex items-center justify-between">
            <span className="text-xsmall14 text-neutral-30">정가</span>
            <span>{regularPrice.toLocaleString()}원</span>
          </div>
          {discountAmount !== 0 && (
            <div className="flex items-center justify-between">
              <span className="font-semibold text-system-error">
                {discountPercentage}% 할인
              </span>
              <span>-{discountAmount.toLocaleString()}원</span>
            </div>
          )}
          {membershipDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">패스 혜택 할인</span>
              <span>-{membershipDiscount.toLocaleString()}원</span>
            </div>
          )}
          {deposit > 0 && (
            <div className="flex items-center justify-between rounded-xxs bg-[#FFEFED] px-3 py-2">
              <span>모든 미션 수행 시, 환급</span>
              <span>-{deposit.toLocaleString()}원</span>
            </div>
          )}
        </div>

        <div className="mt-3 border-t border-neutral-80 pt-3 text-right">
          <strong className="text-medium24 font-bold text-primary md:text-xlarge28">
            {paymentPrice.toLocaleString()}원
          </strong>
        </div>
      </div>

      {applyButton}

      {passHref && passPrice !== null && (
        <Link
          href={passHref}
          className="flex items-center justify-between gap-3 rounded-md bg-primary-5 px-4 py-5"
        >
          <span className="text-xsmall16 font-semibold text-primary md:text-small18">
            {passPrice === 0
              ? '올인원 패스 구독하고 무료로 참여하기'
              : '올인원 패스 구독하고 참여하기'}
          </span>
          <span className="flex shrink-0 flex-col items-end">
            {passDiscountPercent > 0 && (
              <span className="text-xxsmall12">
                {/* 100% 는 정가 취소선만으로 충분해 비율을 숨긴다 */}
                {passDiscountPercent < 100 && (
                  <span className="font-semibold text-system-error">
                    {passDiscountPercent}%{' '}
                  </span>
                )}
                <span className="text-neutral-40 line-through">
                  {paymentPrice.toLocaleString()}원
                </span>
              </span>
            )}
            <strong className="text-medium22 font-bold text-primary md:text-medium24">
              {passPrice.toLocaleString()}원
            </strong>
          </span>
        </Link>
      )}
    </div>
  );
}

export default ApplyPriceCard;
