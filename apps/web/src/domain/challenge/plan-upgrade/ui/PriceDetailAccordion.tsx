import DownIcon from '@/assets/icons/down.svg?react';
import { twMerge } from '@/lib/twMerge';
import type { ChallengePricePlan } from '@/schema';
import { challengePricePlanToText } from '@/utils/convert';
import { useState } from 'react';

interface PriceDetailAccordionProps {
  currentPlanType: ChallengePricePlan;
  currentSalePrice: number;
  targetPlanType: ChallengePricePlan;
  targetSalePrice: number;
  additionalAmount: number;
}

const ROW_CLASS_NAME =
  'text-neutral-0 text-xsmall14 flex h-10 items-center justify-between px-3';

/** 운영안 "추가금은 얼마인가", "환불 금액 계산" 을 참여자 말로 옮긴 안내 */
const NOTICES = [
  '처음 결제할 때 받은 할인은 그대로 유지돼요.',
  '추가 결제에는 쿠폰을 사용할 수 없어요.',
  '환불할 때는 처음 결제 금액과 추가 결제 금액을 합쳐 환불 규정에 따라 계산돼요.',
];

/** 추가 결제 금액이 판매가 차액이라는 것을 `상위 플랜 금액 - 현재 플랜 금액 = 추가 결제 금액` 식으로 펼쳐 보여준다. 접힌 상태로 시작한다 */
const PriceDetailAccordion = ({
  currentPlanType,
  currentSalePrice,
  targetPlanType,
  targetSalePrice,
  additionalAmount,
}: PriceDetailAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="text-xsmall16 text-neutral-20 flex h-12 w-full items-center justify-between"
      >
        <span>결제 금액 상세 보기</span>
        <DownIcon
          aria-hidden="true"
          className={twMerge(
            'h-6 w-6 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      {isOpen && (
        <div className="flex flex-col pb-2">
          <div className={ROW_CLASS_NAME}>
            <span>{challengePricePlanToText[targetPlanType]} 플랜 금액</span>
            <span>{targetSalePrice.toLocaleString()}원</span>
          </div>
          <div className={ROW_CLASS_NAME}>
            <span>
              현재 {challengePricePlanToText[currentPlanType]} 플랜 금액
            </span>
            <span>- {currentSalePrice.toLocaleString()}원</span>
          </div>
          <hr className="bg-neutral-85" />
          <div className={twMerge(ROW_CLASS_NAME, 'font-semibold')}>
            <span>추가 결제 금액</span>
            <span>= {additionalAmount.toLocaleString()}원</span>
          </div>
          <ul className="text-xsmall14 text-neutral-40 mt-2 flex flex-col gap-1 px-3">
            {NOTICES.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default PriceDetailAccordion;
