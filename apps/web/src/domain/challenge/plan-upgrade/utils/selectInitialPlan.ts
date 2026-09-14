import type { ChallengePricePlan } from '@/schema';
import type { PlanUpgradeOption } from '../api/planUpgradeSchema';

/**
 * 업그레이드 화면을 열 때 선택해 둘 플랜.
 *
 * 결제 단계에서 돌아오면 `plan` 쿼리로 고른 플랜을 복원한다. 쿼리가 없거나 선택지에 없으면
 * 올릴 수 있는 가장 높은 플랜이다 (D18). 서버가 선택지를 낮은 플랜부터 주므로 마지막 항목이다. 선택지가 없으면 null.
 */
export const selectInitialPlan = (
  options: Pick<PlanUpgradeOption, 'planType'>[],
  planQuery?: string | null,
): ChallengePricePlan | null => {
  const matched = options.find((option) => option.planType === planQuery);
  return matched?.planType ?? options[options.length - 1]?.planType ?? null;
};
