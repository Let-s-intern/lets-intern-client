import { useMemo } from 'react';
import { format } from 'date-fns';

import {
  useFeedbackMentorListWithAttendance,
  useFeedbackMentorSlotsQuery,
} from '@/api/feedback/feedback';
import type {
  FeedbackMentorWithAttendance,
  FeedbackSlot,
} from '@/api/feedback/feedbackSchema';

import type { LiveFeedbackInfo, PeriodBarData } from '../types';
import { currentNow } from '../constants/mockNow';
import {
  type ScheduleWindow,
  computeReservationWindow,
  computeSlotOpenWindow,
  selectSlotOpenWindow,
} from '../data/feedbackScheduleRules';
import { resolveLiveSessionStatus } from '@/pages/feedback/utils/liveFeedbackStatus';

/**
 * 라이브 피드백 일정 데이터를 반환하는 훅.
 *
 * 서면 `ChallengeDataFetcher`(실 API → `PeriodBarData` 파생) 패턴을 차용해
 * 라이브 세션(`useFeedbackMentorListWithAttendance`)과 멘토 오픈 슬롯
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
  /**
   * 슬롯 오픈 게이팅 윈도 — 모든 미션의 오픈 윈도(-3d~-2d)를 `selectSlotOpenWindow`로
   * 단일 윈도로 합성한 값. 미션 일자(BE forward-compat)가 없으면 `null`(게이팅 미적용).
   * `LiveAvailabilityContent.slotOpenWindow`로 그대로 주입한다.
   */
  slotOpenWindow: ScheduleWindow | null;
  isLoading: boolean;
} {
  // 목록 + 상세 attendanceStatus 병합(N+1) — 미제출(LATE|ABSENT)을 '미진행'으로 반영하기 위함.
  // 병합 상세엔 missionStartDate도 포함되어 슬롯 오픈 윈도 앵커로 재사용한다.
  const { data: sessions, isLoading: isSessionsLoading } =
    useFeedbackMentorListWithAttendance({ enabled });
  const { data: slotsData, isLoading: isSlotsLoading } =
    useFeedbackMentorSlotsQuery({ enabled });

  const bars = useMemo(
    () =>
      deriveLiveFeedbackBars(sessions ?? [], slotsData?.feedbackSlotList ?? []),
    [sessions, slotsData],
  );

  // 미션 시작일 목록 → 단일 게이팅 윈도. now가 어느 윈도에 들면 통과, 아니면 예정 윈도 안내.
  const slotOpenWindow = useMemo(
    () =>
      selectSlotOpenWindow(
        (sessions ?? []).map((s) => s.missionStartDate),
        currentNow(),
      ),
    [sessions],
  );

  return {
    bars,
    slotOpenWindow,
    isLoading: isSessionsLoading || isSlotsLoading,
  };
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
 * (programTitle, th) 그룹의 "LIVE 피드백 기간"(예약 기간) 날짜 범위를 확정한다.
 *
 * 우선순위:
 *  1) 그룹 내 미션 일자(`missionStartDate`/`missionEndDate`)가 있으면 그 값으로 확정
 *     (미션 시작일~종료일 = 예약 기간, `computeReservationWindow` 규칙).
 *  2) BE 미반영(둘 중 하나라도 없음)이면 세션 시각 min/max로 폴백.
 *
 * 같은 (title, th)의 세션은 동일 미션을 공유하므로 첫 유효 값만 사용한다.
 */
