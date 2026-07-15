'use client';

import { useMediaQuery } from '@mui/material';

import FeedbackModal from '@/pages/feedback/FeedbackModal';
import MobileFeedbackPage from '@/pages/feedback/ui/MobileFeedbackPage';
import LiveFeedbackReservationModal from '@/pages/schedule/modal/LiveFeedbackReservationModal';
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
    liveModalBar,
    liveSelectedRound,
    allSessionBars,
    setLiveModalBar,
    closeLiveModal,
    canOpenLiveMission,
    liveMenteeCount,
  } = useChallengeDetail();

  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <div className="flex-1 p-4 md:p-8">
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
        canOpenLiveMission={canOpenLiveMission}
        liveMenteeCount={liveMenteeCount}
      />

      {isMobile ? (
        <MobileFeedbackPage
          isOpen={feedbackModal.isOpen}
          onClose={handleCloseModal}
          challengeId={challengeId}
          missionId={feedbackModal.missionId}
          challengeTitle={challengeTitle}
          missionTh={feedbackModal.missionTh}
        />
      ) : (
        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={handleCloseModal}
          challengeId={challengeId}
          missionId={feedbackModal.missionId}
          challengeTitle={challengeTitle}
          missionTh={feedbackModal.missionTh}
        />
      )}

      {/* 라이브 피드백 미션 → 라이브 예약/진행 모달 (피드백 현황과 동일 컴포넌트 재사용) */}
      <LiveFeedbackReservationModal
        isOpen={!!liveModalBar}
        onClose={closeLiveModal}
        bar={liveModalBar}
        liveFeedbackBars={liveSelectedRound?.sessionBars ?? allSessionBars}
        onSelectBar={setLiveModalBar}
        roundTh={liveSelectedRound?.th}
      />
    </div>
  );
};

export default ChallengeDetailPage;
