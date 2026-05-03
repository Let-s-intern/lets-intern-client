import { useState } from 'react';

import { useMentorFeedbackManagementQuery } from '@/api/challenge/challenge';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';

type Challenge = MentorFeedbackManagement['challengeList'][number];

interface FeedbackModalState {
  isOpen: boolean;
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
  colorIndex?: number;
}

/**
 * Manages feedback management page data and modal state.
 */
export function useFeedbackManagement() {
  const { data, isLoading } = useMentorFeedbackManagementQuery();
  const challengeList = data?.challengeList ?? [];

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    challengeId: 0,
    missionId: 0,
  });

  const handleMissionClick = (
    challenge: Challenge,
    missionId: number,
    missionTh: number,
    colorIndex?: number,
  ) => {
    setFeedbackModal({
      isOpen: true,
      challengeId: challenge.challengeId,
      missionId,
      challengeTitle: challenge.title ?? undefined,
      missionTh,
      colorIndex,
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
