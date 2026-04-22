'use client';

import { useMemo } from 'react';

import { useMentorMissionFeedbackListQuery } from '@/api/challenge/challenge';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import { STATUS_BADGE, STATUS_TEXT } from '@/domain/mentor/constants/statusColors';
import { currentNow } from '@/domain/mentor/schedule/constants/mockNow';
import type { LiveFeedbackRound } from '../hooks/useLiveFeedbackList';
import LiveFeedbackRoundList, { LiveRoundRow } from './LiveFeedbackRoundList';

/** 오늘 날짜가 [start, end] 구간에 포함되는지 (일 단위 비교) */
function isTodayInRange(start: string, end: string): boolean {
  if (start === 'unknown' || end === 'unknown') return false;
  const now = currentNow();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(0, 0, 0, 0);
  return today >= s && today <= e;
}

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

const formatKoDay = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const formatDateRangeHeading = (start: string, end: string): string => {
  if (start === 'unknown' || end === 'unknown') return '날짜 미정';
  if (start === end) return formatKoDay(start);
  return `${formatKoDay(start)} ~ ${formatKoDay(end)}`;
};

interface MissionRowProps {
  mission: Mission;
  /** 챌린지 내 통합 시퀀스 번호 (서면+라이브 날짜순). 없으면 mission.th 사용 */
  displayTh?: number;
  onClickFeedback: (missionId: number, missionTh: number) => void;
}

export const MissionRow = ({
  mission,
  displayTh,
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
    completed: { label: '완료', className: STATUS_BADGE.completed },
    inProgress: { label: '진행중', className: STATUS_BADGE.inProgress },
    waiting: { label: '진행전', className: STATUS_BADGE.none },
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
          </p>
          <p>
            피드백 완료{' '}
            <span className={`font-semibold ${STATUS_TEXT.completed}`}>
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

  // API 미션 리스트를 항상 fetch해서 실제 챌린지도 기간 계산 가능하게 함
  // (캐시되므로 중복 비용 없음, 재호출해도 React Query가 재사용)
  const { data: missionListData } = useMentorMissionFeedbackListQuery(
    challenge.challengeId,
    { enabled: true },
  );

  /**
   * missionId → 서면 피드백 기간 {start, end}.
   * 1) API 응답 — mission.endDate + 2 ~ endDate + 4 (WRITTEN_FEEDBACK_CONFIG 기준)
   * 2) override — mock 챌린지 등 API에 없는 항목 덮어쓰기
   */
  const missionRangeMap = useMemo(() => {
    const map = new Map<number, { start: string; end: string }>();
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
    if (missionDateOverrides) {
      for (const [id, range] of Object.entries(missionDateOverrides)) {
        map.set(Number(id), range);
      }
    }
    return map;
  }, [missionListData, missionDateOverrides]);

  /** 날짜 그룹핑 키(feedbackDeadline) 조회용 보조 맵 */
  const missionDateMap = useMemo(() => {
    const map = new Map<number, string>();
    missionRangeMap.forEach((range, id) => map.set(id, range.end));
    return map;
  }, [missionRangeMap]);

  /**
   * 실제 프로그램 일정에 맞춰 "MM/DD ~ MM/DD" 범위를 그룹 키로 사용.
   * 서면: feedback 기간(start~end), 라이브: period(startDate~endDate).
   */
  const dateGroups = useMemo(() => {
    if (mode !== 'combined') return [];

    type Group = {
      key: string;
      start: string;
      end: string;
      written: Mission[];
      live: LiveFeedbackRound[];
    };
    const groups = new Map<string, Group>();
    const ensure = (start: string, end: string): Group => {
      const key = `${start}_${end}`;
      if (!groups.has(key)) {
        groups.set(key, { key, start, end, written: [], live: [] });
      }
      return groups.get(key)!;
    };

    for (const mission of challenge.feedbackMissions) {
      const range = missionRangeMap.get(mission.missionId);
      const group = range
        ? ensure(range.start, range.end)
        : ensure('unknown', 'unknown');
      group.written.push(mission);
    }

    for (const round of liveRounds) {
      ensure(round.startDate.slice(0, 10), round.endDate.slice(0, 10)).live.push(
        round,
      );
    }

    return Array.from(groups.values()).sort((a, b) => {
      if (a.start === 'unknown') return 1;
      if (b.start === 'unknown') return -1;
      return a.start.localeCompare(b.start);
    });
  }, [mode, challenge.feedbackMissions, liveRounds, missionRangeMap]);

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
            dateGroups.map((group) => {
              const isToday = isTodayInRange(group.start, group.end);
              return (
              <section key={group.key}>
                <h3
                  className={
                    isToday
                      ? 'mb-2 border-l-2 border-primary pl-2 text-sm font-semibold text-primary md:mb-3 md:text-base'
                      : 'mb-2 text-sm font-semibold text-gray-700 md:mb-3 md:text-base'
                  }
                >
                  {formatDateRangeHeading(group.start, group.end)}
                  {isToday && (
                    <span className="ml-1.5 text-xs font-bold">· 오늘</span>
                  )}
                </h3>
                <div className="space-y-2">
                  {group.written.map((mission) => (
                    <MissionRow
                      key={`w-${mission.missionId}`}
                      mission={mission}
                      displayTh={writtenDisplayTh.get(mission.missionId)}
                      onClickFeedback={handleClickFeedback}
                    />
                  ))}
                  {group.live.map((round) => (
                    <LiveRoundRow
                      key={`l-${round.challengeId}-${round.th}`}
                      round={round}
                      displayTh={liveDisplayTh.get(round.th)}
                      onClick={onLiveRoundClick}
                    />
                  ))}
                </div>
              </section>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengeFeedbackCard;
