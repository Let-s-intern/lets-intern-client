import { useMemo, useState } from 'react';

import { useMentorFeedbackManagementQuery } from '@/api/challenge/challenge';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';

type Challenge = MentorFeedbackManagement['challengeList'][number];

interface FeedbackModalState {
  isOpen: boolean;
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
}

// 피드백 작성 가능 유예 기간 (admin FeedbackMissionList 의 "마감 후 +3일" 컨벤션과 동일).
// 챌린지가 끝나도 이 유예 기간 안에는 멘토가 피드백을 마저 쓸 수 있어야 하므로
// 카드 노출 컷오프는 challenge.endDate 가 아니라 endDate + N일 로 잡는다.
const FEEDBACK_GRACE_DAYS = 3;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Manages feedback management page data and modal state.
 */
export function useFeedbackManagement() {
  const { data, isLoading } = useMentorFeedbackManagementQuery();

  const challengeList = useMemo(() => {
    const list = data?.challengeList ?? [];
    const now = Date.now();
    return list.filter((c) => {
      if (!c.endDate) return true;
      const deadline = new Date(c.endDate).getTime();
      if (Number.isNaN(deadline)) return true;
      return deadline + FEEDBACK_GRACE_DAYS * MILLISECONDS_PER_DAY >= now;
    });
  }, [data]);

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    challengeId: 0,
    missionId: 0,
  });

  const handleMissionClick = (
    challenge: Challenge,
    missionId: number,
    missionTh: number,
  ) => {
    setFeedbackModal({
      isOpen: true,
      challengeId: challenge.challengeId,
      missionId,
      challengeTitle: challenge.title ?? undefined,
      missionTh,
    });
  };

  const handleCloseModal = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    challengeList,
    isLoading,
    feedbackModal,
    handleMissionClick,
    handleCloseModal,
  };
}
