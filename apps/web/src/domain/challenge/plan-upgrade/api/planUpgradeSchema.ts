import { ChallengePricePlan, ChallengePricePlanEnum } from '@/schema';
import { z } from 'zod';

/** 업그레이드가 막힌 이유. 서버가 이 순서로 검사해 처음 걸린 것을 준다 */
export const planUpgradeUnavailableReasonSchema = z.enum([
  'CANCELED',
  'PARTIALLY_REFUNDED',
  'LIGHT',
  'TOP_PLAN',
  'ALREADY_CHANGED',
  'DEADLINE_PASSED',
]);

export type PlanUpgradeUnavailableReason = z.infer<
  typeof planUpgradeUnavailableReasonSchema
>;

export const planUpgradeFeedbackTypeSchema = z.enum([
  'WRITTEN_FEEDBACK',
  'LIVE_FEEDBACK',
]);

export type PlanUpgradeFeedbackType = z.infer<
  typeof planUpgradeFeedbackTypeSchema
>;

/** 대상 플랜에서 새로 피드백을 받는 미션. th 오름차순 */
const planUpgradeFeedbackMissionSchema = z.object({
  missionId: z.number(),
  th: z.number(),
  title: z.string(),
  feedbackType: planUpgradeFeedbackTypeSchema,
});

export type PlanUpgradeFeedbackMission = z.infer<
  typeof planUpgradeFeedbackMissionSchema
>;

/** 현재보다 높은 플랜. 서열 오름차순이라 첫 항목이 바로 위 플랜이다 */
const planUpgradeOptionSchema = z.object({
  planType: ChallengePricePlanEnum,
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  salePrice: z.number(),
  additionalAmount: z.number(),
  feedbackMissions: z.array(planUpgradeFeedbackMissionSchema),
});

export type PlanUpgradeOption = z.infer<typeof planUpgradeOptionSchema>;

/** GET /api/v1/plan-upgrade/{applicationId} 셀프 업그레이드 조회 */
export const planUpgradeSchema = z.object({
  applicationId: z.number(),
  programId: z.number(),
  challengeTitle: z.string().nullable().optional(),
  currentPlan: z.object({
    planType: ChallengePricePlanEnum,
    description: z.string().nullable().optional(),
    salePrice: z.number(),
    paidAmount: z.number(),
  }),
  deadline: z.string().nullable().optional(),
  unavailableReason: planUpgradeUnavailableReasonSchema.nullable().optional(),
  options: z.array(planUpgradeOptionSchema),
});

export type PlanUpgrade = z.infer<typeof planUpgradeSchema>;

/** POST /api/v1/plan-upgrade/{applicationId}/confirm 요청 본문 */
export interface ConfirmPlanUpgradeReq {
  toPlan: ChallengePricePlan;
  paymentKey: string;
  orderId: string;
  amount: number;
}

/** POST /api/v1/plan-upgrade/{applicationId}/confirm 응답 */
export const confirmPlanUpgradeResSchema = z.object({
  applicationId: z.number(),
  programId: z.number(),
  fromPlan: ChallengePricePlanEnum,
  toPlan: ChallengePricePlanEnum,
  additionalAmount: z.number(),
  paidAt: z.string().nullable().optional(),
  receiptUrl: z.string().nullable().optional(),
  method: z.string().nullable().optional(),
});

export type ConfirmPlanUpgradeRes = z.infer<typeof confirmPlanUpgradeResSchema>;
