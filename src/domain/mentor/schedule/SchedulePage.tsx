'use client';

import { useState } from 'react';

import { useMediaQuery } from '@mui/material';

import WelcomeMessage from './ui/WelcomeMessage';
import WeeklySummary from './ui/WeeklySummary';
import ChallengeFilter from './ui/ChallengeFilter';
import ChallengeDataFetcher from './ui/ChallengeDataFetcher';
import WeeklyCalendar from './weekly-calendar/WeeklyCalendar';
import FeedbackModal from '../feedback/FeedbackModal';
import MobileFeedbackPage from '../feedback/ui/MobileFeedbackPage';

import { useWeeklySummary } from './hooks/useWeeklySummary';
import { useScheduleData } from './hooks/useScheduleData';

const SchedulePage = () => {
  const {
    challenges,
    selectedChallengeId,
    setSelectedChallengeId,
    allBarsUnfiltered,
    filteredBars,
    handleData,
    challengeFilterItems,
    findNearestDate,
  } = useScheduleData();

  const { totalCount, todayDueCount, incompleteCount, completedCount } =
    useWeeklySummary(allBarsUnfiltered);

  const [targetScrollDate, setTargetScrollDate] = useState<Date | null>(null);

  const handleChallengeSelect = (challengeId: number | null) => {
    if (challengeId === null || challengeId === selectedChallengeId) {
      setSelectedChallengeId(null);
      setTargetScrollDate(null);
      return;
    }
    setSelectedChallengeId(challengeId);
    const nearest = findNearestDate(challengeId);
    if (nearest) {
      setTargetScrollDate(nearest);
    }
  };

  const isMobile = useMediaQuery('(max-width: 767px)');

  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    challengeId: number;
    missionId: number;
    challengeTitle?: string;
    missionTh?: number;
  }>({ isOpen: false, challengeId: 0, missionId: 0 });

  const handleBarClick = (challengeId: number, missionId: number) => {
    const bar = allBarsUnfiltered.find(
      (b) => b.challengeId === challengeId && b.missionId === missionId,
    );
    setFeedbackModal({
      isOpen: true,
      challengeId,
      missionId,
      challengeTitle: bar?.challengeTitle,
      missionTh: bar?.th,
    });
  };

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div className="flex items-center gap-2.5">
        <h1 className="text-xl font-semibold leading-8 text-neutral-900">
          프로그램 일정
        </h1>
      </div>

      <WelcomeMessage />

      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-6">
          <WeeklySummary
            totalCount={totalCount}
            todayDueCount={todayDueCount}
            incompleteCount={incompleteCount}
            completedCount={completedCount}
          />

          <div className="flex flex-col gap-4">
            <ChallengeFilter
              challenges={challengeFilterItems}
              selectedChallengeId={selectedChallengeId}
              onSelect={handleChallengeSelect}
            />

            <WeeklyCalendar
              bars={filteredBars}
              allBars={allBarsUnfiltered}
              onBarClick={handleBarClick}
              targetScrollDate={targetScrollDate}
            />
          </div>
        </div>
      </div>

      {challenges.map((c, i) => (
        <ChallengeDataFetcher
          key={c.challengeId}
          challenge={c}
          colorIndex={i}
          onData={handleData}
        />
      ))}

      {isMobile ? (
        <MobileFeedbackPage
          isOpen={feedbackModal.isOpen}
          onClose={() =>
            setFeedbackModal((prev) => ({ ...prev, isOpen: false }))
          }
          challengeId={feedbackModal.challengeId}
          missionId={feedbackModal.missionId}
          challengeTitle={feedbackModal.challengeTitle}
          missionTh={feedbackModal.missionTh}
        />
      ) : (
        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={() =>
            setFeedbackModal((prev) => ({ ...prev, isOpen: false }))
          }
          challengeId={feedbackModal.challengeId}
          missionId={feedbackModal.missionId}
          challengeTitle={feedbackModal.challengeTitle}
          missionTh={feedbackModal.missionTh}
        />
      )}
    </div>
  );
};

export default SchedulePage;
