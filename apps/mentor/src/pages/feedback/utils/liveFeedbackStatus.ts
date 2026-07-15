import dayjs from '@/lib/dayjs';

import type {
  AttendanceStatus,
  FeedbackAttendanceStatus,
  FeedbackStatus,
} from '@/api/feedback/feedbackSchema';
import { STATUS_BADGE, LIVE_CARD_BADGE } from '@/constants/statusColors';

/**
 * 라이브 피드백 모달에서 사용하는 4종 진행 상태.
 * PRD §5.4 정의표 + image copy 3.png 참고.
 *
 * - waiting:    예약 시간 전 (status=RESERVED, now < startAt)
 * - inProgress: 예약 시간 중 (status=RESERVED, startAt ≤ now < endAt)
 * - completed:  멘토/멘티 정상 참가 (status=COMPLETED)
 * - missed:     멘토가 라이브에 입장하지 않음 (RESERVED + now ≥ endAt + 멘토 미출석)
 * - cancelled:  멘티가 예약 후 경험정리 미제출(attendanceStatus LATE|ABSENT) 또는 예약취소(status=CANCELED)
 */
export type LiveFeedbackUiStatus =
  | 'waiting'
  | 'inProgress'
  | 'completed'
  | 'missed'
  | 'cancelled';

/** 피드백 내역 테이블 statusTone 중 라이브 5상태가 쓰는 키. */
export type LiveStatusTone =
  | 'liveWaiting'
  | 'inProgress'
  | 'liveCompleted'
  | 'liveMissed'
  | 'liveCancelled';

export interface LiveFeedbackBadgeVisual {
  /** 화면 표기 라벨 ("진행 예정" / "진행 중" / "진행 완료" / "미진행" / "취소") */
  label: string;
  /** 표준 배지 토큰 (border+bg+text) — 모달·내역 테이블·예약·멘티리스트·헤더 */
  badgeClass: string;
  /** 캘린더 카드 전용 컴팩트 배지 토큰 */
  cardBadgeClass: string;
  /** 내역 테이블 statusTone 키 (StatusCell 이 STATUS_BADGE[tone] 로 색 변환) */
  tone: LiveStatusTone;
}

/**
 * 라이브 5상태 → {라벨, 색} **단일 소스(SSOT)**.
 * 모든 화면(캘린더 카드/모달/내역 테이블/예약현황/멘티리스트/헤더)이 여기만 참조한다.
 * 색을 바꾸려면 이 표(또는 statusColors 토큰)만 고치면 전 화면에 반영된다.
 */
const VISUALS: Record<LiveFeedbackUiStatus, LiveFeedbackBadgeVisual> = {
  waiting: {
    label: '진행 예정',
    badgeClass: STATUS_BADGE.liveWaiting,
    cardBadgeClass: LIVE_CARD_BADGE.waiting,
    tone: 'liveWaiting',
  },
  inProgress: {
    label: '진행 중',
    badgeClass: STATUS_BADGE.inProgress,
    cardBadgeClass: LIVE_CARD_BADGE.inProgress,
    tone: 'inProgress',
  },
  completed: {
    label: '진행 완료',
    badgeClass: STATUS_BADGE.liveCompleted,
    cardBadgeClass: LIVE_CARD_BADGE.completed,
    tone: 'liveCompleted',
  },
  // 미진행 = 멘토가 라이브에 입장하지 않은 경우 (solid 빨강)
  missed: {
    label: '미진행',
    badgeClass: STATUS_BADGE.liveMissed,
    cardBadgeClass: LIVE_CARD_BADGE.missed,
    tone: 'liveMissed',
  },
  // 취소 = 멘티가 예약 후 경험정리 미제출 또는 예약취소 (연빨강)
  cancelled: {
    label: '취소',
    badgeClass: STATUS_BADGE.liveCancelled,
    cardBadgeClass: LIVE_CARD_BADGE.cancelled,
    tone: 'liveCancelled',
  },
};

/**
 * `feedback.status` + 현재시각(now) + `startDate`/`endDate` 조합으로
 * 4종 UI 상태를 결정한다.
 *
 * 주의: BE의 자동 상태 전이는 미구현이므로 RESERVED 상태에서도 시간이
 * 지나면 FE가 "미진행"으로 대체 표시한다 (PRD §5.4 mentor3.14 노트).
 */
