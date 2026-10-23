import { challengePricePlanToText } from '@/utils/convert';

export interface PlanUpgradePayment {
  fromPlan: string;
  toPlan: string;
  additionalAmount: number;
  paidAt?: string | null;
}

const planText = (plan: string) =>
  challengePricePlanToText[plan as keyof typeof challengePricePlanToText] ??
  plan;

/** 원결제 뒤에 셀프 업그레이드로 더 낸 금액 합계 (LC-3247) */
export const sumPlanUpgradeAmount = (payments: PlanUpgradePayment[]) =>
  payments.reduce((sum, payment) => sum + payment.additionalAmount, 0);

/** 결제 정보에 한 줄로 보이는 추가 결제 이름 */
export const planUpgradePaymentTitle = ({
  fromPlan,
  toPlan,
}: PlanUpgradePayment) =>
  `플랜 업그레이드 (${planText(fromPlan)} → ${planText(toPlan)})`;
