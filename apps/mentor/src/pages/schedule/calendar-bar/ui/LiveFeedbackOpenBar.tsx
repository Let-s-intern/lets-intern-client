'use client';

import type { PeriodBarData } from '../../types';
import { currentNow } from '../../constants/mockNow';

interface LiveFeedbackOpenBarProps {
  bar: PeriodBarData;
  onMentorOpenClick?: () => void;
}

/**
 * 라이브 피드백 일정 오픈 바 (PRD-0503 #3 디자인 갱신).
 *
 * 디자인 참조: `.claude/tasks/라이브 피드백 일정 오픈.png`
 * - 흰 배경 + 옅은 회색 테두리 + 둥근 모서리
 * - 좌측: 캘린더 아이콘 (블루 톤)
 * - "LIVE 피드백 일정 오픈" — LIVE 빨강 강조
 * - 완료 상태일 때 옅은 회색 "완료" 배지
 * - 우측: 챌린지명 + chevron-right
 *
 * 멘토 화이트리스트(`live-feedback-mentor-open`) 한정. 멘티 신청은 이 바를 사용하지 않는다.
 */
const LiveFeedbackOpenBar = ({
  bar,
  onMentorOpenClick,
}: LiveFeedbackOpenBarProps) => {
  const isMentorPhase = bar.barType === 'live-feedback-mentor-open';
  // 멘토 오픈기간 완료 = 멘토가 슬롯을 1개 이상 저장(`completedCount > 0`) 또는 기간 경과
  const isPast = new Date(bar.endDate).getTime() < currentNow().getTime();
  const isCompleted = isMentorPhase
    ? bar.completedCount > 0 || isPast
    : (bar.submittedCount > 0 &&
        bar.submittedCount >= bar.submittedCount + bar.notSubmittedCount) ||
      isPast;

  const interactive = isMentorPhase && onMentorOpenClick;
  const Tag = interactive ? 'button' : 'div';

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={interactive ? onMentorOpenClick : undefined}
      className={`flex h-9 w-full items-center gap-2 overflow-hidden rounded-lg border border-neutral-80 bg-white px-3 text-left ${
        interactive ? 'transition-colors hover:bg-neutral-95' : ''
      }`}
      aria-label={`라이브 피드백 일정 오픈 — ${bar.challengeTitle}${
        isCompleted ? ' (완료)' : ''
      }`}
    >
      {/* 좌측: 캘린더 아이콘 */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0 text-blue-500"
        aria-hidden
      >
        <rect
          x="3.5"
          y="5"
          width="17"
          height="15"
          rx="2"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M8 3v4M16 3v4M3.5 10h17"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>

      {/* 라벨: LIVE(빨강) + " 피드백 일정 오픈" */}
      <span className="text-xsmall14 shrink-0 whitespace-nowrap font-semibold tracking-[-0.3px] text-neutral-10">
        <span className="text-red-500">LIVE</span> 피드백 일정 오픈
      </span>

      {/* 완료 배지 */}
      {isCompleted && (
        <span className="shrink-0 whitespace-nowrap rounded bg-neutral-95 px-1.5 py-0.5 text-[11px] font-medium tracking-[-0.3px] text-neutral-40">
          완료
        </span>
      )}

      <span className="flex-1" />

      {/* 우측: 챌린지명 */}
      <span className="text-xxsmall12 min-w-0 truncate font-medium tracking-[-0.3px] text-neutral-30">
        {bar.challengeTitle}
      </span>

      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0 text-neutral-40"
        aria-hidden
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Tag>
  );
};

export default LiveFeedbackOpenBar;
