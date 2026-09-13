import { PlanChangeOption } from '@/api/planChange';
import { ChallengePricePlan } from '@/schema';

const PLAN_LABEL: Record<ChallengePricePlan, string> = {
  BASIC: '베이직',
  STANDARD: '스탠다드',
  PREMIUM: '프리미엄',
  LIGHT: '라이트',
};

/** LIGHT 는 서열에 없다. 바꿀 수도, 바꿔 들어갈 수도 없다 (설계안 D1) */
const PLAN_RANK: Partial<Record<ChallengePricePlan, number>> = {
  BASIC: 1,
  STANDARD: 2,
  PREMIUM: 3,
};

export const formatPlan = (plan: ChallengePricePlan) => PLAN_LABEL[plan];

/** 받침이 없거나 ㄹ 받침이면 '로', 그 밖은 '으로'. 스탠다드로 / 프리미엄으로 */
const withRo = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const isHangul = code >= 0 && code < 11172;
  const jong = code % 28;
  return `${word}${isHangul && jong !== 0 && jong !== 8 ? '으로' : '로'}`;
};

/** 서버가 상위 플랜만 내려주지만, 화면도 현재보다 높은 플랜만 고르게 한번 더 거른다 */
export const getUpgradeOptions = (
  currentPlan: ChallengePricePlan,
  options: PlanChangeOption[],
) => {
  const currentRank = PLAN_RANK[currentPlan];
  if (currentRank === undefined) return [];
  return options.filter((option) => {
    const rank = PLAN_RANK[option.planType];
    return rank !== undefined && rank > currentRank;
  });
};

export interface PlanChangeConfirmInput {
  name: string;
  fromPlan: ChallengePricePlan;
  toPlan: ChallengePricePlan;
  /** 실제로 기록할 수납 금액. 계산값이 아니다 */
  additionalAmount: number;
}

/**
 * 변경 버튼 위에 보여주는 문장. 누르기 전에 무엇이 기록되는지 한 줄로 확인한다.
 * 금액은 운영이 고친 최종값이라 문장이 실제 기록과 같다 (설계안 D10).
 */
export const buildPlanChangeConfirmSentence = ({
  name,
  fromPlan,
  toPlan,
  additionalAmount,
}: PlanChangeConfirmInput): string =>
  `${name}님을 ${formatPlan(fromPlan)}에서 ${withRo(formatPlan(toPlan))} 변경하고 추가 수납 ${additionalAmount.toLocaleString()}원을 기록합니다`;

export interface PlanChangeParticipant {
  isCanceled?: boolean | null;
  challengePricePlanType?: ChallengePricePlan | null;
}

/**
 * 참여자 표의 플랜 변경 버튼을 막는 사유. null 이면 변경할 수 있다.
 * 서버도 같은 조건으로 거절하지만, 누르기 전에 이유를 보여준다 (설계안 D1)
 */
export const getPlanChangeDisabledReason = ({
  isCanceled,
  challengePricePlanType,
}: PlanChangeParticipant): string | null => {
  if (isCanceled) return '취소된 신청은 플랜을 변경할 수 없습니다';
  if (challengePricePlanType === 'LIGHT') {
    return '라이트 플랜은 변경할 수 없습니다';
  }
  if (challengePricePlanType === 'PREMIUM') {
    return '이미 가장 높은 플랜입니다';
  }
  return null;
};

export const buildPlanChangeSuccessMessage = (toPlan: ChallengePricePlan) =>
  `플랜을 ${withRo(formatPlan(toPlan))} 변경했습니다`;
