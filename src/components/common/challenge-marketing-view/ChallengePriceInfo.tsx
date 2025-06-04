import { twMerge } from '@/lib/twMerge';
import { ChallengePriceInfo } from '@/schema';
import { ReactNode } from 'react';

const PlanButton = ({
  children,
  active,
}: {
  children?: string;
  active: boolean;
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        'flex-1 overflow-clip rounded-xxs px-2.5 py-1 text-center',
        active
          ? 'bg-white font-medium text-neutral-0 shadow-[0px_0px_6px_rgba(0,0,0,0.08)]'
          : 'bg-transparent font-normal text-neutral-50',
      )}
    >
      <div className={active ? 'h-5' : 'h-6'}>{children}</div>
    </button>
  );
};

interface Props {
  content?: ReactNode;
  priceInfoList: ChallengePriceInfo[];
}

function ChallengePriceInfoWithContent({ content, priceInfoList }: Props) {
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
    const plans = [basicPriceInfo?.title];

    if (standardPriceInfo) plans.push('프리미엄');
    if (premiumPriceInfo) plans.push('올인원');

    return plans;
  };

  return (
    <div className="flex flex-col items-stretch gap-2">
      <div className="rounded-xs bg-neutral-95">
        <div className="flex items-center px-3 py-2">
          {getPlans().map((item, index) => (
            <PlanButton key={`plan-btn-${index}`} active={false}>
              {item ?? '베이직'}
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
            <div className="text-zinc-700">최종 결제 금액</div>
            <div className="text-zinc-700">80,000원</div>
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
