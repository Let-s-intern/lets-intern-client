'use client';

import { useMediaQuery } from '@mui/material';

import FeedbackModal from '@/pages/feedback/FeedbackModal';
import MobileFeedbackPage from '@/pages/feedback/ui/MobileFeedbackPage';
import ChallengeFeedbackCard from './ui/ChallengeFeedbackCard';
import { useFeedbackManagement } from './hooks/useFeedbackManagement';

const FeedbackManagementPage = () => {
  const {
    challengeList,
    isLoading,
    feedbackModal,
    handleMissionClick,
    handleCloseModal,
  } = useFeedbackManagement();

  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <div className="flex flex-col gap-4 pb-20 md:gap-6 md:pb-0">
      <h1 className="text-lg font-semibold leading-7 text-neutral-900 md:text-xl md:leading-8">
        피드백 현황
      </h1>

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">로딩 중...</div>
      ) : challengeList.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          참여 중인 챌린지가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          {challengeList.map((challenge) => (
            <ChallengeFeedbackCard
              key={challenge.challengeId}
              challenge={challenge}
              onMissionClick={handleMissionClick}
            />
          ))}
        </div>
      )}

      {/* Mobile: full-page editor / Desktop: modal */}
      {isMobile ? (
        <MobileFeedbackPage
          isOpen={feedbackModal.isOpen}
          onClose={handleCloseModal}
          challengeId={feedbackModal.challengeId}
          missionId={feedbackModal.missionId}
          challengeTitle={feedbackModal.challengeTitle}
          missionTh={feedbackModal.missionTh}
        />
      ) : (
        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={handleCloseModal}
          challengeId={feedbackModal.challengeId}
          missionId={feedbackModal.missionId}
          challengeTitle={feedbackModal.challengeTitle}
          missionTh={feedbackModal.missionTh}
        />
      )}
    </div>
  );
};

export default FeedbackManagementPage;
