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
      className="flex w-full flex-col gap-1 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-left transition-opacity hover:opacity-80"
    >
      {/* Top: Nth feedback + status counts */}
      <div className="flex items-center gap-2 text-[11px]">
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
      <div className="flex items-center justify-between">
        <span className="rounded bg-orange-400 px-2 py-0.5 text-[11px] font-medium text-white">
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
