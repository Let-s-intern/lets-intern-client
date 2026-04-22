'use client';

import type { PeriodBarData } from '../../types';
import { getColor } from '../../constants/colors';

interface LiveFeedbackPeriodBarProps {
  bar: PeriodBarData;
  onClick?: (bar: PeriodBarData) => void;
}

/** 상단 캘린더에 표시되는 라이브 피드백 기간 바 (ChallengePeriodBar와 동일한 라인 구조) */
const LiveFeedbackPeriodBar = ({ bar, onClick }: LiveFeedbackPeriodBarProps) => {
  const color = getColor(bar.colorIndex ?? 0);
  const total = bar.submittedCount;
  const completed = bar.completedCount;
  const waiting = bar.waitingCount;

  const containerClassName = `relative z-10 flex w-full flex-col overflow-hidden text-left${
    onClick ? ' cursor-pointer transition-opacity hover:opacity-85' : ''
  }`;

  const content = (
    <>
      {/* Row 1: LIVE + 회차 + 카운트 + 우측 라인 */}
      <div className="flex h-6 min-w-0 items-center gap-2 overflow-hidden">
        {/* LIVE 배지 + 회차 */}
        <div className="flex shrink-0 items-center gap-1">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" />
          <span className="text-xxsmall12 font-bold text-red-500">LIVE</span>
          <span className="ml-0.5 whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px] text-neutral-10">
            [ {bar.th}회차 ]
          </span>
        </div>

        {/* 카운트 */}
        <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px]">
          <span className="text-[#f64e39]">시작 전</span>
          <span className="text-[#f64e39]">{waiting}</span>
          <span className="text-neutral-10">·</span>
          <span className="text-neutral-10">완료</span>
          <span className="text-neutral-10">{completed}</span>
        </div>

        {/* 우측 끝까지 이어지는 라인 */}
        <div
          className={`flex h-3 min-w-0 flex-1 items-center border-r-2 ${color.border}`}
        >
          <div className={`h-0.5 w-full ${color.line}`} />
        </div>
      </div>

      {/* Row 2: 카드 본문 */}
      <div className={`flex items-center justify-between p-2 ${color.body}`}>
        <span
          className={`min-w-0 truncate rounded-[3px] px-2 py-1 text-xxsmall12 font-medium tracking-[-0.3px] text-white ${color.badge}`}
        >
          {bar.challengeTitle}
        </span>
        <div className="flex shrink-0 items-center gap-1 whitespace-nowrap px-1 text-xxsmall12 font-medium tracking-[-0.3px]">
          <span className="text-neutral-40">전체</span>
          <span className="text-neutral-10">{total}명</span>
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(bar)}
        className={containerClassName}
      >
        {content}
      </button>
    );
  }
  return <div className={containerClassName}>{content}</div>;
};

export default LiveFeedbackPeriodBar;
