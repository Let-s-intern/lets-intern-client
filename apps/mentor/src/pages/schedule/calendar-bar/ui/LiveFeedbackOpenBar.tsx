import type { PeriodBarData } from '../../types';
import { currentNow } from '../../constants/mockNow';
import PeriodBarRows, { type ProgressCount } from './PeriodBarRows';

interface LiveFeedbackOpenBarProps {
  bar: PeriodBarData;
  onMentorOpenClick?: () => void;
}

/**
 * 라이브 피드백 오픈기간 바 — 멘토 오픈 / 멘티 신청 단계.
 * - 멘토 오픈기간: Row 1 "슬롯 오픈 완료 / 미완료" · Row 2 "대기 중" (멘티 할 일 없음)
 * - 멘티 신청기간: Row 1 "대기 중" (멘토 할 일 없음) · Row 2 "신청 N / M"
 */
const LiveFeedbackOpenBar = ({
  bar,
  onMentorOpenClick,
}: LiveFeedbackOpenBarProps) => {
  const isMentorPhase = bar.barType === 'live-feedback-mentor-open';
  // 멘토 액션은 글자 크기 상향. 비액션은 기본 크기 유지.
  const typeBadge = (
    <span
      className={`whitespace-nowrap font-bold tracking-[-0.3px] ${
        isMentorPhase ? 'text-xsmall14' : 'text-xxsmall12'
      }`}
    >
      {isMentorPhase ? '라이브 일정 오픈' : '라이브 일정 신청'}
    </span>
  );

  const totalMentees =
    bar.submittedCount + bar.notSubmittedCount > 0
      ? bar.submittedCount + bar.notSubmittedCount
      : bar.submittedCount;

  let mentorProgress: ProgressCount | null;
  let menteeStatus: ProgressCount | null;
  let phaseCompleted: boolean | undefined;

  if (isMentorPhase) {
    // 멘토 오픈기간: 멘토가 슬롯을 "저장 완료"했는가가 진행도. 멘티는 대기.
    const opened = bar.completedCount > 0 ? 1 : 0;
    mentorProgress = { label: '슬롯 오픈', current: opened, target: 1 };
    menteeStatus = null;
  } else {
    // 멘티 신청기간: 멘토는 대기. 멘티가 신청한 수 / 모집.
    mentorProgress = null;
    menteeStatus = {
      label: '신청',
      current: bar.submittedCount,
      target: totalMentees,
    };
    phaseCompleted =
      (totalMentees > 0 && bar.submittedCount >= totalMentees) ||
      new Date(bar.endDate).getTime() < currentNow().getTime();
  }

  return (
    <PeriodBarRows
      colorIndex={bar.colorIndex}
      typeBadge={typeBadge}
      mentorProgress={mentorProgress}
      menteeStatus={menteeStatus}
      challengeTitle={bar.challengeTitle}
      onClick={
        isMentorPhase && onMentorOpenClick ? onMentorOpenClick : undefined
      }
      phaseCompleted={phaseCompleted}
    />
  );
};

export default LiveFeedbackOpenBar;
