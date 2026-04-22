'use client';

import { getColor } from '../../constants/colors';
import type { PeriodBarData } from '../../types';

interface LiveFeedbackOpenBarProps {
  bar: PeriodBarData;
  onMentorOpenClick?: () => void;
}

/** 라이브 피드백 오픈기간 바 — 멘토 일정 오픈 또는 멘티 신청 단계 */
const LiveFeedbackOpenBar = ({
  bar,
  onMentorOpenClick,
}: LiveFeedbackOpenBarProps) => {
  const color = getColor(bar.colorIndex ?? 0);
  const isMentorPhase = bar.barType === 'live-feedback-mentor-open';
  const isMentorOpenClickable = isMentorPhase && !!onMentorOpenClick;

  const phaseLabel = isMentorPhase ? '멘토 오픈기간' : '멘티 신청기간';
  const phaseDesc = '라이브 피드백 일정 조율 기간';
  const labelColor = isMentorPhase ? 'text-orange-500' : 'text-sky-500';

  return (
    <div
      onClick={isMentorOpenClickable ? onMentorOpenClick : undefined}
      className={`relative z-10 flex w-full flex-col overflow-hidden text-left ${
        isMentorOpenClickable ? 'cursor-pointer transition-opacity hover:opacity-85' : ''
      }`}
      role={isMentorOpenClickable ? 'button' : undefined}
      tabIndex={isMentorOpenClickable ? 0 : undefined}
      onKeyDown={(event) => {
        if (!isMentorOpenClickable) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onMentorOpenClick();
        }
      }}
    >
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

      {/* Row 2: 단계 설명 (연속 구간 중복 방지를 위해 멘티 신청 구간은 태그 생략) */}
      <div
        className={`flex min-h-11 items-center justify-between gap-2 p-2 ${color.body}`}
      >
        {isMentorPhase && (
          <span
            className={`min-w-0 truncate rounded-[3px] px-2 py-1 text-xxsmall12 font-medium tracking-[-0.3px] text-white ${color.badge}`}
          >
            {bar.challengeTitle}
          </span>
        )}
        <span className="min-w-0 truncate px-1 text-xxsmall12 font-medium tracking-[-0.3px] text-neutral-40">
          {phaseDesc}
        </span>
      </div>
    </div>
  );
};

export default LiveFeedbackOpenBar;
