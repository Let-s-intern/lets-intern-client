import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import axios from '@/utils/axios';
import { challengeMissionFeedbackListSchema } from '@/api/challenge/challengeSchema';
import type {
  FeedbackStatus,
  MentorFeedbackManagement,
} from '@/api/challenge/challengeSchema';
import type { AttendanceStatus } from '@/schema';
import { currentNow } from '@/pages/schedule/constants/mockNow';
import type { PeriodBarData } from '@/pages/schedule/types';
import {
  resolveLiveSessionStatus,
  badgeStatusToUi,
  getLiveFeedbackBadgeVisual,
  type LiveFeedbackUiStatus,
} from '@/pages/feedback/utils/liveFeedbackStatus';

import type { FeedbackRow } from '../types';
import type { LiveFeedbackRound } from './useLiveFeedbackList';

type Challenge = MentorFeedbackManagement['challengeList'][number];

/** 미션별 출석에서 추린 멘티 1명 단위 데이터 (서면 행 펼침용). */
export interface WrittenMenteeAttendance {
  /** 출석 id — 신규 출석 API(미제출자)는 null 가능. 행 key는 index로 보강한다. */
  id: number | null;
  name: string;
  status: AttendanceStatus;
  feedbackStatus: FeedbackStatus | null;
}

/** `${challengeId}-${missionId}` → 멘티별 출석 리스트 */
export type WrittenAttendanceMap = ReadonlyMap<
  string,
  WrittenMenteeAttendance[]
>;

const NULL_TIME = '99:99'; // 정렬 시 서면 행을 시간순 마지막으로 미는 sentinel

/** "YYYY-MM-DD" 포맷의 날짜를 "YYYY.MM.DD"로. */
function formatDot(iso: string): string {
  if (!iso || iso === 'unknown') return '-';
  return iso.slice(0, 10).replace(/-/g, '.');
}

function formatWrittenSchedule(start: string, end: string): string {
  if (!start || !end || start === 'unknown' || end === 'unknown') return '-';
  return `${formatDot(start)} ~ ${formatDot(end)}`;
}

function formatLiveSchedule(
  date: string,
  startTime: string,
  endTime: string,
): string {
  return `${formatDot(date)} ${startTime} ~ ${endTime}`;
}

/**
 * 서면 멘티 1명 행 — 제출(status)/피드백(feedbackStatus) 기준 상태 라벨.
 * 라벨은 서면 어휘(진행 전/진행 중/완료), 색(tone)만 라이브에 맞춘다(statusColors.ts 재사용).
 * - status === 'ABSENT' → 미제출 (피드백 미시작이므로 '진행 전')
 * - feedbackStatus COMPLETED/CONFIRMED → 완료
 * - feedbackStatus IN_PROGRESS → 진행 중
 * - 그 외(WAITING/null) → 진행 전
 */
function summarizeWrittenMentee(mentee: WrittenMenteeAttendance): {
  submissionLabel: '제출' | '미제출';
  statusLabel: string;
  statusTone: FeedbackRow['statusTone'];
} {
  const submissionLabel: '제출' | '미제출' =
    mentee.status === 'ABSENT' ? '미제출' : '제출';

  if (submissionLabel === '미제출') {
    return {
      submissionLabel,
      statusLabel: '진행 전',
      statusTone: 'liveWaiting',
    };
  }
  if (
    mentee.feedbackStatus === 'COMPLETED' ||
    mentee.feedbackStatus === 'CONFIRMED'
  ) {
    return {
      submissionLabel,
      statusLabel: '완료',
      statusTone: 'liveCompleted',
    };
  }
  if (mentee.feedbackStatus === 'IN_PROGRESS') {
    return {
      submissionLabel,
      statusLabel: '진행 중',
      statusTone: 'inProgress',
    };
  }
  return {
    submissionLabel,
    statusLabel: '진행 전',
    statusTone: 'liveWaiting',
  };
}

/**
 * 라이브 세션(`PeriodBarData`) → 4종 UI 상태 라벨 매핑.
 * `useLiveFeedbackList`의 `bar.liveFeedback?.status` 키를 사용한다.
 *
 * Push 2 이후 라이브 세션 데이터 소스는 BE 멘토 목록(`useFeedbackMentorListQuery`)이며,
 * `useLiveFeedbackList`가 BE `status`/`menteeStatus`/`mentorStatus` 조합을 다음으로만 매핑한다:
 * - completed (status=COMPLETED) → 진행 완료
 * - mentor-absent | mentee-absent (status=CANCELED) → 미진행
 * - undefined (status=RESERVED) → 시간 기준 분기 (시작 전: 진행 예정, 진행 중, 종료 후: 미진행)
 *
 * ⚠️ in-progress / mentor-late / mentee-late 는 BE에 없는 세분 상태다.
 * `LiveFeedbackInfo.status` 타입에는 남아 있어 아래 분기를 유지하지만, API 데이터로는 도달하지 않는다.
 */
