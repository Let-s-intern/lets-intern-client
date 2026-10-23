import dayjs from '@/lib/dayjs';
import type {
  PlanUpgradeFeedbackMission,
  PlanUpgradeFeedbackType,
  PlanUpgradeUnavailableReason,
} from '../api/planUpgradeSchema';

export const formatAdditionalAmount = (amount: number) =>
  `+${amount.toLocaleString()}원`;

export const formatUpgradeCta = (amount: number) =>
  `${amount.toLocaleString()}원에 업그레이드 하기`;

const FEEDBACK_TYPE_TEXT: Record<PlanUpgradeFeedbackType, string> = {
  WRITTEN_FEEDBACK: '서면 멘토링',
  LIVE_FEEDBACK: 'Live 멘토링',
};

export const formatFeedbackMission = ({
  th,
  title,
  feedbackType,
}: Pick<PlanUpgradeFeedbackMission, 'th' | 'title' | 'feedbackType'>) =>
  `${th}회차 미션 ${title} ${FEEDBACK_TYPE_TEXT[feedbackType]}`;

/** 혜택 제목. 기존 데이터로만 만든다 (D19) */
export const formatFeedbackCount = (count: number) => `피드백 ${count}회`;

export const formatDeadline = (deadline: string) =>
  dayjs(deadline).format('M월 D일 HH:mm');

const UNAVAILABLE_REASON_TEXT: Record<
  Exclude<PlanUpgradeUnavailableReason, 'DEADLINE_PASSED'>,
  string
> = {
  CANCELED: '취소된 신청은 플랜을 업그레이드할 수 없어요',
  PARTIALLY_REFUNDED: '환불된 신청은 플랜을 업그레이드할 수 없어요',
  LIGHT: '라이트 플랜은 업그레이드할 수 없어요',
  TOP_PLAN: '이미 가장 높은 플랜을 이용 중이에요',
  ALREADY_CHANGED: '플랜은 한 번만 변경할 수 있어요',
};

export const unavailableReasonText = (
  reason: PlanUpgradeUnavailableReason,
  deadline?: string | null,
) => {
  if (reason !== 'DEADLINE_PASSED') return UNAVAILABLE_REASON_TEXT[reason];

  return deadline
    ? `업그레이드 가능 기간이 지났어요 (${formatDeadline(deadline)}까지)`
    : '업그레이드 가능 기간이 지났어요';
};
