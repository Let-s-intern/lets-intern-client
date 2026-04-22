'use client';

import { useMemo } from 'react';

import { useMentorMissionFeedbackListQuery } from '@/api/challenge/challenge';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import type { LiveFeedbackRound } from '../hooks/useLiveFeedbackList';
import LiveFeedbackRoundList, { LiveRoundRow } from './LiveFeedbackRoundList';

type Challenge = MentorFeedbackManagement['challengeList'][number];
type Mission = Challenge['feedbackMissions'][number];

type SectionMode = 'written-only' | 'live-only' | 'combined';

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatDateGroupLabel = (dateKey: string) => {
  if (dateKey === 'unknown') return '날짜 미정';
  const d = new Date(dateKey);
  return d.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

function formatMDRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return start === end ? fmt(s) : `${fmt(s)} ~ ${fmt(e)}`;
}

interface MissionRowProps {
  mission: Mission;
  /** 챌린지 내 통합 시퀀스 번호 (서면+라이브 날짜순). 없으면 mission.th 사용 */
  displayTh?: number;
  /** 서면 피드백 기간 {start, end} (라이브처럼 기간 표시용) */
  feedbackRange?: { start: string; end: string };
  onClickFeedback: (missionId: number, missionTh: number) => void;
}

export const MissionRow = ({
  mission,
  displayTh,
  feedbackRange,
  onClickFeedback,
}: MissionRowProps) => {
  const thLabel = displayTh ?? mission.th;
  const totalCount = mission.submittedCount + mission.notSubmittedCount;

  const { completedCount, missionStatus } = useMemo(() => {
    let completed = 0;
    let feedbackStarted = 0;
    for (const item of mission.feedbackStatusCounts) {
      if (
        item.feedbackStatus === 'COMPLETED' ||
        item.feedbackStatus === 'CONFIRMED'
      ) {
        completed += item.count;
      }
      if (item.feedbackStatus !== 'WAITING') {
        feedbackStarted += item.count;
      }
    }

    const hasSubmission = mission.submittedCount > 0;
    const isAllComplete = hasSubmission && completed >= mission.submittedCount;
    const status: 'completed' | 'inProgress' | 'waiting' | 'none' =
      !hasSubmission
        ? 'none'
        : isAllComplete
          ? 'completed'
          : feedbackStarted > 0
            ? 'inProgress'
            : 'waiting';
    return { completedCount: completed, missionStatus: status };
  }, [mission.feedbackStatusCounts, mission.submittedCount]);

  const statusConfig = {
    completed: { label: '완료', className: 'bg-green-100 text-green-700' },
    inProgress: {
      label: '진행중',
      className: 'bg-yellow-100 text-yellow-700',
    },
    waiting: { label: '진행전', className: 'bg-gray-100 text-gray-500' },
    none: null,
  } as const;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 md:flex-row md:items-center md:justify-between md:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0 rounded-lg bg-primary-10 px-2.5 py-1 text-xs font-medium text-primary-dark">
            {thLabel}회차 서면
          </span>
          <h3 className="text-sm font-medium text-gray-900 md:text-base">
            {mission.missionTitle || `${thLabel}회차 미션`}
          </h3>
        </div>

        {statusConfig[missionStatus] && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[missionStatus].className}`}
          >
            {statusConfig[missionStatus].label}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <div className="text-xs text-gray-500 md:text-right">
          <p>
            제출{' '}
            <span className="font-semibold text-gray-700">
              {mission.submittedCount}
            </span>{' '}
            / {totalCount}
            {feedbackRange && (
              <>
                {' · '}
                <span className="font-medium text-gray-700">
                  {formatMDRange(feedbackRange.start, feedbackRange.end)}
                </span>
              </>
            )}
          </p>
          <p>
            피드백 완료{' '}
            <span className="font-semibold text-green-600">
              {completedCount}
            </span>{' '}
            / {mission.submittedCount}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onClickFeedback(mission.missionId, mission.th)}
          className="min-h-[44px] w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover md:min-h-0 md:w-auto"
        >
          피드백 작성
        </button>
      </div>
    </div>
  );
};

interface ChallengeFeedbackCardProps {
  challenge: Challenge;
  mode?: SectionMode;
  liveRounds?: LiveFeedbackRound[];
  /** 외부 주입 가능한 missionId → 서면 피드백 기간 맵 (mock 등 API 외 데이터용) */
  missionDateOverrides?: Record<number, { start: string; end: string }>;
  onMissionClick: (
    challenge: Challenge,
    missionId: number,
    missionTh: number,
  ) => void;
  onLiveRoundClick?: (round: LiveFeedbackRound) => void;
}

const ChallengeFeedbackCard = ({
  challenge,
  mode = 'written-only',
  liveRounds = [],
  missionDateOverrides,
  onMissionClick,
  onLiveRoundClick,
}: ChallengeFeedbackCardProps) => {
  const handleClickFeedback = (missionId: number, missionTh: number) => {
    onMissionClick(challenge, missionId, missionTh);
  };

  // override가 주어지면 API 요청 생략
  const shouldFetchDates = mode === 'combined' && !missionDateOverrides;
  const { data: missionListData } = useMentorMissionFeedbackListQuery(
    challenge.challengeId,
    { enabled: shouldFetchDates },
  );

  /** missionId → 서면 피드백 기간 {start, end}. override 우선, 없으면 API missionEndDate+2/+4로 계산 */
  const missionRangeMap = useMemo(() => {
    const map = new Map<number, { start: string; end: string }>();
    if (missionDateOverrides) {
      for (const [id, range] of Object.entries(missionDateOverrides)) {
        map.set(Number(id), range);
      }
      return map;
    }
    const addDays = (iso: string, days: number) => {
      const d = new Date(iso);
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };
    for (const m of missionListData?.missionList ?? []) {
      if (!m.endDate) continue;
      map.set(m.id, {
        start: addDays(m.endDate, 2),
        end: addDays(m.endDate, 4),
      });
    }
    return map;
  }, [missionListData, missionDateOverrides]);

  /** 날짜 그룹핑 키(feedbackDeadline) 조회용 보조 맵 */
  const missionDateMap = useMemo(() => {
    const map = new Map<number, string>();
    missionRangeMap.forEach((range, id) => map.set(id, range.end));
    return map;
  }, [missionRangeMap]);

  const dateGroups = useMemo(() => {
    if (mode !== 'combined') return [];

    const groups = new Map<
      string,
      { written: Mission[]; live: LiveFeedbackRound[] }
    >();

    for (const mission of challenge.feedbackMissions) {
      const key = missionDateMap.get(mission.missionId) ?? 'unknown';
      if (!groups.has(key)) groups.set(key, { written: [], live: [] });
      groups.get(key)!.written.push(mission);
    }

    for (const round of liveRounds) {
      const key = round.startDate.slice(0, 10);
      if (!groups.has(key)) groups.set(key, { written: [], live: [] });
      groups.get(key)!.live.push(round);
    }

    return Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === 'unknown') return 1;
      if (b === 'unknown') return -1;
      return a.localeCompare(b);
    });
  }, [mode, challenge.feedbackMissions, liveRounds, missionDateMap]);

  /**
   * 챌린지 내 서면+라이브 rounds를 날짜순으로 정렬해 통합 시퀀스 번호 부여.
   * "1회차 서면, 2회차 라이브, 3회차 서면" 같은 현실적 회차 표기를 위해 사용.
   */
  const { writtenDisplayTh, liveDisplayTh } = useMemo(() => {
    type Item =
      | { kind: 'written'; id: number; date: string }
      | { kind: 'live'; th: number; date: string };
    const items: Item[] = [];

    for (const mission of challenge.feedbackMissions) {
      const date = missionDateMap.get(mission.missionId) ?? '';
      items.push({ kind: 'written', id: mission.missionId, date });
    }
    for (const round of liveRounds) {
      items.push({ kind: 'live', th: round.th, date: round.startDate });
    }

    // 날짜 없는 항목은 맨 뒤, 나머지는 오름차순
    items.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });

    const written = new Map<number, number>();
    const live = new Map<number, number>();
    items.forEach((item, i) => {
      const seq = i + 1;
      if (item.kind === 'written') written.set(item.id, seq);
      else live.set(item.th, seq);
    });
    return { writtenDisplayTh: written, liveDisplayTh: live };
  }, [challenge.feedbackMissions, liveRounds, missionDateMap]);

  const showWritten = mode === 'written-only';
  const showLive = mode === 'live-only';
  const showCombined = mode === 'combined';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 md:p-6">
      {/* Challenge header */}
      <div className="mb-3 flex flex-col gap-1 md:mb-4">
        <h2 className="text-base font-bold text-gray-900 md:text-lg">
          {challenge.title ?? '챌린지'}
        </h2>
        {challenge.shortDesc ? (
          <p className="text-sm text-gray-500">{challenge.shortDesc}</p>
        ) : null}
        <p className="text-xs text-gray-400">
          {formatDate(challenge.startDate)} ~ {formatDate(challenge.endDate)}
        </p>
      </div>

      {/* 서면 only */}
      {showWritten && (
        <>
          {challenge.feedbackMissions.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-400">
              등록된 피드백 미션이 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {challenge.feedbackMissions.map((mission) => (
                <MissionRow
                  key={mission.missionId}
                  mission={mission}
                  displayTh={writtenDisplayTh.get(mission.missionId)}
                  feedbackRange={missionRangeMap.get(mission.missionId)}
                  onClickFeedback={handleClickFeedback}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* 라이브 only — 회차 row 나열 */}
      {showLive && (
        <LiveFeedbackRoundList
          rounds={liveRounds}
          displayThMap={liveDisplayTh}
          onRoundClick={onLiveRoundClick}
        />
      )}

      {/* 통합 — 날짜 그룹 × (서면 회차 + 라이브 회차) */}
      {showCombined && (
        <div className="flex flex-col gap-4 md:gap-5">
          {dateGroups.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-400">
              표시할 피드백이 없습니다.
            </div>
          ) : (
            dateGroups.map(([dateKey, items]) => (
              <section key={dateKey}>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 md:mb-3 md:text-base">
                  {formatDateGroupLabel(dateKey)}
                </h3>
                <div className="space-y-2">
                  {items.written.map((mission) => (
                    <MissionRow
                      key={`w-${mission.missionId}`}
                      mission={mission}
                      displayTh={writtenDisplayTh.get(mission.missionId)}
                      onClickFeedback={handleClickFeedback}
                    />
                  ))}
                  {items.live.map((round) => (
                    <LiveRoundRow
                      key={`l-${round.challengeId}-${round.th}`}
                      round={round}
                      displayTh={liveDisplayTh.get(round.th)}
                      onClick={onLiveRoundClick}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengeFeedbackCard;
