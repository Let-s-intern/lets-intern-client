'use client';

import { twMerge } from '@/lib/twMerge';
import { ChallengePriceInfo, ChallengePricePlan } from '@/schema';
import { ReactNode, useState } from 'react';

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
        'flex flex-1 items-center justify-center text-nowrap rounded-xxs px-2.5',
        active
          ? 'max-h-7 bg-white py-1 font-medium text-neutral-0 shadow-[0px_0px_6px_rgba(0,0,0,0.08)]'
          : 'max-h-8 bg-transparent py-[5px] font-normal text-neutral-50',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface Props {
  content?: ReactNode;
  priceInfoList: ChallengePriceInfo[];
}

function ChallengePriceInfoWithContent({ content, priceInfoList }: Props) {
  const [active, setActive] = useState<ChallengePricePlan>('BASIC');

  const basicPriceInfo = priceInfoList.find(
    (item) => item.challengePricePlanType === 'BASIC',
  );
  const standardPriceInfo = priceInfoList.find(
    (item) => item.challengePricePlanType === 'STANDARD',
  );
  const premiumPriceInfo = priceInfoList.find(
    (item) => item.challengePricePlanType === 'PREMIUM',
  );

  const getPlans = () => {
    const plans: Plans = {
      BASIC: basicPriceInfo?.title ?? '베이직',
    };

    if (standardPriceInfo) plans['STANDARD'] = '프리미엄';
    if (premiumPriceInfo) plans['PREMIUM'] = '올인원';

    return plans;
  };

  return (
    <div className="flex flex-col items-stretch gap-2">
      <div className="rounded-xs bg-neutral-95">
        <div className="flex items-center px-3 py-2">
          {Object.entries(getPlans()).map(([key, value]) => (
            <PlanButton
              key={`plan-btn-${key}`}
              active={key === active}
              onClick={() => setActive(key as ChallengePricePlan)}
            >
              {value ?? '베이직'}
            </PlanButton>
          ))}
        </div>

        <div className="px-3 pb-5 pt-2.5">{content}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-xsmall16 text-neutral-20">
          <div className="flex h-[26px] w-full items-center justify-between px-3 text-neutral-40">
            <span>정가</span>
            <span>100,000원</span>
          </div>
          <div className="flex w-full items-center justify-between px-3 font-medium">
            <div className="font-semibold text-system-error">10% 할인</div>
            <div>-10,000원</div>
          </div>
          <div className="flex w-full items-center justify-between rounded-[2px] bg-[#FFEFED] px-3 py-1 font-medium">
            <div>모든 미션 수행 시, 환급</div>
            <div>-10,000원</div>
          </div>
        </div>

        {/* 최종 결제 금액 */}
        <div className="flex flex-col items-stretch gap-0.5 px-2.5">
          <div className="flex items-center justify-between font-medium text-neutral-20">
            <div>최종 결제 금액</div>
            <div>80,000원</div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <strong className="text-medium24 font-bold text-[#4A76FF]">
              월 13,400원
            </strong>
            <span className="text-xxsmall12 text-neutral-30">
              * 우리은행 6개월 무이자 할부 시
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengePriceInfoWithContent;
