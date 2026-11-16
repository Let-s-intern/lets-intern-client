'use client';

import WrittenFeedbackIcon from '@/common/icon/feedback/WrittenFeedbackIcon';
import { twMerge } from '@/lib/twMerge';
import { scheduleDesign } from '../../scheduleDesign';
import { currentNow } from '../../constants/mockNow';
import type { PeriodBarData } from '../../types';

interface WrittenFeedbackBarProps {
  bar: PeriodBarData;
  onBarClick: (challengeId: number, missionId: number) => void;
}

/** 하루의 밀리초 — D-day 계산용 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** 오늘 기준 D-day (양수=남음, 0=오늘, 음수=경과). */
function daysFromToday(iso: string): number {
  const now = currentNow();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const t = new Date(iso);
  const b = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/**
 * 서면 피드백 기간 바 — 2줄 레이아웃 (디자인 시안 image #16).
 * 1줄: [말풍선 아이콘] 서면 피드백 기간 + 챌린지명(회색)
 * 2줄: [오늘 마감 ·] 남은 피드백 N건(강조) · 완료 N / 제출 N
 */
const WrittenFeedbackBar = ({ bar, onBarClick }: WrittenFeedbackBarProps) => {
  // 분모는 피드백 작성 대상(지각 제출 제외). 미주입 바는 기존대로 제출 수를 쓴다.
  const feedbackTargetCount = bar.feedbackTargetCount ?? bar.submittedCount;
  const remaining = Math.max(feedbackTargetCount - bar.completedCount, 0);
  const isDeadlineToday = daysFromToday(bar.feedbackDeadline) === 0;

  return (
    <button
      type="button"
      onClick={() => onBarClick(bar.challengeId, bar.missionId)}
      className={twMerge(
        scheduleDesign.surface,
        'flex w-full flex-col gap-0.5 overflow-hidden px-3 py-2 text-left transition-colors hover:bg-neutral-95',
      )}
      aria-label={`서면 피드백 기간 — ${bar.challengeTitle} ${bar.th}회차`}
    >
      {/* 1줄: 아이콘 + 라벨 + 챌린지명 */}
      <div className="flex items-center gap-2">
        <WrittenFeedbackIcon size={18} className="shrink-0" />
        <span className="shrink-0 whitespace-nowrap text-xsmall14 font-semibold tracking-[-0.3px] text-neutral-10">
          {bar.th}회차 서면 피드백 기간
        </span>
        <span className="min-w-0 truncate text-xxsmall12 font-medium tracking-[-0.3px] text-neutral-30">
          {bar.challengeTitle}
        </span>
      </div>

      {/* 2줄: 보조 정보 (아이콘 너비만큼 들여쓰기) */}
      <div className="pl-[26px] text-xxsmall12 tracking-[-0.3px] text-neutral-40">
        {isDeadlineToday && <span>오늘 마감 · </span>}
        <span className="font-medium text-primary">
          남은 피드백 {remaining}건
        </span>
        {` · 완료 ${bar.completedCount} / 제출 ${feedbackTargetCount}`}
      </div>
    </button>
  );
};

export default WrittenFeedbackBar;
