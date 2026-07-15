import { type FeedbackStatus } from '@/api/challenge/challengeSchema';
import { STATUS_BADGE } from '@/constants/statusColors';

/**
 * 서면 피드백 "피드백 상태" 배지 시각 정보.
 * 라이브 피드백(`getLiveFeedbackBadgeVisual`)과 **같은 STATUS_BADGE 토큰**을 써
 * 두 모달의 상태 배지 디자인을 일치시킨다.
 */
export interface WrittenFeedbackBadgeVisual {
  /** 화면 표기 라벨 (진행 전 / 진행 중 / 완료 / 미제출) */
  label: string;
  /** STATUS_BADGE 토큰 (bg + text) */
  badgeClass: string;
}

const BADGE_BY_STATUS: Record<FeedbackStatus, string> = {
  WAITING: STATUS_BADGE.liveWaiting,
  IN_PROGRESS: STATUS_BADGE.inProgress,
  COMPLETED: STATUS_BADGE.liveCompleted,
  CONFIRMED: STATUS_BADGE.liveCompleted,
};

/**
 * 서면 상태 라벨(서면 어휘). 색(tone)만 라이브에 맞추고 이름은 서면대로 둔다.
 * 공유 상수 `FeedbackStatusMapping`(진행전/진행중/진행완료/확인완료)은 수정하지 않고
 * 이 파일 내부에서만 서면 어휘로 치환한다: 진행 전 / 진행 중 / 완료.
 */
const LABEL_BY_STATUS: Record<FeedbackStatus, string> = {
  WAITING: '진행 전',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  CONFIRMED: '완료',
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
    label: LABEL_BY_STATUS[resolved],
    badgeClass: BADGE_BY_STATUS[resolved],
  };
}
