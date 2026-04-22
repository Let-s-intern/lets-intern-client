'use client';

import { getColor } from '../../constants/colors';
import type { PeriodBarData } from '../../types';

/** "09:00" → "09:00", "18:30" → "18:30" */
function formatTimeRange(start: string, end: string): string {
  return `${start} ~ ${end}`;
}

/**
 * 캘린더 상단 태그 영역에 쓰이는 라이브 피드백 카드 (단일 날짜용).
 *
 * TODO: 클릭 시 라이브 피드백 상세 모달 연결 (API 연동 후 구현)
 */
const LiveFeedbackCard = ({ bar }: { bar: PeriodBarData }) => {
  const lf = bar.liveFeedback!;
  const color = getColor(bar.colorIndex ?? 0);

  return (
    <div className="flex w-full flex-col overflow-hidden text-left">
      {/* Row 1: LIVE 인디케이터 + N회차 */}
      <div className="flex h-6 items-center gap-1.5 overflow-hidden">
        <span className="flex shrink-0 items-center gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-xxsmall12 font-bold text-red-500">LIVE</span>
        </span>
        <span className="whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px] text-neutral-10">
          [ {bar.th}회차 ]
        </span>
      </div>

      {/* Row 2: 오전 9시 ~ 9시 30분 */}
      <div className="flex items-center whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px] text-neutral-40">
        {formatTimeRange(lf.startTime, lf.endTime)}
      </div>

      {/* Row 3: 구분선 */}
      <div className="flex h-3 items-center">
        <div className={`h-full w-0.5 ${color.line}`} />
        <div className={`h-0.5 flex-1 ${color.line}`} />
        <div className={`h-full w-0.5 ${color.line}`} />
      </div>

      {/* Row 4: 챌린지 배지 + 멘티 이름 */}
      <div className={`flex flex-col gap-1 p-2 ${color.body}`}>
        <span
          className={`shrink-0 whitespace-nowrap rounded-[3px] px-2 py-1 text-xxsmall12 font-medium tracking-[-0.3px] text-white ${color.badge}`}
        >
          {bar.challengeTitle}
        </span>
        <div className="flex items-center gap-1 whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px]">
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
export const LiveFeedbackTimeBlock = ({ bar }: { bar: PeriodBarData }) => {
  const lf = bar.liveFeedback!;
  const color = getColor(bar.colorIndex ?? 0);
  const isCompleted = lf.status === 'completed';

  return (
    <div
      className={`flex h-full w-full flex-col justify-between overflow-hidden border-l-[3px] px-2 py-1 ${color.border} ${isCompleted ? 'bg-neutral-95' : color.body}`}
    >
      {/* 상단: LIVE + 멘티명 + [완료 배지 오른쪽] */}
      <div className="flex min-w-0 items-center gap-1">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-red-500" />
        <span className="shrink-0 text-xxsmall12 font-bold leading-none text-red-500">
          LIVE
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-xxsmall12 font-medium leading-none ${isCompleted ? 'text-neutral-40' : 'text-neutral-10'}`}
        >
          {lf.menteeName}님
        </span>
        {isCompleted && (
          <span className="shrink-0 rounded-[3px] bg-green-500 px-1 py-0.5 text-[10px] font-bold leading-none text-white">
            완료
          </span>
        )}
      </div>

      {/* 하단: 챌린지명 + 시간 */}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xxsmall12 leading-tight text-neutral-40">
          {bar.challengeTitle}
        </span>
        <span className="truncate text-xxsmall12 leading-tight text-neutral-30">
          {formatTimeRange(lf.startTime, lf.endTime)}
        </span>
      </div>
    </div>
  );
};

export default LiveFeedbackCard;
