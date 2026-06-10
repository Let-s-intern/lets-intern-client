import dayjs from '@/lib/dayjs';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';

/**
 * 라이브 피드백 예약 행(FeedbackAdminVo)의 상태 진리표 리졸버.
 *
 * 출처: 기획 진리표(`.claude/tasks/image.png`).
 *
 * 진리표 전체는 `예약 상태(예약완료/미예약/예약취소)` × `제출 상태(제출완료/미제출)` ×
 * `진행일시(전/중/후)` × `멘토·멘티 출석`의 조합이지만, 예약 목록 VO는 구조상
 * "예약된 건"만 내려오므로(미예약·미제출 행을 만들 수 없다) 도달 가능한 케이스만 다룬다.
 * 즉 `submitted=true`, `reserved` 전제(멘토 앱과 동일 가정) 하에서 진행일시·출석으로 분기한다.
 *
 * 예약취소(CANCELED) → '취소' 표기는 기획에서 제거되어 미구현. 취소 행은 뱃지/출석 모두 '-'.
 */

/** 뱃지 색 토큰 선택용 의미값. */
export type LiveBadgeTone =
  | 'scheduled' // 진행 예정
  | 'inProgress' // 진행 중
  | 'completed' // 진행 완료
  | 'missed' // 미진행 / 미참여
  | 'needsCheck'; // 확인 필요

export interface LiveBadge {
  label: string;
  tone: LiveBadgeTone;
}

/** 출석 컬럼 표시값. PENDING(미체크) 또는 취소 건은 '-'. */
export type AttendanceLabel = '참여' | '미참여' | '-';

export interface AdminVoLiveSpec {
  mentorAttendance: AttendanceLabel;
  menteeAttendance: AttendanceLabel;
  mentorBadge: LiveBadge | null;
  menteeBadge: LiveBadge | null;
}

type SessionPhase = 'before' | 'during' | 'after';

const BADGE = {
  scheduled: { label: '진행 예정', tone: 'scheduled' },
  inProgress: { label: '진행 중', tone: 'inProgress' },
  completed: { label: '진행 완료', tone: 'completed' },
  missed: { label: '미진행', tone: 'missed' },
  absent: { label: '미참여', tone: 'missed' },
  needsCheck: { label: '확인 필요', tone: 'needsCheck' },
} as const satisfies Record<string, LiveBadge>;

/** 진행일시(now 기준) 분기. start 전 / 진행 중 / end 후. */
export function resolveSessionPhase(
  startDate: string,
  endDate: string,
  now: Date,
): SessionPhase {
  const nowMs = now.getTime();
  const startMs = dayjs(startDate).valueOf();
  const endMs = dayjs(endDate).valueOf();
  if (nowMs < startMs) return 'before';
  if (nowMs <= endMs) return 'during';
  return 'after';
}

function attendanceLabel(
  status: FeedbackAdminVo['mentorStatus'],
): AttendanceLabel {
  if (status === 'PRESENT') return '참여';
  if (status === 'ABSENT') return '미참여';
  return '-';
}

/**
 * 예약 행 + 현재시각 → 출석/뱃지 4종 표시값.
 *
 * 진행일시 분기:
 * - 전: 멘토·멘티 모두 '진행 예정'
 * - 중: 멘토·멘티 모두 '진행 중'
 * - 후:
 *   - 멘토: 참여 → '진행 완료', 그 외(미참여/미체크) → '미진행'
 *   - 멘티: 참여 + 멘토 참여 → '진행 완료'
 *           참여 + 멘토 미참여 → '확인 필요'
 *           그 외(미참여/미체크) → '미참여'
 */
export function resolveAdminVoLiveSpec(
  vo: FeedbackAdminVo,
  now: Date,
): AdminVoLiveSpec {
  if (vo.status === 'CANCELED') {
    return {
      mentorAttendance: '-',
      menteeAttendance: '-',
      mentorBadge: null,
      menteeBadge: null,
    };
  }

  const phase = resolveSessionPhase(vo.startDate, vo.endDate, now);
  const mentorAttendance = attendanceLabel(vo.mentorStatus);
  const menteeAttendance = attendanceLabel(vo.menteeStatus);

  if (phase === 'before') {
    return {
      mentorAttendance,
      menteeAttendance,
      mentorBadge: BADGE.scheduled,
      menteeBadge: BADGE.scheduled,
    };
  }

  if (phase === 'during') {
    return {
      mentorAttendance,
      menteeAttendance,
      mentorBadge: BADGE.inProgress,
      menteeBadge: BADGE.inProgress,
    };
  }

  // phase === 'after'
  const mentorPresent = vo.mentorStatus === 'PRESENT';
  const menteePresent = vo.menteeStatus === 'PRESENT';

  const mentorBadge = mentorPresent ? BADGE.completed : BADGE.missed;
  const menteeBadge = !menteePresent
    ? BADGE.absent
    : mentorPresent
      ? BADGE.completed
      : BADGE.needsCheck;

  return { mentorAttendance, menteeAttendance, mentorBadge, menteeBadge };
}

/** 예약 목록 행 배경 톤. */
export type RowTone = 'inProgress' | 'green' | 'red' | 'gray' | 'none';

/**
 * 멘토·멘티 참여(출석) 조합으로 행 배경 톤을 결정한다(기획 2026-06-09).
 * - 진행 중(now 가 예약 시간대 내) → 강조(inProgress) — 최우선
 * - 아직 진행 안 한 진행 예정 → 흰색(none)
 * - 둘 다 참여 → 초록(green)
 * - 둘 중 하나만 참여 → 빨강(red)
 * - 둘 다 미참여(그 외 미참여 상태) → 진한 회색(gray)
 * - 취소 등 뱃지 없는 행 → 흰색(none)
 */
export function resolveRowTone(spec: AdminVoLiveSpec): RowTone {
  if (!spec.mentorBadge && !spec.menteeBadge) return 'none';
  // 진행 중 세션은 출석 조합과 무관하게 강조한다(최우선).
  if (
    spec.mentorBadge?.tone === 'inProgress' ||
    spec.menteeBadge?.tone === 'inProgress'
  )
    return 'inProgress';
  // 아직 시작 전(진행 예정) → 흰색
  if (
    spec.mentorBadge?.tone === 'scheduled' &&
    spec.menteeBadge?.tone === 'scheduled'
  )
    return 'none';
  const presentCount =
    (spec.mentorAttendance === '참여' ? 1 : 0) +
    (spec.menteeAttendance === '참여' ? 1 : 0);
  if (presentCount === 2) return 'green';
  if (presentCount === 1) return 'red';
  return 'gray';
}
