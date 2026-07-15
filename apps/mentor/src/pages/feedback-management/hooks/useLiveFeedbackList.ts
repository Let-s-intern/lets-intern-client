import { useMemo } from 'react';

import { useFeedbackMentorListWithAttendance } from '@/api/feedback/feedback';
import type { FeedbackMentorWithAttendance } from '@/api/feedback/feedbackSchema';
import { currentNow } from '@/pages/schedule/constants/mockNow';
import { resolveSessionStatus } from '@/pages/schedule/hooks/useLiveFeedbackData';
import type { PeriodBarData } from '@/pages/schedule/types';

/** 라이브 피드백 1개 "회차" = 하나의 live-feedback-period 바 + 그 기간 내 session 바들 */
export interface LiveFeedbackRound {
  challengeId: number;
  challengeTitle: string;
  th: number;
  startDate: string;
  endDate: string;
  /** 예약 완료된 (세션이 있는) 멘티 수 */
  totalMentees: number;
  /** status === 'completed' 인 세션 수 */
  completedCount: number;
  /** 진행중 + 지각 등 active 상태 수 */
  inProgressCount: number;
  /** waiting + undefined 상태 수 */
  waitingCount: number;
  /** 해당 회차의 개별 라이브 세션 바들 (모달에서 사용) */
  sessionBars: PeriodBarData[];
}

export interface LiveFeedbackChallenge {
  challengeId: number;
  title: string;
  rounds: LiveFeedbackRound[];
}

/** ISO datetime("2026-05-20T10:00:00") → "HH:mm". 파싱 실패 시 "00:00". */
function toTimeLabel(iso: string): string {
  const t = iso.slice(11, 16);
  return /^\d{2}:\d{2}$/.test(t) ? t : '00:00';
}

