'use client';

import type { PeriodBarData } from '../../types';
import { getColor } from '../../constants/colors';

/**
 * "09:00" → "오전 9시", "09:30" → "9시 30분"
 * 시작 시각에만 오전/오후 접두어를 붙이고, 종료 시각은 생략한다.
 */
function formatTimeRange(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  const period = sh < 12 ? '오전' : '오후';
  const startHour = sh === 0 ? 12 : sh > 12 ? sh - 12 : sh;
  const endHour = eh === 0 ? 12 : eh > 12 ? eh - 12 : eh;
  const startMin = sm !== 0 ? ` ${sm}분` : '';
  const endMin = em !== 0 ? ` ${em}분` : '';

  return `${period} ${startHour}시${startMin} ~ ${endHour}시${endMin}`;
}

/**
 * 라이브 피드백 단일 날짜 카드 (1:1 세션).
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

export default LiveFeedbackCard;
