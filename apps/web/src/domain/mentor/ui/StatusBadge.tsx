import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import { FeedbackStatusMapping } from '@/api/challenge/challengeSchema';

const FEEDBACK_BADGE_STYLES: Record<FeedbackStatus, string> = {
  WAITING: 'bg-gray-100 text-gray-500',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
};

/**
 * Returns the Tailwind class string for a feedback status badge.
 */
export function getFeedbackBadgeStyle(status: FeedbackStatus): string {
  return FEEDBACK_BADGE_STYLES[status] ?? 'bg-gray-100 text-gray-500';
}

interface StatusBadgeProps {
  status: FeedbackStatus;
  count: number;
}

/**
 * Renders a feedback status badge with count.
 * Used in both ChallengeDetailContent and ChallengeFeedbackCard.
 */
const StatusBadge = ({ status, count }: StatusBadgeProps) => {
  if (count === 0) return null;

  const label = FeedbackStatusMapping[status];

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${getFeedbackBadgeStyle(status)}`}
    >
      {label} {count}
    </span>
  );
};

export default StatusBadge;