/**
 * 라이브 세션 → 5종 UI 상태. (라벨·색은 VISUALS(SSOT)에서 파생)
 * - 실데이터(rawStatus) → 시간+출석 정밀 판정
 * - status만 있으면 5상태로 환산, 둘 다 없으면 시간 기준
 */
function resolveLiveRowUiStatus(
  bar: PeriodBarData,
  now: Date,
): LiveFeedbackUiStatus {
  const lf = bar.liveFeedback;

  if (lf?.rawStatus) {
    return resolveLiveSessionStatus({
      rawStatus: lf.rawStatus,
      mentorStatus: lf.mentorStatus,
      menteeStatus: lf.menteeStatus,
      attendanceStatus: lf.attendanceStatus,
      startDate: `${bar.startDate}T${lf.startTime}:00`,
      endDate: `${bar.startDate}T${lf.endTime}:00`,
      now,
    });
  }

  if (lf?.status) return badgeStatusToUi(lf.status);

  // 미설정 → 시간 기준 분기
  const startMs = new Date(
    `${bar.startDate}T${lf?.startTime ?? '00:00'}:00`,
  ).getTime();
  const endMs = new Date(
    `${bar.startDate}T${lf?.endTime ?? '00:00'}:00`,
  ).getTime();
  const nowMs = now.getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 'waiting';
  if (nowMs < startMs) return 'waiting';
  if (nowMs < endMs) return 'inProgress';
  return 'missed';
}

/** 라이브 행 상태 라벨·tone — 캘린더/모달과 동일한 VISUALS(SSOT)에서 가져온다. */
function resolveLiveRowStatus(
  bar: PeriodBarData,
  now: Date,
): { statusLabel: string; statusTone: FeedbackRow['statusTone'] } {
  const v = getLiveFeedbackBadgeVisual(resolveLiveRowUiStatus(bar, now));
  return { statusLabel: v.label, statusTone: v.tone };
}

/** 라이브 멘티 경험정리 제출 라벨 — attendanceStatus(PRESENT/UPDATED/LATE=제출, ABSENT=미제출). */
function deriveLiveSubmissionLabel(
  attendanceStatus: AttendanceStatus | undefined,
): '제출' | '미제출' | null {
  if (attendanceStatus === undefined) return null; // 상세 미병합 → 빈칸
  return attendanceStatus === 'ABSENT' ? '미제출' : '제출';
}

/**
 * 라이브 세션 → 멘티/멘토 참여 라벨.
 * 실데이터(rawStatus)면 BE 출석 + 세션 종료 여부로 판정한다.
 * - 멘티: PRESENT=참여 / ABSENT=불참 / PENDING=null
 * - 멘토: PRESENT=참여 / 종료 후 미출석=불참(BE가 노쇼를 PENDING으로 두는 문제 보정) / 진행 전·중=null
 */
function resolveLiveParticipation(
  bar: PeriodBarData,
  now: Date,
): {
  menteeParticipation: '참여' | '불참' | null;
  mentorParticipation: '참여' | '불참' | null;
} {
  const lf = bar.liveFeedback;

  // 실데이터(rawStatus 존재) → BE 원본 출석 + 세션 종료 여부로 판정.
  if (lf?.rawStatus) {
    const endMs = new Date(`${bar.startDate}T${lf.endTime}:00`).getTime();
    const ended = !Number.isNaN(endMs) && now.getTime() >= endMs;
    // 멘티: PRESENT=참여 / ABSENT=불참 / 그 외(PENDING)=null.
    const menteeParticipation =
      lf.menteeStatus === 'PRESENT'
        ? '참여'
        : lf.menteeStatus === 'ABSENT'
          ? '불참'
          : null;
    // 멘토: PRESENT=참여 / 종료 후 미출석=불참(BE가 노쇼를 ABSENT 아닌 PENDING으로 두는 문제 보정,
    //       상태 컬럼의 '미진행'과 동일 규칙) / 진행 전·중=null.
    const mentorParticipation =
      lf.mentorStatus === 'PRESENT' ? '참여' : ended ? '불참' : null;
    return { menteeParticipation, mentorParticipation };
  }

  const liveStatus = lf?.status;
  if (liveStatus === 'completed') {
    return { menteeParticipation: '참여', mentorParticipation: '참여' };
  }
  if (liveStatus === 'mentee-absent') {
    return { menteeParticipation: '불참', mentorParticipation: '참여' };
  }
  if (liveStatus === 'mentor-absent') {
    return { menteeParticipation: '참여', mentorParticipation: '불참' };
  }
  if (liveStatus === 'mentee-late') {
    return { menteeParticipation: '참여', mentorParticipation: '참여' };
  }
  if (liveStatus === 'mentor-late') {
    return { menteeParticipation: '참여', mentorParticipation: '참여' };
  }
  // 진행 전/진행 중은 미정 → 빈 표시
  return { menteeParticipation: null, mentorParticipation: null };
}

