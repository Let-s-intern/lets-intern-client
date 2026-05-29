import dayjs from '@/lib/dayjs';

import type { FeedbackStatus } from '@/api/feedback/feedbackSchema';
import { STATUS_BADGE } from '@/constants/statusColors';

/**
 * 라이브 피드백 모달에서 사용하는 4종 진행 상태.
 * PRD §5.4 정의표 + image copy 3.png 참고.
 *
 * - waiting:    예약 시간 전 (status=RESERVED, now < startAt)
 * - inProgress: 예약 시간 중 (status=RESERVED, startAt ≤ now < endAt)
 * - completed:  멘토/멘티 정상 참가 (status=COMPLETED)
 * - missed:     불참/취소 또는 종료 후 미진행 (status=CANCELED, 또는 RESERVED + now ≥ endAt)
 */
export type LiveFeedbackUiStatus =
  | 'waiting'
  | 'inProgress'
  | 'completed'
  | 'missed';

export interface LiveFeedbackBadgeVisual {
  /** 화면 표기 라벨 ("대기" / "진행중" / "완료" / "미완료") */
  label: string;
  /** STATUS_BADGE 토큰 (border + bg + text) */
  badgeClass: string;
}

const VISUALS: Record<LiveFeedbackUiStatus, LiveFeedbackBadgeVisual> = {
  waiting: { label: '대기', badgeClass: STATUS_BADGE.waiting },
  inProgress: { label: '진행중', badgeClass: STATUS_BADGE.inProgress },
  completed: { label: '완료', badgeClass: STATUS_BADGE.completed },
  missed: { label: '미완료', badgeClass: STATUS_BADGE.absent },
};

/**
 * `feedback.status` + 현재시각(now) + `startDate`/`endDate` 조합으로
 * 4종 UI 상태를 결정한다.
 *
 * 주의: BE의 자동 상태 전이는 미구현이므로 RESERVED 상태에서도 시간이
 * 지나면 FE가 "미완료"로 대체 표시한다 (PRD §5.4 mentor3.14 노트).
 */
export function resolveLiveFeedbackStatus(
  apiStatus: FeedbackStatus,
  startDate: string,
  endDate: string,
  now: Date,
): LiveFeedbackUiStatus {
  if (apiStatus === 'COMPLETED') return 'completed';
  if (apiStatus === 'CANCELED') return 'missed';

  // RESERVED: 시간으로 분기
  const nowMs = now.getTime();
  const startMs = dayjs(startDate).valueOf();
  const endMs = dayjs(endDate).valueOf();

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 'waiting';

  if (nowMs < startMs) return 'waiting';
  if (nowMs < endMs) return 'inProgress';
  // 시간이 지났는데도 RESERVED → 미참여로 간주
  return 'missed';
}

export function getLiveFeedbackBadgeVisual(
  status: LiveFeedbackUiStatus,
): LiveFeedbackBadgeVisual {
  return VISUALS[status];
}
