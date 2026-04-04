'use client';

import { getColor } from '../../constants/colors';
import {
  computeSegmentPercents,
} from '../../constants/scheduleConfig';
import { WRITTEN_FEEDBACK_CONFIG } from '../../challenge-content/writtenFeedback';
import type { PeriodBarData } from '../../types';

interface ChallengePeriodBarProps {
  bar: PeriodBarData;
  colSpan: number;
  missionColSpan: number;
  style?: React.CSSProperties;
  onBarClick: (challengeId: number, missionId: number) => void;
}

const ChallengePeriodBar = ({
  bar,
  colSpan,
  missionColSpan: _missionColSpan,
  style,
  onBarClick,
}: ChallengePeriodBarProps) => {
  const color = getColor(bar.colorIndex ?? 0);
  const config = WRITTEN_FEEDBACK_CONFIG;
  const segmentPercents = computeSegmentPercents(
    config,
    colSpan,
    bar.startDate,
    bar.endDate,
  );

  // 액션 구간 앞의 비액션 구간 합산 (빈 공간 비율)
  const preActionPercent = segmentPercents
    .filter(({ segment }) => !segment.isActionSegment)
    .reduce((sum, { percent }) => sum + percent, 0);

  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      style={style}
      className="relative z-10 flex w-full flex-col overflow-hidden text-left transition-opacity hover:opacity-80"
    >
      {/* 1행: 액션 구간 위치에 회차+카운트+라인 */}
      <div className="flex h-6 min-w-0 items-center overflow-hidden">
        <div style={{ width: `${preActionPercent}%` }} />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex shrink-0 items-center">
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
              [ {bar.th}회차 ]
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px]">
            <span className="text-[#f64e39]">시작 전</span>
            <span className="text-[#f64e39]">{bar.waitingCount}</span>
            <span className="text-neutral-10">·</span>
            <span className="text-neutral-10">진행 중</span>
            <span className="text-neutral-10">{bar.inProgressCount}</span>
            <span className="text-neutral-10">·</span>
            <span className="text-neutral-10">완료</span>
            <span className="text-neutral-10">{bar.completedCount}</span>
          </div>
          <div
            className={`flex h-3 min-w-0 flex-1 items-center border-r-2 ${color.border}`}
          >
            <div className={`h-0.5 w-full ${color.line}`} />
          </div>
        </div>
      </div>

      {/* 2행: 구간별 카드 */}
      <div className="relative z-10 flex min-w-0 overflow-hidden">
        {segmentPercents.map(({ segment, percent }) => {
          if (segment.isActionSegment) {
            // 멘토 액션 구간 (진하게) — 챌린지 태그 + 카운트
            return (
              <div
                key={segment.id}
                className={`flex min-w-0 items-center justify-between ${segment.showBorder ? 'border-l border-r border-neutral-80' : ''} p-2 ${color.body}`}
                style={{ width: `${percent}%` }}
              >
                <span
                  className={`min-w-0 truncate rounded-[3px] px-2 py-1 text-xxsmall12 font-medium tracking-[-0.3px] text-white ${color.badge}`}
                >
                  {bar.challengeTitle}
                </span>
                <div className="flex shrink-0 items-center gap-1 whitespace-nowrap px-1 text-xxsmall12 font-medium tracking-[-0.3px]">
                  <span className="text-neutral-40">미제출</span>
                  <span className="text-neutral-40">{bar.notSubmittedCount}</span>
                  <span className="text-neutral-10">·</span>
                  <span className="text-neutral-10">제출</span>
                  <span className="text-neutral-10">{bar.submittedCount}</span>
                </div>
              </div>
            );
          }
          // 보조 구간 (연하게) — 라벨만
          return (
            <div
              key={segment.id}
              className={`flex min-w-0 items-center justify-center ${segment.showBorder ? 'border-l border-r border-neutral-80' : ''} px-1 py-2 ${color.bodyLight}`}
              style={{ width: `${percent}%` }}
            >
              <span className={`truncate whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px] ${color.text}`}>
                {segment.label}
              </span>
            </div>
          );
        })}
      </div>
    </button>
  );
};

export default ChallengePeriodBar;
