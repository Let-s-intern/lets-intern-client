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
      className="flex w-full flex-col gap-0.5 rounded border border-orange-200 bg-orange-50 px-2 py-1 text-left transition-opacity hover:opacity-80"
    >
      <div className="flex items-center gap-1">
        <span className="rounded bg-orange-200 px-1 py-0.5 text-[10px] font-semibold text-orange-800">
          서면
        </span>
        <span className="truncate text-xs font-medium text-neutral-800">
          {bar.challengeTitle} {bar.th}회차
        </span>
      </div>
      <div className="flex flex-wrap gap-x-2 text-[10px] text-neutral-600">
        <span>미제출 {bar.notSubmittedCount}</span>
        <span>/</span>
        <span>제출 {bar.submittedCount}</span>
        <span className="ml-2">시작전 {bar.waitingCount}</span>
        <span>/</span>
        <span>진행 중 {bar.inProgressCount}</span>
        <span>/</span>
        <span>완료 {bar.completedCount}</span>
      </div>
    </button>
  );
};

export default ChallengePeriodBar;
