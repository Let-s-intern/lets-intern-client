import type { PeriodBarData } from '../../types';
import { currentNow } from '../../constants/mockNow';
import PeriodBarRows, { type ProgressCount } from './PeriodBarRows';

interface WrittenPhaseBarProps {
  bar: PeriodBarData;
  onClick?: (bar: PeriodBarData) => void;
}

function isPastEnd(endDate: string): boolean {
  return new Date(endDate).getTime() < currentNow().getTime();
}

/**
 * 서면 피드백 보조 단계 바 — 유저 제출기간 / 운영진 검수기간.
 * 둘 다 멘토 대기(비액션) → compact 단일 행, 챌린지 색.
 * 단계 완료 시 ✓ 아이콘 표시:
 *   - 유저 제출: 전원 제출 또는 기간 경과
 *   - 검수기간: 기간 경과
 */
const WrittenPhaseBar = ({ bar, onClick }: WrittenPhaseBarProps) => {
  const isReview = bar.barType === 'written-review';
  const totalMentees = bar.submittedCount + bar.notSubmittedCount;

  const typeBadge = (
    <span className="text-xxsmall12 whitespace-nowrap font-bold tracking-[-0.3px]">
      {isReview ? '운영진 검수기간' : '유저 제출기간'}
    </span>
  );

  let menteeStatus: ProgressCount | null;
  let phaseCompleted: boolean;

  if (isReview) {
    menteeStatus = null;
    phaseCompleted = isPastEnd(bar.endDate);
  } else {
    menteeStatus = {
      label: '제출',
      current: bar.submittedCount,
      target: totalMentees,
    };
    phaseCompleted =
      (totalMentees > 0 && bar.submittedCount >= totalMentees) ||
      isPastEnd(bar.endDate);
  }

  return (
    <PeriodBarRows
      typeBadge={typeBadge}
      mentorProgress={null}
      menteeStatus={menteeStatus}
      challengeTitle={bar.challengeTitle}
      onClick={onClick ? () => onClick(bar) : undefined}
      phaseCompleted={phaseCompleted}
    />
  );
};

export default WrittenPhaseBar;
