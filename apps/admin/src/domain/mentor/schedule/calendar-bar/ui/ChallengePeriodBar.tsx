import { getColor } from '../../constants/colors';
import {
  computeSegmentColSpans,
  type BarSegment,
} from '../../constants/scheduleConfig';
import { WRITTEN_FEEDBACK_CONFIG } from '../../challenge-content/writtenFeedback';
import type { PeriodBarData } from '@/types';

/**
 * 보조 구간 배경색: 액션에 가까울수록 연하게, 멀수록 진하게
 * 멀(bodyMid) → 가까움(bodyLight) → [액션(body)] → 가까움(bodyLight) → 멀(bodyMid)
 */
function segmentBg(
  segment: BarSegment,
  allSegments: { segment: BarSegment; cols: number }[],
  color: ReturnType<typeof getColor>,
) {
  const actionIdx = allSegments.findIndex((s) => s.segment.isActionSegment);
  const myIdx = allSegments.findIndex((s) => s.segment.id === segment.id);
  const distFromAction = Math.abs(myIdx - actionIdx);
  // 거리 1 = 바로 옆 = bodyLight, 거리 2+ = bodyMid
  return distFromAction <= 1 ? color.bodyLight : color.bodyMid;
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
  const color = getColor(bar.colorIndex ?? 0);
  const segmentColSpans = computeSegmentColSpans(
    WRITTEN_FEEDBACK_CONFIG,
    bar.startDate,
    bar.endDate,
  );

  // 구간별 grid 칸 → "Nfr Mfr ..." 형태의 grid-template-columns
  const gridCols = segmentColSpans.map(({ cols }) => `${cols}fr`).join(' ');

  // 액션 구간 앞 칸 수 / 액션 구간 칸 수
  const preActionCols = segmentColSpans
    .filter(({ segment }) => !segment.isActionSegment)
    .reduce((sum, { cols }) => sum + cols, 0);
  const actionCols = segmentColSpans
    .filter(({ segment }) => segment.isActionSegment)
    .reduce((sum, { cols }) => sum + cols, 0);

  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      style={style}
      className="relative z-10 flex w-full flex-col overflow-hidden text-left transition-opacity hover:opacity-80"
    >
      {/* 1행: 액션 구간 위치에 회차+카운트+라인 */}
      <div
        className="h-6 min-w-0 items-center overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `${preActionCols}fr ${actionCols}fr`,
        }}
      >
        <div />
        <div className="flex min-w-0 items-center gap-2">
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

      {/* 2행: 구간별 카드 — 동일한 grid로 날짜 칸에 정확히 맞춤 */}
      <div
        className="relative min-w-0 overflow-hidden"
        style={{ display: 'grid', gridTemplateColumns: gridCols }}
      >
        {segmentColSpans.map(({ segment }) => {
          if (segment.isActionSegment) {
            return (
              <div
                key={segment.id}
                className={`flex min-w-0 items-center justify-between p-2 ${color.body}`}
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
          return (
            <div
              key={segment.id}
              className={`flex min-w-0 items-center justify-center px-1 py-2 ${segmentBg(segment, segmentColSpans, color)}`}
            >
              <span
                className={`truncate whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px] ${color.text}`}
              >
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
