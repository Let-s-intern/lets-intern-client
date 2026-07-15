import dayjs from '@/lib/dayjs';

/** T-10 룰: 시작 10분 전부터 라이브 회의실 활성 (PRD §5.4 mentor3.13). */
export const LIVE_FEEDBACK_ACTIVATION_LEAD_MS = 10 * 60 * 1000;

/**
 * 라이브 피드백 회의실 표시 상태.
 *
 * - `unassigned`: `meetingUrl === null` → 회색 "미정" 표시
 * - `pending`:    `meetingUrl` 있음, T-10 이전 → 회색 + "10분 전 자동 배정" 안내
 * - `active`:     `meetingUrl` 있음, T-10 이내 + endAt 이전 → 클릭 가능
 * - `ended`:      `meetingUrl` 있음, 종료 이후 → 회색 + 종료 안내
 *
 * 첫 인자의 의미는 "BE가 내려준 URL" → "프론트가 만든 URL or null"로
 * 재해석되었지만 시그니처 자체는 변하지 않는다 (Jitsi 도입).
 */
export type LiveFeedbackAccessState =
  | 'unassigned'
  | 'pending'
  | 'active'
  | 'ended';

export interface LiveFeedbackAccess {
  state: LiveFeedbackAccessState;
  /** state === 'active' 일 때만 사용할 수 있는 URL. 그 외에는 null. */
  url: string | null;
}

/**
 * `meetingUrl` × 현재시각 × `startDate`/`endDate` 조합으로 라이브 회의실
 * 활성 여부를 결정한다.
 *
 * - `meetingUrl` null → 무조건 `unassigned`
 * - `now ≥ endAt`     → `ended`
 * - `now ≥ startAt - 10분` → `active` (시작 10분 전부터)
 * - 그 외              → `pending`
 */
export function resolveLiveFeedbackAccess(
  meetingUrl: string | null,
  startDate: string,
  endDate: string,
  now: Date,
): LiveFeedbackAccess {
  if (!meetingUrl) {
    return { state: 'unassigned', url: null };
  }

  const nowMs = now.getTime();
  const startMs = dayjs(startDate).valueOf();
  const endMs = dayjs(endDate).valueOf();

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return { state: 'pending', url: null };
  }

  if (nowMs >= endMs) {
    return { state: 'ended', url: null };
  }

  const activationMs = startMs - LIVE_FEEDBACK_ACTIVATION_LEAD_MS;
  if (nowMs >= activationMs) {
    return { state: 'active', url: meetingUrl };
  }
  return { state: 'pending', url: null };
}
