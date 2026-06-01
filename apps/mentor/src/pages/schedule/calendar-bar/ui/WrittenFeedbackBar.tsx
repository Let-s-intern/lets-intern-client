'use client';

import WrittenFeedbackIcon from '@/common/icon/feedback/WrittenFeedbackIcon';
import { currentNow } from '../../constants/mockNow';
import type { PeriodBarData } from '../../types';

interface WrittenFeedbackBarProps {
  bar: PeriodBarData;
  onBarClick: (challengeId: number, missionId: number) => void;
}

/** 오늘 기준 D-day (양수=남음, 0=오늘, 음수=경과). */
function daysFromToday(iso: string): number {
  const now = currentNow();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const t = new Date(iso);
  const b = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/**
 * 서면 피드백 기간 바 — 2줄 레이아웃 (디자인 시안 image #16).
 * 1줄: [말풍선 아이콘] 서면 피드백 기간 + 챌린지명(회색)
 * 2줄: [오늘 마감 ·] 남은 피드백 N건(강조) · 완료 N / 제출 N
 */
const WrittenFeedbackBar = ({ bar, onBarClick }: WrittenFeedbackBarProps) => {
  const remaining = Math.max(bar.submittedCount - bar.completedCount, 0);
  const isDeadlineToday = daysFromToday(bar.feedbackDeadline) === 0;

  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      className="border-neutral-80 hover:bg-neutral-95 flex w-full flex-col gap-0.5 overflow-hidden rounded border bg-white px-3 py-2 text-left transition-colors"
      aria-label={`서면 피드백 기간 — ${bar.challengeTitle} ${bar.th}회차`}
    >
      {/* 1줄: 아이콘 + 라벨 + 챌린지명 */}
      <div className="flex items-center gap-2">
        <WrittenFeedbackIcon size={18} className="shrink-0" />
        <span className="text-xsmall14 text-neutral-10 shrink-0 whitespace-nowrap font-semibold tracking-[-0.3px]">
          서면 피드백 기간
        </span>
        <span className="text-xxsmall12 text-neutral-30 min-w-0 truncate font-medium tracking-[-0.3px]">
          {bar.challengeTitle}
        </span>
      </div>

      {/* 2줄: 보조 정보 (아이콘 너비만큼 들여쓰기) */}
      <div className="text-xxsmall12 text-neutral-40 pl-[26px] tracking-[-0.3px]">
        {isDeadlineToday && <span>오늘 마감 · </span>}
        <span className="text-primary font-medium">남은 피드백 {remaining}건</span>
        {` · 완료 ${bar.completedCount} / 제출 ${bar.submittedCount}`}
      </div>
    </button>
  );
};

export default WrittenFeedbackBar;
