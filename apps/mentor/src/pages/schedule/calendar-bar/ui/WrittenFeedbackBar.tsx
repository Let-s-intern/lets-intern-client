'use client';

import WrittenFeedbackIcon from '@/common/icon/feedback/WrittenFeedbackIcon';
import { currentNow } from '../../constants/mockNow';
import type { PeriodBarData } from '../../types';

interface WrittenFeedbackBarProps {
  bar: PeriodBarData;
  onBarClick: (challengeId: number, missionId: number) => void;
}

/**
 * 서면 피드백 기간 바 (PRD-0503 #3 디자인 갱신).
 *
 * 디자인 참조: `.claude/tasks/서면 피드백 일정.png`
 * - 흰 배경 + 옅은 회색 테두리 + 둥근 모서리
 * - 좌측: 그린 톤 말풍선(채팅) 아이콘
 * - "서면 피드백 기간" 라벨
 * - 완료 상태일 때만 옅은 배경의 "완료" 배지 노출
 * - 우측: 챌린지 제목 (예: "포트폴리오 챌린지 n기") + chevron-right
 */
const WrittenFeedbackBar = ({ bar, onBarClick }: WrittenFeedbackBarProps) => {
  const totalMentees = bar.submittedCount + bar.notSubmittedCount;
  const isPast = new Date(bar.endDate).getTime() < currentNow().getTime();
  // 멘토 액션 완료 = 모든 제출자에게 피드백 작성, 또는 (제출자 0 + 기간 경과)
  const allFeedbackDone =
    bar.submittedCount > 0 && bar.completedCount >= bar.submittedCount;
  const isCompleted = allFeedbackDone || (bar.submittedCount === 0 && isPast);

  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-sm border border-neutral-80 bg-white px-3 text-left transition-colors hover:bg-neutral-95"
      aria-label={`서면 피드백 기간 — ${bar.challengeTitle} ${bar.th}회차${
        isCompleted ? ' (완료)' : ''
      } (총 ${totalMentees}명)`}
    >
      {/* 좌측: 말풍선 아이콘 */}
      <WrittenFeedbackIcon size={18} className="shrink-0" />

      {/* 라벨 */}
      <span className="text-xsmall14 shrink-0 whitespace-nowrap font-semibold tracking-[-0.3px] text-neutral-10">
        서면 피드백 기간
      </span>

      {/* 완료 배지 */}
      {isCompleted && (
        <span className="shrink-0 whitespace-nowrap rounded bg-neutral-95 px-1.5 py-0.5 text-[11px] font-medium tracking-[-0.3px] text-neutral-40">
          완료
        </span>
      )}

      {/* 가운데 spacer */}
      <span className="flex-1" />

      {/* 우측: 챌린지명 (포트폴리오 챌린지 n기) */}
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
    </button>
  );
};

export default WrittenFeedbackBar;
