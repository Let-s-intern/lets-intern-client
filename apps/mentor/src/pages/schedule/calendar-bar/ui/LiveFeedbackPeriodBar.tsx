import type { PeriodBarData } from '../../types';
import { currentNow } from '../../constants/mockNow';
import PeriodBarRows from './PeriodBarRows';

interface LiveFeedbackPeriodBarProps {
  bar: PeriodBarData;
  onClick?: (bar: PeriodBarData) => void;
}

/**
 * 라이브 피드백 기간 바.
 * - Row 1: [LIVE] [ N회차 라이브 ] · 멘토 세션 진행도
 * - Row 2: 챌린지 배지 · 멘티 예약 현황
 */
const LiveFeedbackPeriodBar = ({
  bar,
  onClick,
}: LiveFeedbackPeriodBarProps) => {
  const totalMentees = bar.submittedCount + bar.notSubmittedCount;
  const menteeTarget = totalMentees > 0 ? totalMentees : bar.submittedCount;
  const isPast = new Date(bar.endDate).getTime() < currentNow().getTime();
  // 예약자 없음 + 기간 경과 → 완료 처리
  const phaseCompleted = bar.submittedCount === 0 && isPast;

  return (
    <PeriodBarRows
      colorIndex={bar.colorIndex}
      typeBadge={
        <>
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" />
          <span className="text-xsmall14 font-bold">LIVE</span>
          <span className="text-xsmall14 ml-0.5 whitespace-nowrap font-semibold tracking-[-0.3px]">
            [ {bar.th}회차 라이브 ]
          </span>
        </>
      }
      mentorProgress={{
        label: '세션 완료',
        current: bar.completedCount,
        target: bar.submittedCount,
      }}
      menteeStatus={{
        label: '예약',
        current: bar.submittedCount,
        target: menteeTarget,
      }}
      challengeTitle={bar.challengeTitle}
      onClick={onClick ? () => onClick(bar) : undefined}
      phaseCompleted={phaseCompleted}
    />
  );
};

export default LiveFeedbackPeriodBar;
