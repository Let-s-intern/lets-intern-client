'use client';

import { useId, type CSSProperties } from 'react';

import { currentNow } from '../../constants/mockNow';
import type { PeriodBarData } from '../../types';
import PeriodBarRows from './PeriodBarRows';

interface ChallengePeriodBarProps {
  bar: PeriodBarData;
  style?: CSSProperties;
  onBarClick: (challengeId: number, missionId: number) => void;
}

/**
 * 서면 피드백 "피드백 제출기간" 바 — 멘토 액션.
 * 타입 배지 앞에 반쪽 잘린 문서 아이콘 + 큰 글자 적용.
 */
const ChallengePeriodBar = ({
  bar,
  style,
  onBarClick,
}: ChallengePeriodBarProps) => {
  const totalMentees = bar.submittedCount + bar.notSubmittedCount;
  const clipId = useId();
  const isPast = new Date(bar.endDate).getTime() < currentNow().getTime();
  // 멘티 제출 없음 + 기간 경과 → 할 일 없이 끝난 회차로 완료 처리
  const phaseCompleted = bar.submittedCount === 0 && isPast;

  return (
    <div style={style}>
      <PeriodBarRows
        colorIndex={bar.colorIndex}
        typeBadge={
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
            >
              <g clipPath={`url(#${clipId})`}>
                <path
                  d="M7 4H17C17.5523 4 18 4.44772 18 5V19C18 19.5523 17.5523 20 17 20H7C6.44772 20 6 19.5523 6 19V5C6 4.44772 6.44772 4 7 4Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M9.5 8.5H14.5M9.5 12H14.5M9.5 15.5H12.5"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </g>
              <defs>
                <clipPath id={clipId}>
                  <rect x="3" y="2" width="18" height="16" rx="0" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="whitespace-nowrap text-xsmall14 font-semibold tracking-[-0.3px]">
              [ {bar.th}회차 서면 ]
            </span>
          </>
        }
        mentorProgress={{
          label: '피드백 작성',
          current: bar.completedCount,
          target: bar.submittedCount,
        }}
        menteeStatus={{
          label: '제출',
          current: bar.submittedCount,
          target: totalMentees,
        }}
        challengeTitle={bar.challengeTitle}
        onClick={() => onBarClick(bar.challengeId, bar.missionId)}
        phaseCompleted={phaseCompleted}
      />
    </div>
  );
};

export default ChallengePeriodBar;
