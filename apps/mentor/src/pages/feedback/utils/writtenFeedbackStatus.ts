import {
  FeedbackStatusMapping,
  type FeedbackStatus,
} from '@/api/challenge/challengeSchema';
import { STATUS_BADGE } from '@/constants/statusColors';

/**
 * 서면 피드백 "피드백 상태" 배지 시각 정보.
 * 라이브 피드백(`getLiveFeedbackBadgeVisual`)과 **같은 STATUS_BADGE 토큰**을 써
 * 두 모달의 상태 배지 디자인을 일치시킨다.
 */
export interface WrittenFeedbackBadgeVisual {
  /** 화면 표기 라벨 (진행전 / 진행중 / 진행완료 / 확인완료 / 미제출) */
  label: string;
  /** STATUS_BADGE 토큰 (border + bg + text) */
  badgeClass: string;
}

const BADGE_BY_STATUS: Record<FeedbackStatus, string> = {
  WAITING: STATUS_BADGE.waiting,
  IN_PROGRESS: STATUS_BADGE.inProgress,
  COMPLETED: STATUS_BADGE.completed,
  CONFIRMED: STATUS_BADGE.completed,
};

/**
 * 서면 피드백 상태 배지 시각 정보를 도출한다.
 * - 미제출(ABSENT) → '미제출' (notSubmitted 톤)
 * - 그 외          → feedbackStatus 매핑 라벨 + 상태별 색
 */
export function getWrittenFeedbackBadgeVisual(
  status: FeedbackStatus | null,
  isAbsent: boolean,
): WrittenFeedbackBadgeVisual {
  if (isAbsent) {
    return { label: '미제출', badgeClass: STATUS_BADGE.notSubmitted };
  }
  const resolved = status ?? 'WAITING';
  return {
    label: FeedbackStatusMapping[resolved],
    badgeClass: BADGE_BY_STATUS[resolved],
  };
}