/** ISO datetime → "YYYY-MM-DD" 날짜부. */
function toDateLabel(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * BE 멘토 목록 1건 → 캘린더 호환 합성 `PeriodBarData` (barType='live-feedback').
 * `liveFeedback.id`에 `feedbackId`를 넣어 모달이 단건 상세를 정확히 fetch하도록 한다.
 */
function toSessionBar(
  item: FeedbackMentorWithAttendance,
  challengeId: number,
  now: Date,
): PeriodBarData {
  const date = toDateLabel(item.startDate);
  return {
    barType: 'live-feedback',
    challengeId,
    // 서면 missionId와 충돌하지 않도록 feedbackId를 그대로 사용 (양수지만 라이브 식별자로만 쓰임)
    missionId: item.feedbackId,
    challengeTitle: item.programTitle,
    th: item.th ?? 1,
    startDate: date,
    endDate: toDateLabel(item.endDate),
    feedbackStartDate: date,
    feedbackDeadline: date,
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    liveFeedback: {
      id: item.feedbackId,
      menteeName: item.menteeName,
      startTime: toTimeLabel(item.startDate),
      endTime: toTimeLabel(item.endDate),
      // 캘린더와 동일하게 시간+출석 기반 4상태로 계산(RESERVED도 진행 예정/중/미진행 판정).
      status: resolveSessionStatus(item, now),
      // 시간·출석 정밀 판정을 위해 BE 원본 값을 그대로 보존한다.
      rawStatus: item.status,
      mentorStatus: item.mentorStatus,
      menteeStatus: item.menteeStatus,
      // 경험정리 미제출(LATE/ABSENT) → 미진행 판정. 상세 N+1 병합으로 채워진다.
      attendanceStatus: item.attendanceStatus,
    },
  };
}

function countByStatus(bars: PeriodBarData[]) {
  let completed = 0;
  let inProgress = 0;
  let waiting = 0;
  for (const b of bars) {
    const status = b.liveFeedback?.status;
    if (status === 'completed') completed += 1;
    else if (
      status === 'in-progress' ||
      status === 'mentor-late' ||
      status === 'mentee-late'
    )
      inProgress += 1;
    else waiting += 1;
  }
  return { completed, inProgress, waiting };
}

/**
 * 라이브 피드백을 챌린지 → 회차 단위로 묶어 반환.
 *
 * 챌린지는 `programTitle` 문자열로 묶고(BE `FeedbackMentorVo`에 challengeId가 없음),
 * 각 챌린지의 세션을 BE가 제공하는 회차(`FeedbackMentorVo.th`)로 서브그룹핑해
 * 회차마다 `LiveFeedbackRound` 1개를 만든다. (`th`가 없는 응답은 `?? 1`로 폴백.)
 *
 * 예약현황/스케줄과 동일한 병합 훅(`useFeedbackMentorListWithAttendance`)을 써
 * query key를 공유하고(중복 fetch 방지), 경험정리 미제출(attendanceStatus) 판정을 뷰 간 일치시킨다.
 */
export function useLiveFeedbackList(): {
  challenges: LiveFeedbackChallenge[];
  /** 모든 세션 바 (모달 네비게이션용) */
  allSessionBars: PeriodBarData[];
} {
  const { data: feedbackList } = useFeedbackMentorListWithAttendance();

  return useMemo(() => {
    const items = feedbackList ?? [];
    // TODO(정밀도): now는 데이터 페치 시점 스냅샷이라, 열어둔 화면에서 시간이 흘러
    //   '진행 예정→진행 중→미진행'으로 자동 전환되지 않는다(refetch/재마운트 시 갱신).
    //   실시간 전환이 필요하면 타이머로 now를 주기 갱신해 재계산할 것.
    const now = currentNow();

    // programTitle → 합성 challengeId. 등장 순서대로 1부터 안정적으로 부여.
    const titleToId = new Map<string, number>();
    type Group = { title: string; sessionBars: PeriodBarData[] };
    const byChallenge = new Map<number, Group>();

    for (const item of items) {
      let challengeId = titleToId.get(item.programTitle);
      if (challengeId === undefined) {
        challengeId = titleToId.size + 1;
        titleToId.set(item.programTitle, challengeId);
        byChallenge.set(challengeId, {
          title: item.programTitle,
          sessionBars: [],
        });
      }
      byChallenge
        .get(challengeId)!
        .sessionBars.push(toSessionBar(item, challengeId, now));
    }

    const challenges: LiveFeedbackChallenge[] = [];
    const allSessionBars: PeriodBarData[] = [];

    byChallenge.forEach((group, challengeId) => {
      const sessions = group.sessionBars.slice().sort((a, b) => {
        const aKey = `${a.startDate}T${a.liveFeedback?.startTime ?? ''}`;
        const bKey = `${b.startDate}T${b.liveFeedback?.startTime ?? ''}`;
        return aKey.localeCompare(bKey);
      });

      allSessionBars.push(...sessions);

      // 세션을 회차(th)별로 묶어 회차마다 LiveFeedbackRound 1개 생성.
      // 회차 기간은 해당 th 세션들의 min(startDate) ~ max(endDate).
      const byTh = new Map<number, PeriodBarData[]>();
      for (const s of sessions) {
        const bucket = byTh.get(s.th);
        if (bucket) bucket.push(s);
        else byTh.set(s.th, [s]);
      }

      const rounds: LiveFeedbackRound[] = [...byTh.entries()]
        .sort(([a], [b]) => a - b)
        .map(([th, roundSessions]) => {
          // sessions 가 이미 정렬돼 있어 roundSessions[0] 이 최소 시작일.
          const startDate = roundSessions[0].startDate;
          const endDate = roundSessions.reduce(
            (max, s) => (s.endDate > max ? s.endDate : max),
            roundSessions[0].endDate,
          );
          const { completed, inProgress, waiting } =
            countByStatus(roundSessions);
          return {
            challengeId,
            challengeTitle: group.title,
            th,
            startDate,
            endDate,
            totalMentees: roundSessions.length,
            completedCount: completed,
            inProgressCount: inProgress,
            waitingCount: waiting,
            sessionBars: roundSessions,
          };
        });

      challenges.push({ challengeId, title: group.title, rounds });
    });

    return { challenges, allSessionBars };
  }, [feedbackList]);
}
