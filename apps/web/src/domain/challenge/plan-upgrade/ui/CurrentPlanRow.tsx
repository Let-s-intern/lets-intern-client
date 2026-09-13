import type { ChallengePricePlan } from '@/schema';

interface CurrentPlanRowProps {
  planType: ChallengePricePlan;
  paidAmount: number;
}

/** 지금 이용 중인 플랜과 지금까지 낸 금액 */
const CurrentPlanRow = ({ planType, paidAmount }: CurrentPlanRowProps) => (
  <section className="flex flex-col gap-2">
    <p className="text-xsmall14 text-neutral-40">현재 이용 중</p>
    <div className="flex items-center justify-between gap-3">
      <span className="text-small18 text-neutral-0 font-semibold">
        {planType}
      </span>
      <span className="text-xsmall16 text-neutral-20">
        {paidAmount.toLocaleString()}원 결제
      </span>
    </div>
  </section>
);

export default CurrentPlanRow;
