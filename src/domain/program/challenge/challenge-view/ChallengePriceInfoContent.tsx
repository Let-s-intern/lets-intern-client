'use client';

import { useInstallmentPayment } from '@/hooks/useInstallmentPayment';
import { twMerge } from '@/lib/twMerge';
import {
  ChallengeIdSchema,
  ChallengePriceInfo,
  ChallengePricePlan,
} from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { useMemo, useState } from 'react';

type Plans = {
  [key in ChallengePricePlan]?: string;
};

const PlanButton = ({
  children,
  active,
  onClick,
}: {
  children?: string;
  active: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        'flex h-7 flex-1 items-center justify-center truncate text-nowrap rounded-xxs px-2.5 py-1 text-xsmall14 md:h-8 md:text-xsmall16',
        active
          ? 'bg-white font-medium text-neutral-0 shadow-[0px_0px_6px_rgba(0,0,0,0.08)]'
          : 'bg-transparent font-normal text-neutral-50',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const FinalPriceInfo = ({
  finalPrice,
  sellingPrice,
}: {
  finalPrice: number;
  sellingPrice: number;
}) => {
  const {
    isLoading,
    months: installmentMonths,
    banks,
  } = useInstallmentPayment();

  const monthlyAmount = installmentMonths
    ? Math.round(finalPrice / installmentMonths)
    : null; // 할부 금액
  const showMonthlyPrice = monthlyAmount && sellingPrice >= 50000; // 5만원 이상일 때 할부 가능

  if (isLoading) {
    return (
      <span className="inline-block px-2.5 text-right text-neutral-40">
        로딩 중..
      </span>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-0.5 px-2.5">
      {showMonthlyPrice && (
        <div className="flex items-center justify-between font-medium text-neutral-20">
          <span>최종 결제 금액</span>
          <div>{finalPrice.toLocaleString()}원</div>
        </div>
      )}
      {/* 할부가 안되면 할부 금액에 최종 결제 금액이 대신 표시됩니다 */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-neutral-20">
          {showMonthlyPrice ? '' : '최종 결제 금액'}
        </span>
        <div className="flex flex-col items-end gap-0.5">
          <strong className="text-medium24 font-bold text-[#4A76FF]">
            {showMonthlyPrice
              ? `월 ${monthlyAmount.toLocaleString()}원`
              : `${finalPrice.toLocaleString()}원`}
          </strong>
          {showMonthlyPrice && (
            <span className="text-xxsmall12 text-neutral-30">
              * {banks.join(', ')}은행 {installmentMonths}개월 무이자 할부 시
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  priceInfoList: ChallengePriceInfo[] | ChallengeIdSchema['priceInfo'];
}

function ChallengePriceInfoContent({ priceInfoList }: Props) {
  const [active, setActive] = useState<ChallengePricePlan>('BASIC');

  const basicPriceInfo = priceInfoList.find(
    (item) => item.challengePricePlanType === 'BASIC',
  );

  const deposit = basicPriceInfo?.refund ?? 0; // 환급 (보증금)
  const activeDescription =
    priceInfoList.find((item) => item.challengePricePlanType === active)
      ?.description ?? '';

  const {
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
  } = getChallengeOptionPriceInfo(priceInfoList);

  const { regularPrice, discountAmount, sellingPrice } = useMemo(() => {
    switch (active) {
      case 'STANDARD':
        return {
          regularPrice: standardRegularPrice,
          discountAmount: standardDiscountAmount,
          sellingPrice: standardRegularPrice - standardDiscountAmount,
        };
      case 'PREMIUM':
        return {
          regularPrice: premiumRegularPrice,
          discountAmount: premiumDiscountAmount,
          sellingPrice: premiumRegularPrice - premiumDiscountAmount,
        };
      // BASIC
      default:
        return {
          regularPrice: basicRegularPrice,
          discountAmount: basicDiscountAmount,
          sellingPrice: basicRegularPrice - basicDiscountAmount,
        };
    }
  }, [
    active,
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
  ]);

  const discountPercentage = Math.round((discountAmount / regularPrice) * 100);
  const finalPrice = sellingPrice - deposit; // 최종 금액 (환급 금액 미포함)

  const plans = useMemo(() => {
    const standardPriceInfo = priceInfoList.find(
      (item) => item.challengePricePlanType === 'STANDARD',
    );
    const premiumPriceInfo = priceInfoList.find(
      (item) => item.challengePricePlanType === 'PREMIUM',
    );

    const plans: Plans = {
      BASIC: basicPriceInfo?.title || '베이직',
    };

    if (standardPriceInfo) {
      plans['STANDARD'] = standardPriceInfo.title || '스탠다드';
    }
    if (premiumPriceInfo) {
      plans['PREMIUM'] = premiumPriceInfo.title || '프리미엄';
    }

    return plans;
  }, [priceInfoList, basicPriceInfo?.title]);

  const hasMultiplePlans = Object.entries(plans).length > 1;

  return (
    <div className="flex flex-col items-stretch gap-2">
      <div className="rounded-xs bg-neutral-95">
        {hasMultiplePlans && (
          <div className="flex items-center px-3 py-2">
            {Object.entries(plans).map(([key, value]) => (
              <PlanButton
                key={`plan-btn-${key}`}
                active={key === active}
                onClick={() => setActive(key as ChallengePricePlan)}
              >
                {value ?? '베이직'}
              </PlanButton>
            ))}
          </div>
        )}

        <div className="min-h-[174px] whitespace-pre-line px-3 pb-5 pt-2.5">
          <span className="text-xsmall14 font-semibold text-[#4A76FF]">
            이번 챌린지로 모든걸 얻어갈 수 있어요!
          </span>
          <p className="mt-1.5 whitespace-pre-line">{activeDescription}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-xsmall16 text-neutral-20">
          {/* 정가 */}
          <div className="flex h-[26px] w-full items-center justify-between px-3 text-neutral-40">
            <span>정가</span>
            <span>{regularPrice.toLocaleString()}원</span>
          </div>
          {/* 할인 금액 */}
          {discountAmount !== 0 && (
            <div className="flex w-full items-center justify-between px-3 font-medium">
              <span className="font-semibold text-system-error">
                {discountPercentage}% 할인
              </span>
              <span>-{discountAmount.toLocaleString()}원</span>
            </div>
          )}
          {/* 환급 */}
          {deposit !== 0 && (
            <div className="flex w-full items-center justify-between rounded-[2px] bg-[#FFEFED] px-3 py-1 font-medium">
              <span>모든 미션 수행 시, 환급</span>
              <span>-{deposit.toLocaleString()}원</span>
            </div>
          )}
        </div>

        {/* 최종 결제 금액 */}
        <FinalPriceInfo finalPrice={finalPrice} sellingPrice={sellingPrice} />
      </div>
    </div>
  );
}

export default ChallengePriceInfoContent;
