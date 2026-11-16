'use client';

import { twMerge } from '@/lib/twMerge';
import {
  ChallengeIdSchema,
  ChallengePriceInfo,
  ChallengePricePlan,
} from '@/schema';
import Link from 'next/link';
import { useChallengePlanPrice } from '../../hooks/useChallengePlanPrice';

export interface PlanTab {
  plan: ChallengePricePlan;
  label: string;
}

export type ApplyButtonState = 'OPEN' | 'APPLIED' | 'CLOSED';

interface Props {
  priceInfoList: ChallengePriceInfo[] | ChallengeIdSchema['priceInfo'];
  plan: ChallengePricePlan;
  /** 실시간 진행 플랜이 여러 개일 때만 탭을 보인다 */
  planTabs: PlanTab[];
  onChangePlan: (plan: ChallengePricePlan) => void;
  applyState: ApplyButtonState;
  onApply: () => void;
  /** 열린 올인원 패스로 가는 링크. 없거나 이미 패스 권한이 있으면 카드를 숨긴다 */
  passHref: string | null;
  /** 패스 회원이 이 플랜을 신청할 때 내는 금액 */
  passPrice: number | null;
}

const APPLY_BUTTON_TEXT: Record<ApplyButtonState, string> = {
  OPEN: '챌린지 신청하기',
  APPLIED: '이미 신청이 완료되었습니다',
  CLOSED: '모집이 마감되었습니다',
};

function ApplyPriceCard({
  priceInfoList,
  plan,
  planTabs,
  onChangePlan,
  applyState,
  onApply,
  passHref,
  passPrice,
}: Props) {
  const {
    regularPrice,
    discountAmount,
    discountPercentage,
    deposit,
    showDeposit,
    isPassApplied,
    membershipDiscount,
    sellingPrice,
    finalPrice,
  } = useChallengePlanPrice(priceInfoList, plan);

  const showPassCard =
    !isPassApplied &&
    plan !== 'LIGHT' &&
    passHref !== null &&
    passPrice !== null;
  const passDiscountPercent =
    sellingPrice > 0 && passPrice !== null
      ? Math.round(((sellingPrice - passPrice) / sellingPrice) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex flex-col rounded-md border border-neutral-85 bg-white px-4 py-5 shadow-[0px_0px_12px_rgba(0,0,0,0.06)] md:px-5">
        <p className="text-small18 font-bold text-neutral-0 md:text-small20">
          최종 결제 금액
        </p>

        {planTabs.length > 1 && (
          <div className="mt-3 flex items-center rounded-xs bg-neutral-95 px-2 py-1.5">
            {planTabs.map((tab) => (
              <button
                key={tab.plan}
                type="button"
                className={twMerge(
                  'flex h-8 flex-1 items-center justify-center truncate rounded-xxs px-2.5 text-xsmall14',
                  tab.plan === plan
                    ? 'bg-white font-medium text-neutral-0 shadow-[0px_0px_6px_rgba(0,0,0,0.08)]'
                    : 'font-normal text-neutral-50',
                )}
                onClick={() => onChangePlan(tab.plan)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-col gap-2 text-xsmall16 text-neutral-20">
          <div className="flex items-center justify-between text-neutral-40">
            <span>정가</span>
            <span className="text-neutral-20">
              {regularPrice.toLocaleString()}원
            </span>
          </div>
          {discountAmount !== 0 && (
            <div className="flex items-center justify-between">
              <span className="font-semibold text-system-error">
                {discountPercentage}% 할인
              </span>
              <span>-{discountAmount.toLocaleString()}원</span>
            </div>
          )}
          {isPassApplied && membershipDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">패스 혜택 할인</span>
              <span>-{membershipDiscount.toLocaleString()}원</span>
            </div>
          )}
          {showDeposit && (
            <div className="flex items-center justify-between rounded-xxs bg-[#FFEFED] px-3 py-2">
              <span>모든 미션 수행 시, 환급</span>
              <span>-{deposit.toLocaleString()}원</span>
            </div>
          )}
        </div>

        <div className="mt-3 border-t border-neutral-80 pt-3 text-right">
          <strong className="text-medium24 font-bold text-primary md:text-xlarge28">
            {finalPrice.toLocaleString()}원
          </strong>
        </div>
      </div>

      <button
        type="button"
        disabled={applyState !== 'OPEN'}
        onClick={onApply}
        className="apply_button w-full rounded-sm bg-primary px-6 py-3.5 text-small18 font-medium text-white disabled:bg-neutral-80 disabled:text-neutral-40"
      >
        {APPLY_BUTTON_TEXT[applyState]}
      </button>

      {showPassCard && passHref && passPrice !== null && (
        <Link
          href={passHref}
          className="flex items-center justify-between gap-3 rounded-md border border-primary-20 bg-primary-5 px-4 py-4 md:px-5"
        >
          <span className="text-xsmall16 font-bold text-primary md:text-small18">
            {passPrice === 0
              ? '올인원 패스 구독하고 무료로 참여하기'
              : '올인원 패스 구독하고 참여하기'}
          </span>
          <span className="flex shrink-0 flex-col items-end">
            {passDiscountPercent > 0 && (
              <span className="text-xxsmall12">
                <span className="font-semibold text-system-error">
                  {passDiscountPercent}%
                </span>{' '}
                <span className="text-neutral-40 line-through">
                  {sellingPrice.toLocaleString()}원
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
