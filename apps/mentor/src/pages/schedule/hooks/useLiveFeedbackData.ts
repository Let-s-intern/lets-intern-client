import { useMemo } from 'react';
import { format } from 'date-fns';

import {
  useFeedbackMentorListQuery,
  useFeedbackMentorSlotsQuery,
} from '@/api/feedback/feedback';
import type {
  FeedbackMentor,
  FeedbackSlot,
} from '@/api/feedback/feedbackSchema';

import type { LiveFeedbackInfo, PeriodBarData } from '../types';
import { currentNow } from '../constants/mockNow';
import { resolveLiveSessionStatus } from '@/pages/feedback/utils/liveFeedbackStatus';

/**
 * 라이브 피드백 일정 데이터를 반환하는 훅.
 *
 * 서면 `ChallengeDataFetcher`(실 API → `PeriodBarData` 파생) 패턴을 차용해
 * 라이브 세션(`useFeedbackMentorListQuery`)과 멘토 오픈 슬롯
 * (`useFeedbackMentorSlotsQuery`)을 캘린더 바로 파생한다.
 *
 * ⚠️ BE 한계:
 *  - `FeedbackMentorVo`에 `challengeId`가 없어 라이브 챌린지 묶음은 `programTitle` 파생,
 *    `challengeId`는 `programTitle` 그룹별 합성 음수 키(서면 실 challengeId와 충돌 방지)로 부여한다.
 *    회차(`th`)는 BE가 제공하므로 `session.th`(없으면 `?? 1` 폴백)를 사용하고,
 *    기간 바는 `(programTitle, th)`마다 분리한다.
 *  - `live-feedback-mentee-open`(멘티 신청기간)은 멘토 캘린더 비표시 →
 *    원본 API도 없어 생성하지 않는다.
 */
export function useLiveFeedbackData(
  /** false면 내부 쿼리를 실행하지 않는다 (모달이 닫혀 있을 때 등) */
  { enabled = true }: { enabled?: boolean } = {},
): {
  bars: PeriodBarData[];
  isLoading: boolean;
} {
  const { data: sessions, isLoading: isSessionsLoading } =
    useFeedbackMentorListQuery({ enabled });
  const { data: slotsData, isLoading: isSlotsLoading } =
    useFeedbackMentorSlotsQuery({ enabled });

  const bars = useMemo(
    () =>
      deriveLiveFeedbackBars(sessions ?? [], slotsData?.feedbackSlotList ?? []),
    [sessions, slotsData],
  );

  return { bars, isLoading: isSessionsLoading || isSlotsLoading };
}

/** "YYYY-MM-DD" (날짜 단위) */
function toDate(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd');
}

/** "HH:mm" (시간 단위) */
function toTime(iso: string): string {
  return format(new Date(iso), 'HH:mm');
}

/**
 * `programTitle` 그룹별 합성 challengeId.
 * 서면 실 challengeId(양수)와 충돌하지 않도록 항상 음수로 부여한다.
 * 정렬된 그룹 인덱스 기반이라 동일 입력에 대해 안정적이다.
 */
function buildSyntheticChallengeId(groupIndex: number): number {
  return -(1_000_000 + groupIndex);
}

/**
 * BE 라이브 세션 상태 → 캘린더 배지 상태 매핑.
 *
 * ⚠️ 종료된 RESERVED 보정: BE는 세션 종료 후에도 `status`를 RESERVED로 유지하고
 * 출석(mentor/menteeStatus)만 채우는 경우가 있다. 과거엔 RESERVED를 무조건 'waiting'으로
 * 떨궈 "지난 라이브가 모두 진행 예정"으로 보였다. → 공통 리졸버로 시간+출석을 함께 본다.
 *  - COMPLETED → completed
 *  - CANCELED + menteeStatus ABSENT → mentee-absent / + mentorStatus ABSENT → mentor-absent / 그 외 → cancelled
 *  - RESERVED → 시작 전 waiting / 진행 중 in-progress / 종료 후 양측 참여 completed / 그 외 미진행
 */
function resolveSessionStatus(
  session: FeedbackMentor,
  now: Date,
): LiveFeedbackInfo['status'] {
  // 취소는 불참 주체를 보존(배지·집계 활용).
  if (session.status === 'CANCELED') {
    if (session.menteeStatus === 'ABSENT') return 'mentee-absent';
    if (session.mentorStatus === 'ABSENT') return 'mentor-absent';
    return 'cancelled';
  }

  const ui = resolveLiveSessionStatus({
    rawStatus: session.status,
    mentorStatus: session.mentorStatus,
    menteeStatus: session.menteeStatus,
    startDate: session.startDate,
    endDate: session.endDate,
    now,
  });
  switch (ui) {
    case 'inProgress':
      return 'in-progress';
    case 'completed':
      return 'completed';
    case 'missed':
      // 종료 후 미충족 — 불참 주체가 있으면 보존, 없으면 일반 미진행(cancelled 배지=미진행).
      if (session.menteeStatus === 'ABSENT') return 'mentee-absent';
      if (session.mentorStatus === 'ABSENT') return 'mentor-absent';
      return 'cancelled';
    case 'waiting':
    default:
      return 'waiting';
  }
}

