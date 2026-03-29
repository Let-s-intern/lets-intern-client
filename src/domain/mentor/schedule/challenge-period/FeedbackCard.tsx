'use client';

import type { PeriodBarData } from './ChallengePeriodBar';

const COLORS = [
  {
    line: 'bg-[#fdad00]',
    border: 'border-[#fdad00]',
    badge: 'bg-[#fdad00]',
    body: 'bg-[#fff3d9]',
  },
  {
    line: 'bg-[#14bcff]',
    border: 'border-[#14bcff]',
    badge: 'bg-[#14bcff]',
    body: 'bg-[#eefaff]',
  },
  {
    line: 'bg-green-400',
    border: 'border-green-400',
    badge: 'bg-green-400',
    body: 'bg-green-50',
  },
  {
    line: 'bg-purple-400',
    border: 'border-purple-400',
    badge: 'bg-purple-400',
    body: 'bg-purple-50',
  },
];

/**
 * Single-day feedback card — vertical stack:
 *
 *   📄 [ N차 피드백 ]
 *   시작 전 0 · 진행 중 0 · 완료 0
 *   ├────────┤
 *   [챌린지명]
 *   미제출 0 · 제출 0
 */
const CompactFeedbackCard = ({
  bar,
  onBarClick,
}: {
  bar: PeriodBarData;
  onBarClick: (challengeId: number, missionId: number) => void;
}) => {
  const color = COLORS[(bar.colorIndex ?? 0) % COLORS.length];

  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      className="flex w-full flex-col overflow-hidden text-left transition-opacity hover:opacity-80"
    >
      {/* Row 1: 📄 [ N차 피드백 ] */}
      <div className="flex h-6 items-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0"
        >
          <g clipPath="url(#clip)">
            <path
              d="M7 4H17C17.5523 4 18 4.44772 18 5V19C18 19.5523 17.5523 20 17 20H7C6.44772 20 6 19.5523 6 19V5C6 4.44772 6.44772 4 7 4Z"
              stroke="#2A2D34"
              strokeWidth="1.2"
            />
            <path
              d="M9.5 8.5H14.5M9.5 12H14.5M9.5 15.5H12.5"
              stroke="#2A2D34"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </g>
          <defs>
            <clipPath id="clip">
              <rect x="3" y="2" width="18" height="16" rx="0" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span className="whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px] text-neutral-10">
          [ {bar.th}차 피드백 ]
        </span>
      </div>

      {/* Row 2: 시작 전 · 진행 중 · 완료 */}
      <div className="flex items-center gap-1 whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px]">
        <span className="text-[#f64e39]">시작 전</span>
        <span className="text-[#f64e39]">{bar.waitingCount}</span>
        <span className="text-neutral-10">·</span>
        <span className="text-neutral-10">진행 중</span>
        <span className="text-neutral-10">{bar.inProgressCount}</span>
        <span className="text-neutral-10">·</span>
        <span className="text-neutral-10">완료</span>
        <span className="text-neutral-10">{bar.completedCount}</span>
      </div>

      {/* Row 3: H-line ├────┤ */}
      <div className="flex h-3 items-center">
        <div className={`h-full w-0.5 ${color.line}`} />
        <div className={`h-0.5 flex-1 ${color.line}`} />
        <div className={`h-full w-0.5 ${color.line}`} />
      </div>

      {/* Row 4-5: card body */}
      <div className={`flex flex-col gap-1 p-2 ${color.body}`}>
        <span
          className={`shrink-0 whitespace-nowrap rounded-[3px] px-2 py-1 text-xxsmall12 font-medium tracking-[-0.3px] text-white ${color.badge}`}
        >
          {bar.challengeTitle}
        </span>
        <div className="flex items-center gap-1 whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px]">
          <span className="text-neutral-40">미제출</span>
          <span className="text-neutral-40">{bar.notSubmittedCount}</span>
          <span className="text-neutral-10">·</span>
          <span className="text-neutral-10">제출</span>
          <span className="text-neutral-10">{bar.submittedCount}</span>
        </div>
      </div>
    </button>
  );
};

export default CompactFeedbackCard;
export { CompactFeedbackCard };
