'use client';

import { useState } from 'react';

import { useMentorFeedbackManagementQuery } from '@/api/challenge/challenge';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import FeedbackModal from '@/domain/mentor/feedback/FeedbackModal';

import ChallengeFeedbackCard from './ChallengeFeedbackCard';

type Challenge = MentorFeedbackManagement['challengeList'][number];

const FeedbackManagementPage = () => {
  const { data, isLoading } = useMentorFeedbackManagementQuery();
  const challengeList = data?.challengeList ?? [];

  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    challengeId: number;
    missionId: number;
    challengeTitle?: string;
    missionTh?: number;
  }>({ isOpen: false, challengeId: 0, missionId: 0 });

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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold leading-8 text-neutral-900">
        피드백 현황
      </h1>

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">로딩 중...</div>
      ) : challengeList.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          참여 중인 챌린지가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {challengeList.map((challenge) => (
            <ChallengeFeedbackCard
              key={challenge.challengeId}
              challenge={challenge}
              onMissionClick={handleMissionClick}
            />
          ))}
        </div>
      )}

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={handleCloseModal}
        challengeId={feedbackModal.challengeId}
        missionId={feedbackModal.missionId}
        challengeTitle={feedbackModal.challengeTitle}
        missionTh={feedbackModal.missionTh}
      />
    </div>
  );
};

export default FeedbackManagementPage;
