'use client';

import type { LiveFeedbackRound } from '../hooks/useLiveFeedbackList';

function formatDateRange(startDate: string, endDate: string): string {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return startDate === endDate ? fmt(s) : `${fmt(s)} ~ ${fmt(e)}`;
}

interface LiveRoundRowProps {
  round: LiveFeedbackRound;
  /** 챌린지 내 통합 시퀀스 번호 (서면+라이브 날짜순). 없으면 round.th 사용 */
  displayTh?: number;
  onClick?: (round: LiveFeedbackRound) => void;
}

export const LiveRoundRow = ({
  round,
  displayTh,
  onClick,
}: LiveRoundRowProps) => {
  const thLabel = displayTh ?? round.th;
  const activeLabel =
    round.totalMentees === 0
      ? null
      : round.completedCount >= round.totalMentees
        ? { label: '완료', className: 'bg-green-100 text-green-700' }
        : round.inProgressCount > 0
          ? { label: '진행중', className: 'bg-yellow-100 text-yellow-700' }
          : { label: '진행전', className: 'bg-gray-100 text-gray-500' };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 md:flex-row md:items-center md:justify-between md:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
            {thLabel}회차 라이브
          </span>
          <h3 className="text-sm font-medium text-gray-900 md:text-base">
            라이브 피드백
          </h3>
        </div>

        {activeLabel && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${activeLabel.className}`}
          >
            {activeLabel.label}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <div className="text-xs text-gray-500 md:text-right">
          <p>
            예약{' '}
            <span className="font-semibold text-gray-700">
              {round.totalMentees}
            </span>
            명 · {formatDateRange(round.startDate, round.endDate)}
          </p>
          <p>
            피드백 완료{' '}
            <span className="font-semibold text-green-600">
              {round.completedCount}
            </span>{' '}
            / {round.totalMentees}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onClick?.(round)}
          className="min-h-[44px] w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover md:min-h-0 md:w-auto"
        >
          피드백 확인
        </button>
      </div>
    </div>
  );
};

interface LiveFeedbackRoundListProps {
  rounds: LiveFeedbackRound[];
  /** round.th → 챌린지 내 통합 시퀀스 번호 맵 */
  displayThMap?: Map<number, number>;
  onRoundClick?: (round: LiveFeedbackRound) => void;
}

const LiveFeedbackRoundList = ({
  rounds,
  displayThMap,
  onRoundClick,
}: LiveFeedbackRoundListProps) => {
  if (rounds.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-gray-400">
        라이브 피드백 일정이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rounds.map((round) => (
        <LiveRoundRow
          key={`${round.challengeId}-${round.th}`}
          round={round}
          displayTh={displayThMap?.get(round.th)}
          onClick={onRoundClick}
        />
      ))}
    </div>
  );
};

export default LiveFeedbackRoundList;
