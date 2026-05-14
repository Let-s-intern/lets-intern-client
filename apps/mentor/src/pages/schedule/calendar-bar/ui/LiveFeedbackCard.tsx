import LiveFeedbackIcon from '@/common/icon/feedback/LiveFeedbackIcon';
import type { LiveFeedbackInfo, PeriodBarData } from '../../types';

/** "09:00" → "09:00", "18:30" → "18:30" */
function formatTimeRange(start: string, end: string): string {
  return `${start} ~ ${end}`;
}

/**
 * 캘린더 상단 태그 영역에 쓰이는 라이브 피드백 카드 (단일 날짜용).
 *
 * PRD-0503 #4: 챌린지별 색상 구분 제거 — 중성 톤 보더/배경으로 통일.
 */
const LiveFeedbackCard = ({ bar }: { bar: PeriodBarData }) => {
  const lf = bar.liveFeedback!;

  return (
    <div className="flex w-full flex-col overflow-hidden text-left">
      {/* Row 1: LIVE 인디케이터 + N회차 */}
      <div className="flex h-6 items-center gap-1.5 overflow-hidden">
        <span className="flex shrink-0 items-center gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-xxsmall12 font-bold text-red-500">LIVE</span>
        </span>
        <span className="text-xxsmall12 text-neutral-10 whitespace-nowrap font-medium tracking-[-0.3px]">
          [ {bar.th}회차 ]
        </span>
      </div>

      {/* Row 2: 오전 9시 ~ 9시 30분 */}
      <div className="text-xxsmall12 text-neutral-40 flex items-center whitespace-nowrap font-medium tracking-[-0.3px]">
        {formatTimeRange(lf.startTime, lf.endTime)}
      </div>

      {/* Row 3: 구분선 */}
      <div className="flex h-3 items-center">
        <div className="h-full w-0.5 bg-neutral-80" />
        <div className="h-0.5 flex-1 bg-neutral-80" />
        <div className="h-full w-0.5 bg-neutral-80" />
      </div>

      {/* Row 4: 챌린지 배지 + 멘티 이름 */}
      <div className="flex flex-col gap-1 bg-neutral-95 p-2">
        <span className="text-xxsmall12 shrink-0 whitespace-nowrap rounded-[3px] bg-neutral-30 px-2 py-1 font-medium tracking-[-0.3px] text-white">
          {bar.challengeTitle}
        </span>
        <div className="text-xxsmall12 flex items-center gap-1 whitespace-nowrap font-medium tracking-[-0.3px]">
          <span className="text-neutral-40">멘티</span>
          <span className="text-neutral-10">{lf.menteeName}님</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 시간별 일정(하단 time grid) 안에 절대 위치로 배치되는 라이브 피드백 블록.
 * 부모의 top/height(세션 시간 길이)에 맞춰 h-full/w-full로 채워진다.
 */
type BadgeStatus = NonNullable<LiveFeedbackInfo['status']>;

/**
 * 상태별 태그 스타일 — 종료 상태(완료/미참여)는 dim 처리, 진행 상태(진행중/지각)는 강조.
 */
const STATUS_BADGE: Record<
  Exclude<BadgeStatus, 'waiting'>,
  { label: string; badge: string; dim: boolean }
> = {
  'in-progress': {
    label: '진행중',
    badge: 'bg-red-500 text-white',
    dim: false,
  },
  completed: { label: '완료', badge: 'bg-green-500 text-white', dim: true },
  'mentor-absent': {
    label: '멘토 미참여',
    badge: 'bg-neutral-60 text-white',
    dim: true,
  },
  'mentee-absent': {
    label: '멘티 미참여',
    badge: 'bg-neutral-60 text-white',
    dim: true,
  },
  'mentor-late': {
    label: '멘토 지각',
    badge: 'bg-neutral-60 text-white',
    dim: true,
  },
  'mentee-late': {
    label: '멘티 지각',
    badge: 'bg-neutral-60 text-white',
    dim: true,
  },
};

/**
 * 시간별 일정(time grid) 안에 절대 위치로 배치되는 라이브 피드백 블록.
 *
 * 디자인 참조: `.claude/tasks/라이브피드백.png` (PRD-0503 #3)
 * - 카드: 흰 배경 + 옅은 회색 테두리 + 둥근 모서리
 * - 상단: 시작시간(HH:MM) + 상태 배지 (진행중 등)
 * - 본문: ▶ LIVE 피드백 (LIVE 빨강 강조)
 * - 멘티명, 챌린지명
 */
export const LiveFeedbackTimeBlock = ({ bar }: { bar: PeriodBarData }) => {
  const lf = bar.liveFeedback!;
  const badge =
    lf.status && lf.status !== 'waiting' ? STATUS_BADGE[lf.status] : null;
  const isDim = badge?.dim ?? false;

  return (
    <div
      className={`flex h-full w-full flex-col gap-1 overflow-hidden rounded-sm border border-neutral-80 px-2 py-1.5 ${
        isDim ? 'bg-neutral-95' : 'bg-white'
      }`}
    >
      {/* Row 1: 아이콘 + 시작 시간 + 상태 배지 (진행중 등) */}
      <div className="flex min-w-0 items-center gap-1.5">
        <LiveFeedbackIcon size={14} className="shrink-0" />
        <span
          className={`text-xxsmall12 shrink-0 font-bold leading-none ${
            isDim ? 'text-neutral-40' : 'text-neutral-10'
          }`}
        >
          {lf.startTime}
        </span>
        {badge && (
          <span
            className={`shrink-0 whitespace-nowrap rounded-[3px] px-1 py-0.5 text-[10px] font-bold leading-none ${badge.badge}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Row 2: ▶ LIVE 피드백 */}
      <div className="flex min-w-0 items-center gap-1">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="shrink-0 text-red-500"
          aria-hidden
        >
          <path d="M3 2.5L9.5 6L3 9.5V2.5Z" fill="currentColor" />
        </svg>
        <span className="text-xxsmall12 shrink-0 font-bold leading-none text-red-500">
          LIVE
        </span>
        <span
          className={`text-xxsmall12 shrink-0 font-semibold leading-none ${
            isDim ? 'text-neutral-40' : 'text-neutral-10'
          }`}
        >
          피드백
        </span>
      </div>

      {/* Row 3: 멘티명 */}
      <span
        className={`text-xxsmall12 min-w-0 truncate font-medium leading-tight ${
          isDim ? 'text-neutral-40' : 'text-neutral-10'
        }`}
      >
        {lf.menteeName} 멘티
      </span>

      {/* Row 4: 챌린지명 */}
      <span className="text-xxsmall12 text-neutral-40 min-w-0 truncate leading-tight">
        {bar.challengeTitle}
      </span>

      {/* chevron */}
      <div className="mt-auto flex justify-end">
        <svg
          width="12"
          height="12"
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
      </div>
    </div>
  );
};

export default LiveFeedbackCard;
