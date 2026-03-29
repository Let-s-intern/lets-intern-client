'use client';

import FeedbackModal from '@/domain/mentor/feedback/FeedbackModal';
import ChallengeDetailContent from './ui/ChallengeDetailContent';
import { useChallengeDetail } from './hooks/useChallengeDetail';

const ChallengeDetailPage = () => {
  const {
    challengeId,
    challenge,
    challengeTitle,
    missions,
    isLoading,
    feedbackModal,
    handleClickFeedback,
    handleCloseModal,
  } = useChallengeDetail();

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{challengeTitle}</h1>
        {challenge ? (
          <p className="mt-1 text-sm text-gray-500">{challenge.shortDesc}</p>
        ) : null}
      </div>

      <ChallengeDetailContent
        challengeId={challengeId}
        missions={missions}
        isLoading={isLoading}
        onClickFeedback={handleClickFeedback}
      />

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={handleCloseModal}
        challengeId={challengeId}
        missionId={feedbackModal.missionId}
        challengeTitle={challengeTitle}
        missionTh={feedbackModal.missionTh}
      />
    </div>
  );
};

export default ChallengeDetailPage;
