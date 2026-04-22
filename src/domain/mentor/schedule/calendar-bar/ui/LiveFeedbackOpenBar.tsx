'use client';

import type { PeriodBarData } from '../../types';
import { getColor } from '../../constants/colors';

/** 라이브 피드백 오픈기간 바 — 멘토 일정 오픈 또는 멘티 신청 단계 */
const LiveFeedbackOpenBar = ({ bar }: { bar: PeriodBarData }) => {
  const color = getColor(bar.colorIndex ?? 0);
  const isMentorPhase = bar.barType === 'live-feedback-mentor-open';

  const phaseLabel = isMentorPhase ? '멘토 오픈' : '멘티 신청';
  const phaseDesc = isMentorPhase ? '라이브 피드백 일정 오픈' : '피드백 일정 신청';
  const labelColor = isMentorPhase ? 'text-orange-500' : 'text-sky-500';

  return (
    <div className="relative z-10 flex w-full flex-col overflow-hidden text-left">
      {/* Row 1: 단계 배지 + 우측 라인 */}
      <div className="flex h-6 min-w-0 items-center gap-2 overflow-hidden">
        <span
          className={`shrink-0 whitespace-nowrap text-xxsmall12 font-bold tracking-[-0.3px] ${labelColor}`}
        >
          {phaseLabel}
        </span>
        <div
          className={`flex h-3 min-w-0 flex-1 items-center border-r-2 ${color.border}`}
        >
          <div className={`h-0.5 w-full ${color.line}`} />
        </div>
      </div>

      {/* Row 2: 챌린지 배지 + 단계 설명 */}
      <div className={`flex items-center justify-between p-2 ${color.body}`}>
        <span
          className={`min-w-0 truncate rounded-[3px] px-2 py-1 text-xxsmall12 font-medium tracking-[-0.3px] text-white ${color.badge}`}
        >
          {bar.challengeTitle}
        </span>
        <span className="shrink-0 whitespace-nowrap px-1 text-xxsmall12 font-medium tracking-[-0.3px] text-neutral-40">
          {phaseDesc}
        </span>
      </div>
    </div>
  );
};

export default LiveFeedbackOpenBar;
