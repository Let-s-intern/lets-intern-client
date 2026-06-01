'use client';

import LiveFeedbackOpenIcon from '@/common/icon/feedback/LiveFeedbackOpenIcon';
import type { PeriodBarData } from '../../types';
import { currentNow } from '../../constants/mockNow';

interface LiveFeedbackOpenBarProps {
  bar: PeriodBarData;
  onMentorOpenClick?: () => void;
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
 * 라이브 피드백 일정 오픈 바 — 2줄 레이아웃 (디자인 시안 image #17).
 * 1줄: [캘린더 아이콘] LIVE 피드백 일정 오픈 + 챌린지명(회색)
 * 2줄: D-N · 예약 가능 멘티 N
 *
 * ⚠️ "예약 가능 멘티" 전용 BE 필드가 없어 notSubmittedCount(미예약 멘티 수)로 임시 표기.
 * 멘토 화이트리스트(`live-feedback-mentor-open`) 한정.
 */
const LiveFeedbackOpenBar = ({
  bar,
  onMentorOpenClick,
}: LiveFeedbackOpenBarProps) => {
  const isMentorPhase = bar.barType === 'live-feedback-mentor-open';
  const interactive = isMentorPhase && !!onMentorOpenClick;
  const Tag = interactive ? 'button' : 'div';

  const dday = daysFromToday(bar.feedbackStartDate);
  const ddayLabel = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-DAY' : '진행 중';

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={interactive ? onMentorOpenClick : undefined}
      className={`border-neutral-80 flex w-full flex-col gap-0.5 overflow-hidden rounded border bg-white px-3 py-2 text-left ${
        interactive ? 'hover:bg-neutral-95 transition-colors' : ''
      }`}
      aria-label={`라이브 피드백 일정 오픈 — ${bar.challengeTitle}`}
    >
      {/* 1줄: 아이콘 + 라벨 + 챌린지명 */}
      <div className="flex items-center gap-2">
        <LiveFeedbackOpenIcon size={18} className="shrink-0" />
        <span className="text-xsmall14 text-neutral-10 shrink-0 whitespace-nowrap font-semibold tracking-[-0.3px]">
          <span className="text-red-500">LIVE</span> 피드백 일정 오픈
        </span>
        <span className="text-xxsmall12 text-neutral-30 min-w-0 truncate font-medium tracking-[-0.3px]">
          {bar.challengeTitle}
        </span>
      </div>

      {/* 2줄: 보조 정보 (아이콘 너비만큼 들여쓰기) */}
      <div className="text-xxsmall12 text-neutral-40 pl-[26px] tracking-[-0.3px]">
        {ddayLabel} · 예약 가능 멘티 {bar.notSubmittedCount}
      </div>
    </Tag>
  );
};

export default LiveFeedbackOpenBar;