/**
 * 라이브 세션·슬롯 → `PeriodBarData[]` 파생.
 *  - 각 세션 → `live-feedback` 바 (`missionId = -feedbackId`)
 *  - `programTitle` 그룹마다 `live-feedback-period` 바 (min/max, th=1)
 *  - 슬롯 전체 min/max → `live-feedback-mentor-open` 바 1개 (글로벌 슬롯 운영)
 *
 * 테스트 가능하도록 순수 함수로 분리 (쿼리 데이터를 인자로 받음).
 */
export function deriveLiveFeedbackBars(
  sessions: FeedbackMentor[],
  slots: FeedbackSlot[],
): PeriodBarData[] {
  const now = currentNow();
  const bars: PeriodBarData[] = [];

  // programTitle 그룹 → 안정적 인덱스. 정렬로 입력 순서 무관 결정성 확보.
  const groupTitles = Array.from(
    new Set(sessions.map((s) => s.programTitle)),
  ).sort();
  const groupIndexByTitle = new Map<string, number>();
  groupTitles.forEach((title, idx) => groupIndexByTitle.set(title, idx));

  const zeroCounts = {
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
  };

  // ── 개별 라이브 세션 바 ──
  for (const session of sessions) {
    const groupIndex = groupIndexByTitle.get(session.programTitle) ?? 0;
    const challengeId = buildSyntheticChallengeId(groupIndex);
    const date = toDate(session.startDate);

    bars.push({
      barType: 'live-feedback',
      challengeId,
      missionId: -session.feedbackId,
      challengeTitle: session.programTitle,
      th: session.th ?? 1,
      startDate: date,
      endDate: toDate(session.endDate),
      feedbackStartDate: date,
      feedbackDeadline: toDate(session.endDate),
      ...zeroCounts,
      liveFeedback: {
        id: session.feedbackId,
        menteeName: session.menteeName,
        startTime: toTime(session.startDate),
        endTime: toTime(session.endDate),
        status: resolveSessionStatus(session, now),
      },
    });
  }

  // ── (programTitle, th) 그룹별 기간 바 ──
  // 같은 챌린지(programTitle)라도 회차(th)가 다르면 별도 기간 바로 분리한다.
  for (const title of groupTitles) {
    const groupSessions = sessions.filter((s) => s.programTitle === title);
    if (groupSessions.length === 0) continue;
    const groupIndex = groupIndexByTitle.get(title) ?? 0;

    // 회차(th)별 버킷
    const byTh = new Map<number, FeedbackMentor[]>();
    for (const s of groupSessions) {
      const th = s.th ?? 1;
      const bucket = byTh.get(th);
      if (bucket) bucket.push(s);
      else byTh.set(th, [s]);
    }

    for (const [th, thSessions] of byTh) {
      const dates = thSessions.map((s) => toDate(s.startDate));
      const endDates = thSessions.map((s) => toDate(s.endDate));
      const min = dates.reduce((a, b) => (a < b ? a : b));
      const max = endDates.reduce((a, b) => (a > b ? a : b));

      bars.push({
        barType: 'live-feedback-period',
        // 같은 챌린지의 세션과 동일 challengeId 유지(회차는 challengeId가 아닌 th로 구분)
        challengeId: buildSyntheticChallengeId(groupIndex),
        // (challengeId, th)마다 유일한 음수 missionId
        missionId: -(2_000_000 + groupIndex * 100 + th),
        challengeTitle: title,
        th,
        startDate: min,
        endDate: max,
        feedbackStartDate: min,
        feedbackDeadline: max,
        ...zeroCounts,
        submittedCount: thSessions.length,
        waitingCount: thSessions.length,
      });
    }
  }

  // ── 멘토 오픈 슬롯 전체 → 글로벌 오픈기간 바 1개 ──
  if (slots.length > 0) {
    const starts = slots.map((s) => toDate(s.startDate));
    const ends = slots.map((s) => toDate(s.endDate));
    const min = starts.reduce((a, b) => (a < b ? a : b));
    const max = ends.reduce((a, b) => (a > b ? a : b));

    bars.push({
      barType: 'live-feedback-mentor-open',
      challengeId: buildSyntheticChallengeId(9_999),
      missionId: -3_000_000,
      challengeTitle: '멘토 일정 오픈',
      th: 1,
      startDate: min,
      endDate: max,
      feedbackStartDate: min,
      feedbackDeadline: max,
      ...zeroCounts,
      completedCount: slots.length,
    });
  }

  return bars;
}
