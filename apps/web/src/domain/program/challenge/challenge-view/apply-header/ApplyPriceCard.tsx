'use client';

import { twMerge } from '@/lib/twMerge';
import { ReactNode, useState } from 'react';
import PassBenefitModal from './PassBenefitModal';

export type ApplyButtonState = 'OPEN' | 'APPLIED' | 'CLOSED';

/** 가격 카드에 보이는 금액. 챌린지 플랜이든 가이드북이든 이 모양으로 넘긴다 */
export interface PriceSummary {
  regularPrice: number;
  discountAmount: number;
  discountPercentage: number;
  /** 미션 환급액. 0 이면 줄을 숨긴다 */
  deposit: number;
  /** 실제 결제 금액 */
  paymentPrice: number;
  /** 올인원 패스 회원이면 패스 혜택으로 빠지는 금액. 일반 회원이면 없다 */
  passDiscount?: number;
}

const APPLY_BUTTON_TEXT: Record<Exclude<ApplyButtonState, 'OPEN'>, string> = {
  APPLIED: '이미 신청이 완료되었습니다',
  CLOSED: '모집이 마감되었습니다',
};

export const ApplyButton = ({
  state,
  label,
  onClick,
  className,
}: {
  state: ApplyButtonState;
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    disabled={state !== 'OPEN'}
    onClick={onClick}
    className={twMerge(
      'apply_button w-full rounded-md bg-primary px-6 py-3 text-small18 font-medium text-white disabled:bg-neutral-80 disabled:text-neutral-40',
      className,
    )}
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
  /** 열린 패스가 하나일 때 그 패스 id. 모달에 가격·구성을 보일 때 쓴다 */
  membershipId: number | null;
}

/** 결제 금액 표: 정가 · 할인 · 미션 환급 · 지금 결제할 금액 */
export function PriceBreakdown({
  price,
  compact = false,
}: {
  price: PriceSummary;
  compact?: boolean;
}) {
  const {
    regularPrice,
    discountAmount,
    discountPercentage,
    deposit,
    paymentPrice,
    passDiscount,
  } = price;
  const isPassMember = passDiscount !== undefined;

  return (
    <div
      className={twMerge(
        'flex flex-col bg-white',
        compact ? 'text-xsmall14' : 'py-2 md:px-5',
      )}
    >
      <p
        className={twMerge(
          'font-bold text-neutral-0',
          compact ? 'text-small18' : 'text-small18 md:text-medium22',
        )}
      >
        결제 금액
      </p>

      <div
        className={twMerge(
          'mt-3 flex flex-col gap-2 text-neutral-20',
          !compact && 'text-xsmall16',
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-neutral-30">정가</span>
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
        {isPassMember && passDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">패스 혜택 할인</span>
            <span>-{passDiscount.toLocaleString()}원</span>
          </div>
        )}
        {deposit > 0 && (
          <div className="flex items-center justify-between rounded-xxs bg-[#FFEFED] px-3 py-2">
            <span>모든 미션 수행 시, 환급</span>
            <span>-{deposit.toLocaleString()}원</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-80 pt-3">
        <span
          className={twMerge(
            'text-neutral-20',
            compact ? 'text-xsmall14' : 'text-xsmall16',
          )}
        >
          {isPassMember ? '올인원 패스 회원 결제 금액' : '지금 결제할 금액'}
        </span>
        <strong
          className={twMerge(
            'font-bold text-primary',
            compact ? 'text-medium22' : 'text-medium24 md:text-xlarge28',
          )}
        >
          {paymentPrice.toLocaleString()}원
        </strong>
      </div>
    </div>
  );
}

function ApplyPriceCard({
  price,
  applyButton,
  passHref,
  passPrice,
  membershipId,
}: Props) {
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const { paymentPrice } = price;

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <PriceBreakdown price={price} />

      {applyButton}

      {passHref && passPrice !== null && (
        <button
          type="button"
          onClick={() => setIsPassModalOpen(true)}
          className="pass_benefit_card flex flex-col gap-2 rounded-xs bg-[#F5F6FF] px-4 py-3 text-left"
        >
          <span className="w-fit rounded-xxs bg-primary px-2 py-0.5 text-xxsmall12 font-semibold text-white">
            ALL-IN-ONE PASS
          </span>
          <span className="flex w-full items-center justify-between gap-3">
            <span className="text-xsmall14 text-neutral-0">
              올인원 패스 회원은{' '}
              {passPrice === 0 ? (
                <strong className="font-bold text-primary">무료</strong>
              ) : (
                <strong className="font-bold text-primary">
                  {passPrice.toLocaleString()}원
                </strong>
              )}
              {passPrice === 0 ? '로' : '에'} 참여 가능!
            </span>
            <span className="shrink-0 text-xsmall14 font-medium text-primary">
              패스 혜택 보기 &gt;
            </span>
          </span>
        </button>
      )}

      {isPassModalOpen && passHref && passPrice !== null && (
        <PassBenefitModal
          passHref={passHref}
          membershipId={membershipId}
          programPrice={paymentPrice}
          passProgramPrice={passPrice}
          onClose={() => setIsPassModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ApplyPriceCard;
