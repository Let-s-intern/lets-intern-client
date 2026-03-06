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
  { borderTop: 'border-t-orange-400', badge: 'bg-orange-400', bg: 'bg-orange-50/30', border: 'border-orange-200' },
  { borderTop: 'border-t-blue-400', badge: 'bg-blue-400', bg: 'bg-blue-50/30', border: 'border-blue-200' },
  { borderTop: 'border-t-green-400', badge: 'bg-green-400', bg: 'bg-green-50/30', border: 'border-green-200' },
  { borderTop: 'border-t-purple-400', badge: 'bg-purple-400', bg: 'bg-purple-50/30', border: 'border-purple-200' },
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
      className={`flex w-full flex-col gap-1.5 rounded-md border text-left transition-opacity hover:opacity-80 border-t-[3px] ${color.borderTop} ${color.border} ${color.bg} px-3 py-2 border-l border-r border-b`}
    >
      {/* Top: Doc icon + Nth feedback + status counts */}
      <div className="flex w-full items-center gap-1.5 text-[11px]">
        <span className="text-lg leading-none">📄</span>
        <span className="font-semibold text-neutral-700">
          [{bar.th}차 피드백]
        </span>
        <span className="text-red-500">시작 전 {bar.waitingCount}</span>
        <span className="text-neutral-300">·</span>
        <span className="text-amber-500">진행 중 {bar.inProgressCount}</span>
        <span className="text-neutral-300">·</span>
        <span className="text-green-600">완료 {bar.completedCount}</span>
      </div>

      {/* Middle: challenge title badge + submission counts */}
      <div className="mt-0.5 flex w-full items-center justify-between">
        <span className={`rounded px-2 py-0.5 text-[11px] font-medium text-white ${color.badge}`}>
          {bar.challengeTitle}
        </span>
        <span className="text-[11px] text-neutral-500">
          미제출 {bar.notSubmittedCount} · 제출 {bar.submittedCount}
        </span>
      </div>
    </button>
  );
};

export default ChallengePeriodBar;
