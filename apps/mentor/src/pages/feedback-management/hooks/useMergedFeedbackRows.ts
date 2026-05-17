import { useMemo } from 'react';

import { useMentorMissionFeedbackListQuery } from '@/api/challenge/challenge';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import { currentNow } from '@/pages/schedule/constants/mockNow';
import type { PeriodBarData } from '@/pages/schedule/types';

import { WRITTEN_CHALLENGE_MISSION_FEEDBACK_RANGES } from '../mocks/writtenChallengeMock';
import type { FeedbackRow } from '../types';
import type { LiveFeedbackRound } from './useLiveFeedbackList';

type Challenge = MentorFeedbackManagement['challengeList'][number];
type Mission = Challenge['feedbackMissions'][number];

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

/** 서면 미션 행 — 제출/피드백 상태 요약 */
function summarizeWrittenMission(mission: Mission): {
  statusLabel: string;
  statusTone: FeedbackRow['statusTone'];
} {
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
  if (!hasSubmission) {
    return { statusLabel: '진행 전', statusTone: 'waiting' };
  }
  if (completed >= mission.submittedCount) {
    return { statusLabel: '완료', statusTone: 'completed' };
  }
  if (feedbackStarted > 0) {
    return { statusLabel: '진행 중', statusTone: 'inProgress' };
  }
  return { statusLabel: '진행 전', statusTone: 'waiting' };
}

/**
 * 라이브 세션(`PeriodBarData`) → 4종 UI 상태 라벨 매핑.
 * `useLiveFeedbackList`의 `bar.liveFeedback?.status` (mock 키)를 사용한다.
 *
 * BE 자동 상태 전이 미구현(PRD §5.4 mentor3.14) 보완:
 * - completed → 완료
 * - mentor-absent | mentee-absent → 미완료
 * - in-progress | mentor-late | mentee-late → 진행 중
 * - undefined | waiting → 시간 기준 분기 (시작 전: 진행 전, 시작 후: 진행 중, 종료 후: 미완료)
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
 * 본 단계에서는 mock 슬롯이 항상 예약된 상태이므로 모두 '예약 완료'.
 * 참여 라벨은 status에서 도출.
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

interface MissionRangeMap {
  /** missionId → 서면 피드백 기간 {start, end} */
  get(id: number): { start: string; end: string } | undefined;
}

function buildMissionRangeMap(
  apiMissions: Array<{ id: number; endDate?: string | null }>,
): MissionRangeMap {
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
  // mock override (writtenChallengeMock에 없는 API 미션은 그대로 유지)
  for (const [idStr, range] of Object.entries(
    WRITTEN_CHALLENGE_MISSION_FEEDBACK_RANGES,
  )) {
    map.set(Number(idStr), range);
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
 * 라이브 행 데이터 소스는 Push 1의 `useFeedbackMentorSlotsQuery`로 교체될 예정이지만,
 * 현 시점에는 mock 기반 `useLiveFeedbackList`의 결과(`LiveFeedbackRound.sessionBars`)를 그대로 사용한다.
 */
export function useMergedFeedbackRows(
  writtenChallenges: Challenge[],
  liveRounds: LiveFeedbackRound[],
): FeedbackRow[] {
  // 서면 피드백 기간 계산용 — 첫 번째 챌린지만 fetch (성능 보호용).
  // 실제 API는 challengeId 단위라 모든 챌린지 fetch는 캐시되더라도 N개 호출이 발생.
  // 단순화를 위해 mock RANGES override만 사용하고 API range는 빈 맵 처리.
  const missionRangeMap = useMemo(
    () => buildMissionRangeMap([]),
    [],
  );

  return useMemo(() => {
    const now = currentNow();
    const rows: FeedbackRow[] = [];

    // ── 서면 행 ─────────────────────────────────────
    for (const challenge of writtenChallenges) {
      for (const mission of challenge.feedbackMissions) {
        const range = missionRangeMap.get(mission.missionId);
        const scheduleStart = range?.start ?? '';
        const scheduleEnd = range?.end ?? '';
        const summary = summarizeWrittenMission(mission);

        // 서면 제출 라벨 (대표 요약): 제출자 있으면 '제출', 없으면 '미제출'
        const submissionLabel: '제출' | '미제출' =
          mission.submittedCount > 0 ? '제출' : '미제출';

        // 멘티 성명 — 미션 단위 행은 멘티별로 펼치지 않음. 인원 수 표기.
        const totalCount =
          mission.submittedCount + mission.notSubmittedCount;
        const menteeNameLabel =
          totalCount > 0 ? `멘티 ${totalCount}명` : '-';

        rows.push({
          id: `written-${challenge.challengeId}-${mission.missionId}`,
          type: 'written',
          startDate: scheduleStart || '',
          startTime: null,
          endTime: null,
          statusLabel: summary.statusLabel,
          statusTone: summary.statusTone,
          reservationLabel: null,
          submissionLabel,
          menteeParticipation: null,
          mentorParticipation: null,
          challengeTitle: challenge.title ?? '챌린지',
          thLabel: `${mission.th}회차`,
          scheduleLabel: formatWrittenSchedule(scheduleStart, scheduleEnd),
          menteeNameLabel,
          // 서면 상세는 제출자가 있을 때만 의미가 있다.
          canOpenDetail: mission.submittedCount > 0,
          source: {
            type: 'written',
            challengeId: challenge.challengeId,
            missionId: mission.missionId,
            missionTh: mission.th,
            challengeTitle: challenge.title ?? '챌린지',
          },
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
  }, [writtenChallenges, liveRounds, missionRangeMap]);
}

/**
 * 옵션 — 향후 API mission 응답을 가져와 missionRangeMap을 채울 때 사용.
 * 현재 selector는 mock override만 쓰지만, 다중 챌린지 API range를 합치고 싶을 때
 * 이 hook을 호출자가 함께 사용하면 missionRangeMap을 외부에서 주입할 수 있다.
 */
export function useApiMissionRangeMap(challengeId: number | undefined) {
  const { data } = useMentorMissionFeedbackListQuery(challengeId ?? 0, {
    enabled: !!challengeId,
  });
  return useMemo(
    () => buildMissionRangeMap(data?.missionList ?? []),
    [data],
  );
}