function resolvePeriodRange(
  thSessions: FeedbackMentorWithAttendance[],
  fallbackStart: string,
  fallbackEnd: string,
): { startDate: string; endDate: string } {
  const withMission = thSessions.find(
    (s) => s.missionStartDate && s.missionEndDate,
  );
  if (!withMission?.missionStartDate || !withMission.missionEndDate) {
    return { startDate: fallbackStart, endDate: fallbackEnd };
  }
  const window = computeReservationWindow(
    withMission.missionStartDate,
    withMission.missionEndDate,
  );
  return {
    startDate: format(window.start, 'yyyy-MM-dd'),
    endDate: format(window.end, 'yyyy-MM-dd'),
  };
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
/**
 * BE 세션 → 캘린더 배지 축약 상태(시간+출석 기반 4상태). 캘린더·모달 공용.
 * 라이브 목록(useLiveFeedbackList)도 이 함수를 재사용해 상태를 통일한다.
 */
export function resolveSessionStatus(
  session: FeedbackMentorWithAttendance,
  now: Date,
): LiveFeedbackInfo['status'] {
  const ui = resolveLiveSessionStatus({
    rawStatus: session.status,
    mentorStatus: session.mentorStatus,
    menteeStatus: session.menteeStatus,
    // 미제출(LATE|ABSENT)·예약취소면 '취소', 멘토 미입장이면 '미진행'.
    attendanceStatus: session.attendanceStatus,
    startDate: session.startDate,
    endDate: session.endDate,
    now,
  });
  switch (ui) {
    case 'inProgress':
      return 'in-progress';
    case 'completed':
      return 'completed';
    case 'cancelled':
      // 멘티 예약 후 경험정리 미제출 · 예약취소 → 취소
      return 'cancelled';
    case 'missed':
      // 멘토가 라이브에 입장하지 않음 → 미진행
      return 'mentor-absent';
    case 'waiting':
    default:
      return 'waiting';
  }
}

/**
 * 라이브 세션·슬롯 → `PeriodBarData[]` 파생.
 *  - 각 세션 → `live-feedback` 바 (`missionId = -feedbackId`)
 *  - `(programTitle, th)` 그룹마다 `live-feedback-period` 바 (예약 기간 = 미션 시작일~종료일)
 *  - `(programTitle, th)` 그룹마다 `live-feedback-mentor-open` 바 (슬롯 오픈 기간 = 미션 시작일 -3d~-2d)
 *    · 미션 일자가 없으면(BE 미배포) 슬롯 전체 min/max로 글로벌 폴백 바 1개
 *
 * 테스트 가능하도록 순수 함수로 분리 (쿼리 데이터를 인자로 받음).
 */
export function deriveLiveFeedbackBars(
  sessions: FeedbackMentorWithAttendance[],
  slots: FeedbackSlot[],
): PeriodBarData[] {
  const now = currentNow();
  const bars: PeriodBarData[] = [];
  // 미션 일자 기반 오픈 기간 바를 하나라도 만들었는지 — 폴백(슬롯 min/max) 여부 판단용.
  let emittedMissionOpenBar = false;

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
        attendanceStatus: session.attendanceStatus,
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
    const byTh = new Map<number, FeedbackMentorWithAttendance[]>();
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

      // "LIVE 피드백 기간"(예약 기간) = 미션 시작일~종료일 (PRD §4·§6-2 표).
      // BE가 상세 VO에 미션 일자를 내려주면 그 값으로 기간을 확정하고,
      // 미반영(null/undefined)이면 세션 시각 min/max로 폴백한다.
      const { startDate, endDate } = resolvePeriodRange(thSessions, min, max);

      bars.push({
        barType: 'live-feedback-period',
        // 같은 챌린지의 세션과 동일 challengeId 유지(회차는 challengeId가 아닌 th로 구분)
        challengeId: buildSyntheticChallengeId(groupIndex),
        // (challengeId, th)마다 유일한 음수 missionId
        missionId: -(2_000_000 + groupIndex * 100 + th),
        challengeTitle: title,
        th,
        startDate,
        endDate,
        feedbackStartDate: startDate,
        feedbackDeadline: endDate,
        ...zeroCounts,
        submittedCount: thSessions.length,
        waitingCount: thSessions.length,
      });

      // ── 슬롯 오픈 기간 바 (미션 시작일 -3d 00:00 ~ -2d 23:59, PRD §4 표) ──
      // BE 미션 일자가 있을 때만 표 기준으로 확정한다. 없으면(BE 미배포) 아래 폴백.
      const missionStart = thSessions.find(
        (s) => s.missionStartDate,
      )?.missionStartDate;
      if (missionStart) {
        const open = computeSlotOpenWindow(missionStart);
        const openStart = format(open.start, 'yyyy-MM-dd');
        const openEnd = format(open.end, 'yyyy-MM-dd');
        bars.push({
          barType: 'live-feedback-mentor-open',
          challengeId: buildSyntheticChallengeId(groupIndex),
          missionId: -(3_100_000 + groupIndex * 100 + th),
          challengeTitle: title,
          th,
          startDate: openStart,
          endDate: openEnd,
          feedbackStartDate: openStart,
          feedbackDeadline: openEnd,
          ...zeroCounts,
        });
        emittedMissionOpenBar = true;
      }
    }
  }

  // ── 폴백: 미션 일자 미반영(BE 미배포)일 때만 기존 슬롯 min/max 오픈 바 유지 ──
  // (미션 일자가 있으면 위에서 미션 그룹별 정확한 오픈 기간 바를 이미 생성했다.)
  if (!emittedMissionOpenBar && slots.length > 0) {
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