/**
 * 라이브 세션 진행 상태를 `경험정리 제출 + BE status + 멘토 출석 + 시간`으로 결정한다.
 *
 * BE가 종료 후에도 `status`를 RESERVED로 유지하고 출석(mentorStatus/menteeStatus)만
 * 채우는 경우가 있어, 시간만으로 판정하면 "정상 진행된 세션"이 '미진행'으로 잘못 표시된다.
 * → 종료 후 RESERVED 건은 출석으로 완료/미진행을 가른다.
 *
 * 완료 판정(PRD §2·§3): 종료 후 **멘토가 출석(PRESENT)하면 진행 완료**(멘티 출석 무관).
 * 멘토 미참여면 미진행. (기존 "양측 PRESENT" 조건을 "멘토 PRESENT"로 완화.)
 *
 * - 미제출(attendanceStatus LATE|ABSENT) → cancelled(취소)  (최우선, 시각·출석 무관)
 * - CANCELED(예약취소)  → cancelled(취소)
 * - COMPLETED           → completed
 * - 시작 전             → waiting
 * - 진행 중             → inProgress
 * - 종료 후 + 멘토 출석  → completed
 * - 종료 후 + 멘토 미입장 → missed(미진행)
 *
 * 출석 인자를 생략하면 PENDING으로 보아 기존(시간 기준) 동작과 동일하다(하위 호환).
 */
export function resolveLiveSessionStatus(input: {
  rawStatus: FeedbackStatus;
  mentorStatus?: FeedbackAttendanceStatus;
  /**
   * 멘티 라이브 출석. 완료 판정에는 더 이상 영향 없음(멘토 출석만으로 완료).
   * 호출부 호환·향후 확장을 위해 시그니처는 유지한다.
   */
  menteeStatus?: FeedbackAttendanceStatus;
  /**
   * 경험정리(서면) 제출 상태. `LATE`|`ABSENT`(미제출)이면 최우선으로 미진행 처리한다.
   * 미전달 시 미제출 판정을 생략하고 기존 로직을 따른다(하위 호환).
   */
  attendanceStatus?: AttendanceStatus;
  startDate: string;
  endDate: string;
  now: Date;
}): LiveFeedbackUiStatus {
  const { rawStatus, mentorStatus, attendanceStatus, startDate, endDate, now } =
    input;

  // 최우선: 경험정리 미제출(LATE|ABSENT)이면 시각·출석과 무관하게 '취소'.
  if (attendanceStatus === 'LATE' || attendanceStatus === 'ABSENT')
    return 'cancelled';

  // 예약취소(BE CANCELED)도 '취소'.
  if (rawStatus === 'CANCELED') return 'cancelled';
  if (rawStatus === 'COMPLETED') return 'completed';

  // RESERVED: 시간으로 분기
  const nowMs = now.getTime();
  const startMs = dayjs(startDate).valueOf();
  const endMs = dayjs(endDate).valueOf();

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 'waiting';
  if (nowMs < startMs) return 'waiting';
  if (nowMs < endMs) return 'inProgress';
  // 종료 후 RESERVED → 멘토 출석만으로 완료/미진행 분기 (멘티 출석 무관).
  if (mentorStatus === 'PRESENT') return 'completed';
  return 'missed';
}

/** @deprecated `resolveLiveSessionStatus` 사용. 출석 없이 status+시간만으로 판정(하위 호환). */
export function resolveLiveFeedbackStatus(
  apiStatus: FeedbackStatus,
  startDate: string,
  endDate: string,
  now: Date,
): LiveFeedbackUiStatus {
  return resolveLiveSessionStatus({
    rawStatus: apiStatus,
    startDate,
    endDate,
    now,
  });
}

export function getLiveFeedbackBadgeVisual(
  status: LiveFeedbackUiStatus,
): LiveFeedbackBadgeVisual {
  return VISUALS[status];
}

/**
 * 캘린더 바의 축약 상태(`LiveFeedbackInfo['status']`)를 4종 UI 상태로 환산.
 * 캘린더·모달(멘티 리스트/카운트/하단 배지)이 같은 4상태·색을 쓰도록 통일하는 진입점.
 */
export type LiveBadgeStatus =
  | 'waiting'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'mentor-absent'
  | 'mentee-absent'
  | 'mentor-late'
  | 'mentee-late';

export function badgeStatusToUi(
  status: LiveBadgeStatus | null | undefined,
): LiveFeedbackUiStatus {
  switch (status) {
    case 'completed':
      return 'completed';
    case 'in-progress':
      return 'inProgress';
    case 'cancelled':
      return 'cancelled';
    case 'mentor-absent':
    case 'mentee-absent':
    case 'mentor-late':
    case 'mentee-late':
      return 'missed';
    default:
      return 'waiting';
  }
}
