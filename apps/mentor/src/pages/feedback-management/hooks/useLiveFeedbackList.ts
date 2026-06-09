import { useMemo } from 'react';

import { useFeedbackMentorListQuery } from '@/api/feedback/feedback';
import type {
  FeedbackAttendanceStatus,
  FeedbackMentor,
  FeedbackStatus,
} from '@/api/feedback/feedbackSchema';
import type { LiveFeedbackInfo, PeriodBarData } from '@/pages/schedule/types';

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

/**
 * BE `FeedbackMentor` → 캘린더/모달 소비처가 쓰는 mock `LiveFeedbackInfo.status` 키로 매핑.
 *
 * BE는 회차/세션 진행 상태를 `status`(RESERVED/COMPLETED/CANCELED)와
 * 출석(`menteeStatus`/`mentorStatus`: PENDING/PRESENT/ABSENT) 조합으로만 제공한다.
 * - COMPLETED            → 'completed'
 * - CANCELED + 멘티 ABSENT → 'mentee-absent'
 * - CANCELED + 멘토 ABSENT → 'mentor-absent'
 * - CANCELED (그 외)      → 'mentee-absent' (구체 사유 없으면 미완료로 취급)
 * - RESERVED             → undefined (소비처가 startDate/endDate 시간 기준으로 진행 전/중/미완료 판정)
 *
 * ⚠️ BE에 in-progress/지각(mentor-late/mentee-late) 세분 상태는 없으므로 매핑하지 않는다.
 */
function mapLiveStatus(
  status: FeedbackStatus,
  menteeStatus: FeedbackAttendanceStatus,
  mentorStatus: FeedbackAttendanceStatus,
): LiveFeedbackInfo['status'] {
  if (status === 'COMPLETED') return 'completed';
  if (status === 'CANCELED') {
    if (menteeStatus === 'ABSENT') return 'mentee-absent';
    if (mentorStatus === 'ABSENT') return 'mentor-absent';
    return 'mentee-absent';
  }
  // RESERVED → 시간 기준 분기는 소비처(useMergedFeedbackRows/모달)가 담당
  return undefined;
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
  item: FeedbackMentor,
  challengeId: number,
): PeriodBarData {
  const date = toDateLabel(item.startDate);
  return {
    barType: 'live-feedback',
    challengeId,
    // 서면 missionId와 충돌하지 않도록 feedbackId를 그대로 사용 (양수지만 라이브 식별자로만 쓰임)
    missionId: item.feedbackId,
    challengeTitle: item.programTitle,
    th: 1,
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
      status: mapLiveStatus(item.status, item.menteeStatus, item.mentorStatus),
      // 시간·출석 정밀 판정을 위해 BE 원본 값을 그대로 보존한다.
      rawStatus: item.status,
      mentorStatus: item.mentorStatus,
      menteeStatus: item.menteeStatus,
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
 * 옵션 A: BE `FeedbackMentorVo`에 `challengeId`/`missionTh`(회차)가 없으므로
 * `programTitle` 문자열로 챌린지를 묶고, 챌린지당 단일 회차(`th=1`)로 표기한다.
 * → "N차 피드백" 회차 표기는 항상 1차로 고정되며, 정밀 회차 구분은 불가하다.
 *   정밀 그룹핑이 필요하면 BE에 challengeId/missionTh 추가가 선행되어야 한다(PRD §6.1).
 *
 * 동일 query key(`useFeedbackMentorListQuery`)를 예약현황 페이지와 공유해 중복 fetch를 막는다.
 */
export function useLiveFeedbackList(): {
  challenges: LiveFeedbackChallenge[];
  /** 모든 세션 바 (모달 네비게이션용) */
  allSessionBars: PeriodBarData[];
} {
  const { data: feedbackList } = useFeedbackMentorListQuery();

  return useMemo(() => {
    const items = feedbackList ?? [];

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
        .sessionBars.push(toSessionBar(item, challengeId));
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

      if (sessions.length === 0) {
        challenges.push({ challengeId, title: group.title, rounds: [] });
        return;
      }

      // 옵션 A: 회차 정보가 없으므로 챌린지당 단일 회차(th=1).
      // 회차 기간은 세션들의 min(startDate) ~ max(endDate)로 산출.
      const startDate = sessions[0].startDate;
      const endDate = sessions.reduce(
        (max, s) => (s.endDate > max ? s.endDate : max),
        sessions[0].endDate,
      );
      const { completed, inProgress, waiting } = countByStatus(sessions);

      challenges.push({
        challengeId,
        title: group.title,
        rounds: [
          {
            challengeId,
            challengeTitle: group.title,
            th: 1,
            startDate,
            endDate,
            totalMentees: sessions.length,
            completedCount: completed,
            inProgressCount: inProgress,
            waitingCount: waiting,
            sessionBars: sessions,
          },
        ],
      });
    });

    return { challenges, allSessionBars };
  }, [feedbackList]);
}