/** missionId → 서면 피드백 기간 {start, end} */
export type MissionRangeMap = ReadonlyMap<
  number,
  { start: string; end: string }
>;

export function buildMissionRangeMap(
  apiMissions: Array<{ id: number; endDate?: string | null }>,
): Map<number, { start: string; end: string }> {
  const map = new Map<number, { start: string; end: string }>();
  const addDays = (iso: string, days: number) => {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  for (const m of apiMissions) {
    if (!m.endDate) continue;
    map.set(m.id, { start: addDays(m.endDate, 1), end: addDays(m.endDate, 3) });
  }
  return map;
}

/**
 * 서면 + 라이브 행을 평면화한 `FeedbackRow[]`를 반환.
 *
 * 정렬: `startDate ASC → startTime ASC → menteeName/challenge ASC`.
 * 빈 컬럼 규칙:
 * - 서면: 멘티예약/멘티참여/멘토참여 = null
 * - 라이브: 멘티제출 = attendanceStatus 기반(상세 미병합 시 null)
 *
 * 라이브 행 데이터 소스는 Push 2부터 BE 멘토 목록(`useFeedbackMentorListQuery`) 기반
 * `useLiveFeedbackList`의 결과(`LiveFeedbackRound.sessionBars`)를 사용한다.
 *
 * ⚠️ 회차(`thLabel`) 한계: BE `FeedbackMentorVo`에 missionTh(회차)가 없어 옵션 A로
 *   챌린지당 단일 회차(`th=1`)만 부여한다. 따라서 라이브 행은 항상 "1회차"로 표기되며
 *   정밀 회차 구분은 불가하다 (정밀화는 BE 회차 필드 선행 필요, PRD §6.1).
 */
export function useMergedFeedbackRows(
  writtenChallenges: Challenge[],
  liveRounds: LiveFeedbackRound[],
  /**
   * `${challengeId}-${missionId}` → 멘티별 출석 리스트.
   * 주입되면 서면 행을 라이브처럼 멘티 1명당 1행으로 펼친다.
   * 누락(미주입/로딩/빈) 미션은 행을 0개 생성한다 (graceful).
   */
  writtenAttendanceMap?: WrittenAttendanceMap,
  /**
   * missionId → 서면 피드백 기간 {start, end}.
   * feedback-management 응답에는 미션 날짜가 없어, 미션 기간이 필요한 호출자는
   * `useWrittenMissionRangeMap(challengeIds)`로 채워 주입한다. 미주입 시 일정은 '-'.
   */
  missionRangeMap?: MissionRangeMap,
): FeedbackRow[] {
  return useMemo(() => {
    const now = currentNow();
    const rows: FeedbackRow[] = [];

    // ── 서면 행 (멘티 1명당 1행) ─────────────────────────────────────
    for (const challenge of writtenChallenges) {
      for (const mission of challenge.feedbackMissions) {
        const range = missionRangeMap?.get(mission.missionId);
        const scheduleStart = range?.start ?? '';
        const scheduleEnd = range?.end ?? '';
        const scheduleLabel = formatWrittenSchedule(scheduleStart, scheduleEnd);

        const menteeList =
          writtenAttendanceMap?.get(
            `${challenge.challengeId}-${mission.missionId}`,
          ) ?? [];

        // 출석이 비어있으면(미주입/로딩) 이 미션은 행 0개 — 깨지지 않게 skip.
        menteeList.forEach((mentee, menteeIdx) => {
          const summary = summarizeWrittenMentee(mentee);
          const menteeKey = mentee.id ?? `idx${menteeIdx}`;

          rows.push({
            id: `written-${challenge.challengeId}-${mission.missionId}-${menteeKey}`,
            type: 'written',
            startDate: scheduleStart || '',
            startTime: null,
            endTime: null,
            statusLabel: summary.statusLabel,
            statusTone: summary.statusTone,
            reservationLabel: null,
            submissionLabel: summary.submissionLabel,
            menteeParticipation: null,
            mentorParticipation: null,
            challengeTitle: challenge.title ?? '챌린지',
            thLabel: `${mission.th}회차`,
            scheduleLabel,
            menteeNameLabel: mentee.name,
            // 서면 상세 — 멘티 행이어도 미션 모달로 진입(제출자 있을 때).
            canOpenDetail: mentee.status !== 'ABSENT',
            source: {
              type: 'written',
              challengeId: challenge.challengeId,
              missionId: mission.missionId,
              missionTh: mission.th,
              challengeTitle: challenge.title ?? '챌린지',
            },
          });
        });
      }
    }

    // ── 라이브 행 ─────────────────────────────────────
    for (const round of liveRounds) {
      for (const bar of round.sessionBars) {
        if (!bar.liveFeedback) continue;

        const startTime = bar.liveFeedback.startTime;
        const endTime = bar.liveFeedback.endTime;
        const sessionDate = bar.startDate.slice(0, 10);
        const status = resolveLiveRowStatus(bar, now);
        const participation = resolveLiveParticipation(bar, now);

        rows.push({
          id: `live-${bar.liveFeedback.id ?? bar.missionId}`,
          type: 'live',
          startDate: sessionDate,
          startTime,
          endTime,
          statusLabel: status.statusLabel,
          statusTone: status.statusTone,
          // mock 슬롯은 모두 예약 상태로 가정 (예약 전 행은 향후 RESERVED/OPEN 분리 시 추가)
          reservationLabel: '예약 완료',
          // 멘티 경험정리 제출 여부 (attendanceStatus 기반, 상세 미병합 시 null)
          submissionLabel: deriveLiveSubmissionLabel(
            bar.liveFeedback.attendanceStatus,
          ),
          menteeParticipation: participation.menteeParticipation,
          mentorParticipation: participation.mentorParticipation,
          challengeTitle: round.challengeTitle,
          thLabel: `${round.th}회차`,
          scheduleLabel: formatLiveSchedule(sessionDate, startTime, endTime),
          menteeNameLabel: bar.liveFeedback.menteeName,
          // 라이브 상세는 RESERVED 이상(=예약 완료)이면 열림. mock은 전부 예약된 상태.
          canOpenDetail: true,
          source: { type: 'live', bar, round },
        });
      }
    }

    // ── 정렬 ─────────────────────────────────────
    // 날짜 내림차순(최신 먼저). 단 날짜 미상 행은 항상 마지막으로 민다.
    // 같은 날 안에서는 시간 오름차순(이른 세션 먼저) → 멘티명 순서 유지.
    rows.sort((a, b) => {
      const hasA = !!a.startDate;
      const hasB = !!b.startDate;
      if (hasA !== hasB) return hasA ? -1 : 1;
      if (hasA && a.startDate !== b.startDate)
        return b.startDate.localeCompare(a.startDate);

      const tA = a.startTime ?? NULL_TIME;
      const tB = b.startTime ?? NULL_TIME;
      if (tA !== tB) return tA.localeCompare(tB);

      return a.menteeNameLabel.localeCompare(b.menteeNameLabel);
    });

    return rows;
  }, [writtenChallenges, liveRounds, missionRangeMap, writtenAttendanceMap]);
}

/**
 * 여러 챌린지의 미션 날짜(`GET /challenge/:id/mission/feedback`)를 병렬 조회해
 * 서면 피드백 기간 맵(missionId → {start, end})을 합쳐 반환한다.
 *
 * feedback-management 응답에는 미션 날짜가 없어 서면 행 일정이 '-'로 비어 있는데,
 * 이 hook 결과를 `useMergedFeedbackRows`에 주입하면 `scheduleLabel`이 채워진다.
 *
 * useQueries 로 challengeId 별 fan-out(N+1 허용). 도착한 미션만 endDate+1~+3로 파생한다.
 */
export function useWrittenMissionRangeMap(
  challengeIds: number[],
): MissionRangeMap {
  const results = useQueries({
    queries: challengeIds.map((challengeId) => ({
      queryKey: ['useChallengeMissionFeedbackQuery', challengeId],
      queryFn: async () => {
        const res = await axios.get(
          `/challenge/${challengeId}/mission/feedback`,
        );
        return challengeMissionFeedbackListSchema.parse(res.data.data);
      },
    })),
  });

  // 결과 배열의 미션 리스트를 평면화해 단일 키로 메모 (객체 참조 변동 최소화).
  const missionListKey = results
    .map((r) => (r.data ? r.data.missionList.map((m) => m.id).join(',') : ''))
    .join('|');

  return useMemo(() => {
    const merged = new Map<number, { start: string; end: string }>();
    for (const result of results) {
      const partial = buildMissionRangeMap(result.data?.missionList ?? []);
      partial.forEach((range, id) => merged.set(id, range));
    }
    return merged;
    // missionListKey 가 같으면 같은 미션 집합 → 재계산 불필요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionListKey]);
}
