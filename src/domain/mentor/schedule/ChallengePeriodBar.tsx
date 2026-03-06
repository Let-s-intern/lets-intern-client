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
  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      style={style}
      className="flex w-full flex-col overflow-hidden text-left transition-opacity hover:opacity-80"
    >
      {/* Top row: icon + nth feedback + status counts + colored line */}
      <div className="flex h-6 items-center gap-2">
        <div className="flex items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
          >
            <circle cx="7" cy="7" r="1.5" stroke="#1A1A1A" strokeWidth="0.8" />
            <rect
              x="9"
              y="5"
              width="10"
              height="12"
              rx="1"
              stroke="#1A1A1A"
              strokeWidth="0.8"
            />
          </svg>
          <span className="whitespace-nowrap text-xs font-medium leading-4 text-neutral-800">
            [ {bar.th}차 피드백 ]
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium leading-4 text-red-500">
            시작 전
          </span>
          <span className="text-xs font-medium leading-4 text-red-500">
            {bar.waitingCount}
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            ·
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            진행 중
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            {bar.inProgressCount}
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            ·
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            완료
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            {bar.completedCount}
          </span>
        </div>
        {/* Colored line */}
        <div
          className={`flex h-3 flex-1 flex-col items-center justify-center border-r-2 ${color.border}`}
        >
          <div className={`h-0.5 w-full ${color.line}`} />
        </div>
      </div>

      {/* Bottom row: challenge badge + submission counts */}
      <div className={`flex items-center justify-between p-2 ${color.body}`}>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-[3px] border px-2 py-1 text-xs font-medium leading-4 text-white ${color.badge}`}
          >
            {bar.challengeTitle}
          </span>
        </div>
        <div className="flex items-center gap-1 px-1">
          <span className="text-xs font-medium leading-4 text-neutral-500">
            미제출
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-500">
            {bar.notSubmittedCount}
          </span>
          <span className="text-xs font-medium leading-4 text-neutral-800">
            ·
          </span>
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
