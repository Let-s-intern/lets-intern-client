import { twMerge } from '@/lib/twMerge';
import { scheduleDesign } from '../../scheduleDesign';
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
        <div className="bg-neutral-80 h-full w-0.5" />
        <div className="bg-neutral-80 h-0.5 flex-1" />
        <div className="bg-neutral-80 h-full w-0.5" />
      </div>

      {/* Row 4: 챌린지 배지 + 멘티 이름 */}
      <div className="bg-neutral-95 flex flex-col gap-1 p-2">
        <span className="text-xxsmall12 bg-neutral-30 shrink-0 whitespace-nowrap rounded-[3px] px-2 py-1 font-medium tracking-[-0.3px] text-white">
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
 * 시간별 일정(하단) 안에서 시간순으로 쌓이는 라이브 피드백 블록.
 * 콘텐츠 높이에 맞춰 자연스럽게 늘어난다 (절대배치 아님).
 */
type BadgeStatus = NonNullable<LiveFeedbackInfo['status']>;

/**
 * 상태별 태그 스타일 — 종료 상태(완료/미참여)는 dim 처리, 진행 상태(진행중/지각)는 강조.
 *
 * 디자인(이미지 #1): 솔리드 배지를 연한 톤(소프트) 배지로 정렬.
 *  - 진행 중   : 연파랑 배경 / 파랑 글씨
 *  - 진행 완료 : 회색 배경 / 회색 글씨
 *  - 미참여·지각(종료 상태): 회색 배경 / 회색 글씨
 * ⚠️ 라벨 텍스트·상태 매핑은 기존 그대로 유지하고 색/배경만 정렬한다(확정은 추후 기획).
 */
const STATUS_BADGE: Record<
  Exclude<BadgeStatus, 'waiting'>,
  { label: string; badge: string }
> = {
  'in-progress': { label: '진행 중', badge: scheduleDesign.cardBadgeActive },
  completed: {
    label: '진행 완료',
    badge: scheduleDesign.cardBadgeDone,
  },
  // '취소'(cancelled)는 라이브 세션 상태에서 제외 — 예약 취소는 별도 도메인.
  'mentor-absent': {
    label: '멘토 미참여',
    badge: scheduleDesign.cardBadgeDone,
  },
  'mentee-absent': {
    label: '멘티 미참여',
    badge: scheduleDesign.cardBadgeDone,
  },
  'mentor-late': {
    label: '멘토 지각',
    badge: scheduleDesign.cardBadgeDone,
  },
  'mentee-late': {
    label: '멘티 지각',
    badge: scheduleDesign.cardBadgeDone,
  },
};

/**
 * 시간별 일정(하단) 안에서 시간순으로 쌓이는 라이브 피드백 개별 카드.
 *
 * 디자인 시안 image #19:
 * - 카드: 흰 배경 + 옅은 회색 테두리 + 둥근(4px) 모서리
 * - 1줄: 시작시간(크게 굵게) + 상태 배지(진행 완료=회색 아웃라인 등)
 * - 2줄: ▶(빨강 비디오 아이콘) LIVE 피드백(굵은 검정)
 * - 멘티명, 챌린지명(회색)
 * - 우하단: ⋮ (케밥)
 */
export const LiveFeedbackTimeBlock = ({ bar }: { bar: PeriodBarData }) => {
  const lf = bar.liveFeedback!;
  const badge =
    lf.status && lf.status !== 'waiting' ? STATUS_BADGE[lf.status] : null;

  return (
    <div
      className={twMerge(
        scheduleDesign.surface,
        'flex h-full w-full flex-col gap-1.5 overflow-hidden px-2.5 py-2',
      )}
    >
      {/* Row 1: 시작 시간 + 상태 배지 */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-neutral-10 shrink-0 text-sm font-bold leading-none">
          {lf.startTime}
        </span>
        {badge && (
          <span
            className={twMerge(
              'shrink-0 whitespace-nowrap',
              scheduleDesign.cardBadge,
              badge.badge,
            )}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Row 2: ▶ LIVE 피드백 (빨강 비디오 아이콘 + 검정 라벨) */}
      <div className="flex min-w-0 items-center gap-1.5">
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          className="shrink-0"
          aria-hidden
        >
          <rect
            x="2"
            y="4.5"
            width="16"
            height="11"
            rx="3"
            stroke="#f64e39"
            strokeWidth="1.4"
          />
          <path d="M8.5 7.5L12.5 10L8.5 12.5V7.5Z" fill="#f64e39" />
        </svg>
        <span className="text-xxsmall12 text-neutral-10 shrink-0 font-bold leading-none">
          LIVE 피드백
        </span>
      </div>

      {/* Row 3: 멘티명 */}
      <span className="text-xxsmall12 text-neutral-40 min-w-0 truncate leading-tight">
        {lf.menteeName} 멘티
      </span>

      {/* Row 4: 챌린지명 */}
      <span className="text-xxsmall12 text-neutral-40 min-w-0 truncate leading-tight">
        {bar.challengeTitle}
      </span>

      {/* ⋮ 케밥 (우하단) */}
      <div className="mt-auto flex justify-end">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-neutral-40 shrink-0"
          aria-hidden
        >
          <circle cx="12" cy="5" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="12" cy="19" r="1.7" />
        </svg>
      </div>
    </div>
  );
};

export default LiveFeedbackCard;
