import type { PeriodBarData } from '../../types';
import { currentNow } from '../../constants/mockNow';

interface LiveFeedbackPeriodBarProps {
  bar: PeriodBarData;
  onClick?: (bar: PeriodBarData) => void;
}

const LiveFeedbackPeriodBar = ({
  bar,
  onClick,
}: LiveFeedbackPeriodBarProps) => {
  const isPast = new Date(bar.endDate).getTime() < currentNow().getTime();
  const phaseCompleted = bar.submittedCount === 0 && isPast;

  return (
    <button
      type="button"
      onClick={onClick ? () => onClick(bar) : undefined}
      className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-sm border border-neutral-80 bg-white px-3 text-left transition-colors hover:bg-neutral-95"
    >
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" />
      <span className="text-xsmall14 shrink-0 whitespace-nowrap font-bold text-red-500">
        LIVE
      </span>
      <span className="text-xsmall14 shrink-0 whitespace-nowrap font-semibold tracking-[-0.3px] text-neutral-10">
        {bar.th}회차 라이브 피드백
      </span>

      {phaseCompleted && (
        <span className="shrink-0 whitespace-nowrap rounded bg-neutral-95 px-1.5 py-0.5 text-[11px] font-medium tracking-[-0.3px] text-neutral-40">
          완료
        </span>
      )}
      {!phaseCompleted && bar.submittedCount > 0 && (
        <span className="shrink-0 whitespace-nowrap rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-medium tracking-[-0.3px] text-red-500">
          {bar.completedCount}/{bar.submittedCount}
        </span>
      )}

      <span className="flex-1" />

      <span className="text-xxsmall12 min-w-0 truncate font-medium tracking-[-0.3px] text-neutral-30">
        {bar.challengeTitle}
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0 text-neutral-40"
        aria-hidden
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default LiveFeedbackPeriodBar;
