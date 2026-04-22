'use client';

import { useMemo, useState } from 'react';

import { useMediaQuery } from '@mui/material';

import FeedbackModal from '../feedback/FeedbackModal';
import MobileFeedbackPage from '../feedback/ui/MobileFeedbackPage';
import ChallengeDataFetcher from './ui/ChallengeDataFetcher';
import ChallengeFilter from './ui/ChallengeFilter';
import WeeklySummary from './ui/WeeklySummary';
import WelcomeMessage from './ui/WelcomeMessage';
import WeeklyCalendar from './weekly-calendar/WeeklyCalendar';

import {
  MENTOR_OPEN_SCHEDULE_MOCK,
  type MentorOpenSlot,
} from './challenge-content/mentorOpenScheduleMock';
import { useLiveFeedbackData } from './hooks/useLiveFeedbackData';
import { useScheduleData } from './hooks/useScheduleData';
import { useWeeklySummary } from './hooks/useWeeklySummary';
import { useWrittenFeedbackMockData } from './hooks/useWrittenFeedbackMockData';
import LiveFeedbackReservationModal from './modal/LiveFeedbackReservationModal';
import MentorOpenScheduleModal from './modal/MentorOpenScheduleModal';
import type { PeriodBarData } from './types';

const SchedulePage = () => {
  const { bars: writtenMockBars } = useWrittenFeedbackMockData();
  const liveFeedbackBars = useLiveFeedbackData();

  // 서면 + 라이브 mock 모두 extraBars로 주입 → 색상 재매핑과 태그 네비게이션에 투과
  const extraBars = useMemo(
    () => [...writtenMockBars, ...liveFeedbackBars],
    [writtenMockBars, liveFeedbackBars],
  );

  const {
    challenges,
    selectedChallengeId,
    setSelectedChallengeId,
    allBarsUnfiltered,
    filteredBars,
    handleData,
    challengeFilterItems,
    findNearestDate,
    findNextDate,
  } = useScheduleData({ extraBars });

  // 라이브 세션 바만 따로 추출 — LiveFeedbackReservationModal 네비게이션용
  const filteredLiveSessionBars = useMemo(
    () => filteredBars.filter((b) => b.barType === 'live-feedback'),
    [filteredBars],
  );

  const { totalCount, todayDueCount, incompleteCount, completedCount } =
    useWeeklySummary(allBarsUnfiltered);

  const [targetScrollDate, setTargetScrollDate] = useState<Date | null>(null);

  const handleChallengeSelect = (challengeId: number | null) => {
    if (challengeId === null) {
      setSelectedChallengeId(null);
      setTargetScrollDate(null);
      return;
    }
    if (challengeId === selectedChallengeId && targetScrollDate) {
      // 같은 태그 재클릭 → 다음 피드백 일정으로 이동
      const next = findNextDate(challengeId, targetScrollDate);
      if (next) {
        setTargetScrollDate(next);
      }
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

  const [isMentorOpenModalOpen, setIsMentorOpenModalOpen] = useState(false);
  const [mentorOpenSlots, setMentorOpenSlots] = useState<MentorOpenSlot[]>(
    MENTOR_OPEN_SCHEDULE_MOCK,
  );
  const [selectedLiveFeedbackBar, setSelectedLiveFeedbackBar] =
    useState<PeriodBarData | null>(null);

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
    <div className="flex flex-col gap-6 pb-20 md:gap-10">
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
              onMentorOpenPeriodClick={() => setIsMentorOpenModalOpen(true)}
              onLiveFeedbackTimeBlockClick={(bar) =>
                setSelectedLiveFeedbackBar(bar)
              }
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

      <MentorOpenScheduleModal
        isOpen={isMentorOpenModalOpen}
        onClose={() => setIsMentorOpenModalOpen(false)}
        initialSlots={mentorOpenSlots}
        onSave={(slots) => {
          // TODO: API 연동 시 이 지점에서 서버 저장으로 교체
          setMentorOpenSlots(slots);
        }}
      />
      <LiveFeedbackReservationModal
        isOpen={!!selectedLiveFeedbackBar}
        onClose={() => setSelectedLiveFeedbackBar(null)}
        bar={selectedLiveFeedbackBar}
        liveFeedbackBars={filteredLiveSessionBars}
        onSelectBar={setSelectedLiveFeedbackBar}
      />
    </div>
  );
};

export default SchedulePage;
