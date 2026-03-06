'use client';

export interface PeriodBarData {
  challengeId: number;
  missionId: number;
  challengeTitle: string;
  th: number;
  startDate: string;
  endDate: string;
  submittedCount: number;
  notSubmittedCount: number;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  colorIndex?: number;
}

interface ChallengePeriodBarProps {
  bar: PeriodBarData;
  style?: React.CSSProperties;
  onBarClick: (challengeId: number, missionId: number) => void;
}

const COLORS = [
  {
    border: 'border-amber-500',
    line: 'bg-amber-500',
    badge: 'bg-amber-500',
    body: 'bg-orange-100',
  },
  {
    border: 'border-cyan-400',
    line: 'bg-cyan-400',
    badge: 'bg-cyan-400',
    body: 'bg-sky-50',
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

const ChallengePeriodBar = ({
  bar,
  style,
  onBarClick,
}: ChallengePeriodBarProps) => {
  const color = COLORS[(bar.colorIndex ?? 0) % COLORS.length];

  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      style={style}
      className="flex w-full flex-col overflow-hidden text-left transition-opacity hover:opacity-80"
    >
      {/* Top row: nth feedback + status counts + colored line */}
      <div className="flex h-6 items-center gap-2 overflow-hidden">
        <div className="flex shrink-0 items-center gap-0.5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M5.25 3H12.75C13.1642 3 13.5 3.33579 13.5 3.75V14.25C13.5 14.6642 13.1642 15 12.75 15H5.25C4.83579 15 4.5 14.6642 4.5 14.25V3.75C4.5 3.33579 4.83579 3 5.25 3Z"
              stroke="#1A1A1A"
              strokeWidth="1"
            />
            <path d="M7 6.5H11M7 9H11M7 11.5H9.5" stroke="#1A1A1A" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
          <span className="whitespace-nowrap text-xs font-medium leading-4 text-neutral-800">
            [ {bar.th}차 피드백 ]
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
          <span className="text-xs font-medium leading-4 text-red-500">
            {bar.waitingCount}
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">·</span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            {bar.inProgressCount}
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">·</span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            {bar.completedCount}
          </span>
        </div>
        {/* Colored line */}
        <div
          className={`flex h-3 min-w-0 flex-1 items-center border-r-2 ${color.border}`}
        >
          <div className={`h-0.5 w-full ${color.line}`} />
        </div>
      </div>

      {/* Bottom row: challenge badge + submission counts */}
      <div
        className={`flex items-center justify-between gap-2 overflow-hidden p-2 ${color.body}`}
      >
        <span
          className={`shrink-0 whitespace-nowrap rounded-[3px] px-2 py-1 text-xs font-medium leading-4 text-white ${color.badge}`}
        >
          {bar.challengeTitle}
        </span>
        <div className="flex shrink-0 items-center gap-1 whitespace-nowrap px-1">
          <span className="text-xs font-medium leading-4 text-neutral-500">
            미제출
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-500">
            {bar.notSubmittedCount}
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">·</span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            제출
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            {bar.submittedCount}
          </span>
        </div>
      </div>
    </button>
  );
};

export default ChallengePeriodBar;
