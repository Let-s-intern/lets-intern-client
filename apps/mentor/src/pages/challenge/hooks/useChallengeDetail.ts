import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMentorMissionFeedbackListQuery } from '@/api/challenge/challenge';
import { useMentorChallengeListQuery } from '@/api/user/user';

interface FeedbackModalState {
  isOpen: boolean;
  missionId: number;
  missionTh: number;
}

/**
 * Manages challenge detail page data and feedback modal state.
 */
export function useChallengeDetail() {
  const params = useParams<{ challengeId: string }>();
  const challengeId = Number(params.challengeId);

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    missionId: 0,
    missionTh: 0,
  });

  // Get challenge title from list
  const { data: challengeListData } = useMentorChallengeListQuery();
  const challenge = challengeListData?.myChallengeMentorVoList.find(
    (c) => c.challengeId === challengeId,
  );
  const challengeTitle = challenge?.title ?? '';

  // Get mission list
  const { data: missionData, isLoading } =
    useMentorMissionFeedbackListQuery(challengeId);
  const missions = missionData?.missionList ?? [];

  const handleClickFeedback = (missionId: number, missionTh: number) => {
    setFeedbackModal({ isOpen: true, missionId, missionTh });
  };

  const handleCloseModal = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    challengeId,
    challenge,
    challengeTitle,
    missions,
    isLoading,
    feedbackModal,
    handleClickFeedback,
    handleCloseModal,
  };
}
