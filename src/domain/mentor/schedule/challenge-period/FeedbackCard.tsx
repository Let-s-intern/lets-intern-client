'use client';

import type { PeriodBarData } from './ChallengePeriodBar';

interface FeedbackCardProps {
  bar: PeriodBarData;
  /** Number of grid columns this card spans */
  colSpan: number;
  onBarClick: (challengeId: number, missionId: number) => void;
}

const COLORS = [
  {
    border: 'border-[#fdad00]',
    line: 'bg-[#fdad00]',
    badge: 'bg-[#fdad00]',
    body: 'bg-[#fff3d9]',
  },
  {
    border: 'border-[#14bcff]',
    line: 'bg-[#14bcff]',
    badge: 'bg-[#14bcff]',
    body: 'bg-[#eefaff]',
  },
  {
    border: 'border-green-400',
    line: 'bg-green-400',
    badge: 'bg-green-400',
    body: 'bg-green-50',
  },
  {
    border: 'border-purple-400',
    line: 'bg-purple-400',
    badge: 'bg-purple-400',
    body: 'bg-purple-50',
  },
];

/**
 * Compact feedback card for single-day missions.
 * Shows condensed info: nth feedback, challenge badge, and key counts.
 */
const CompactFeedbackCard = ({
  bar,
  onBarClick,
}: Omit<FeedbackCardProps, 'colSpan'>) => {
  const color = COLORS[(bar.colorIndex ?? 0) % COLORS.length];

  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      className="flex w-full flex-col gap-1 overflow-hidden text-left transition-opacity hover:opacity-80"
    >
      {/* Badge + nth */}
      <div className="flex items-center gap-1">
        <span
          className={`shrink-0 rounded-[3px] px-1.5 py-0.5 text-[10px] font-medium text-white ${color.badge}`}
        >
          {bar.challengeTitle}
        </span>
        <span className="whitespace-nowrap text-[10px] font-medium text-neutral-30">
          {bar.th}차
        </span>
      </div>
      {/* Counts */}
      <div className="flex items-center gap-1 text-[10px] font-medium">
        {bar.waitingCount > 0 && (
          <span className="text-[#f64e39]">{bar.waitingCount}</span>
        )}
        {bar.waitingCount > 0 && bar.completedCount > 0 && (
          <span className="text-neutral-40">/</span>
        )}
        {bar.completedCount > 0 && (
          <span className="text-neutral-40">{bar.completedCount}</span>
        )}
      </div>
    </button>
  );
};

/**
 * FeedbackCard renders differently based on duration:
 * - 1 day (colSpan === 1): Compact card
 * - 2+ days (colSpan >= 2): Full period bar (delegated to ChallengePeriodBar)
 */
const FeedbackCard = ({ bar, colSpan, onBarClick }: FeedbackCardProps) => {
  if (colSpan <= 1) {
    return <CompactFeedbackCard bar={bar} onBarClick={onBarClick} />;
  }

  // For multi-day spans, return null (parent will use ChallengePeriodBar)
  return null;
};

export default FeedbackCard;
export { CompactFeedbackCard };
