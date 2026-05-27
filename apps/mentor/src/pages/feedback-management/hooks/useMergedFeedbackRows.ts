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
    return { submissionLabel, statusLabel: '진행 전', statusTone: 'waiting' };
  }
  if (
    mentee.feedbackStatus === 'COMPLETED' ||
    mentee.feedbackStatus === 'CONFIRMED'
  ) {
    return { submissionLabel, statusLabel: '완료', statusTone: 'completed' };
  }
  if (mentee.feedbackStatus === 'IN_PROGRESS') {
    return {
      submissionLabel,
      statusLabel: '진행 중',
      statusTone: 'inProgress',
    };
  }
  return { submissionLabel, statusLabel: '진행 전', statusTone: 'waiting' };
}

/**
 * 라이브 세션(`PeriodBarData`) → 4종 UI 상태 라벨 매핑.
 * `useLiveFeedbackList`의 `bar.liveFeedback?.status` 키를 사용한다.
 *
 * Push 2 이후 라이브 세션 데이터 소스는 BE 멘토 목록(`useFeedbackMentorListQuery`)이며,
 * `useLiveFeedbackList`가 BE `status`/`menteeStatus`/`mentorStatus` 조합을 다음으로만 매핑한다:
 * - completed (status=COMPLETED) → 완료
 * - mentor-absent | mentee-absent (status=CANCELED) → 미완료
 * - undefined (status=RESERVED) → 시간 기준 분기 (시작 전: 진행 전, 진행 중, 종료 후: 미완료)
 *
 * ⚠️ in-progress / mentor-late / mentee-late 는 BE에 없는 세분 상태다.
 * `LiveFeedbackInfo.status` 타입에는 남아 있어 아래 분기를 유지하지만, API 데이터로는 도달하지 않는다.
 */
function resolveLiveRowStatus(
  bar: PeriodBarData,
  now: Date,
): {
  statusLabel: string;
  statusTone: FeedbackRow['statusTone'];
} {
  const liveStatus = bar.liveFeedback?.status;

  if (liveStatus === 'completed')
    return { statusLabel: '완료', statusTone: 'completed' };
  if (liveStatus === 'mentor-absent' || liveStatus === 'mentee-absent')
    return { statusLabel: '미완료', statusTone: 'absent' };
  if (
    liveStatus === 'in-progress' ||
    liveStatus === 'mentor-late' ||
    liveStatus === 'mentee-late'
  )
    return { statusLabel: '진행 중', statusTone: 'inProgress' };

  // 미설정 → 시간 기준 분기
  const startTime = bar.liveFeedback?.startTime ?? '00:00';
  const endTime = bar.liveFeedback?.endTime ?? '00:00';
  const startMs = new Date(`${bar.startDate}T${startTime}:00`).getTime();
  const endMs = new Date(`${bar.startDate}T${endTime}:00`).getTime();
  const nowMs = now.getTime();

  if (Number.isNaN(startMs) || Number.isNaN(endMs))
    return { statusLabel: '진행 전', statusTone: 'waiting' };
  if (nowMs < startMs) return { statusLabel: '진행 전', statusTone: 'waiting' };
  if (nowMs < endMs)
    return { statusLabel: '진행 중', statusTone: 'inProgress' };
  return { statusLabel: '미완료', statusTone: 'absent' };
}

/**
 * 라이브 세션 → 멘티 예약/참여 라벨.
 * BE 목록에 내려온 세션은 모두 예약 확정 건이므로 예약 라벨은 '예약 완료'로 고정한다.
 * 참여 라벨은 `useLiveFeedbackList`가 BE status/출석을 매핑한 liveFeedback.status에서 도출.
 * (mentee-absent → 멘티 불참, mentor-absent → 멘토 불참, completed → 양측 참여)
 */
function resolveLiveParticipation(bar: PeriodBarData): {
  menteeParticipation: '참여' | '불참' | null;
  mentorParticipation: '참여' | '불참' | null;
} {
  const liveStatus = bar.liveFeedback?.status;
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
    map.set(m.id, { start: addDays(m.endDate, 2), end: addDays(m.endDate, 4) });
  }
  return map;
}

/**
 * 서면 + 라이브 행을 평면화한 `FeedbackRow[]`를 반환.
 *
 * 정렬: `startDate ASC → startTime ASC → menteeName/challenge ASC`.
 * 빈 컬럼 규칙:
 * - 서면: 멘티예약/멘티참여/멘토참여 = null
 * - 라이브: 멘티제출 = null (제출 연동 미구현)
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
        const participation = resolveLiveParticipation(bar);

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
          // 라이브는 제출 컬럼 비움 (PRD §5.3 분기 규칙)
          submissionLabel: null,
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
    rows.sort((a, b) => {
      const dateA = a.startDate || '9999-99-99';
      const dateB = b.startDate || '9999-99-99';
      if (dateA !== dateB) return dateA.localeCompare(dateB);

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
 * useQueries 로 challengeId 별 fan-out(N+1 허용). 도착한 미션만 endDate+2~+4로 파생한다.
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
