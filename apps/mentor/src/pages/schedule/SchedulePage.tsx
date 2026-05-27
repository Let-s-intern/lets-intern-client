import { useMemo, useState } from 'react';

import { useMediaQuery } from '@mui/material';

import FeedbackAvailabilityModal from '@/pages/feedback-live-availability/FeedbackAvailabilityModal';

import FeedbackModal from '../feedback/FeedbackModal';
import MobileFeedbackPage from '../feedback/ui/MobileFeedbackPage';
import ChallengeDataFetcher from './ui/ChallengeDataFetcher';
import FeedbackTagFilter from './ui/FeedbackTagFilter';
import WelcomeMessage from './ui/WelcomeMessage';
import WeeklyCalendar from './weekly-calendar/WeeklyCalendar';

import type { FeedbackTagType } from './constants/feedbackTag';
import { useLiveFeedbackData } from './hooks/useLiveFeedbackData';
import { useScheduleData } from './hooks/useScheduleData';
import LiveFeedbackReservationModal from './modal/LiveFeedbackReservationModal';
import type { PeriodBarData } from './types';

const SchedulePage = () => {
  // 라이브 바는 실 API 파생. 서면 바는 ChallengeDataFetcher(실 API) 단일 경로로
  // 일원화되어 별도 extraBars 주입이 필요 없다 (중복 오버레이 제거).
  const { bars: liveFeedbackBars } = useLiveFeedbackData();

  const extraBars = liveFeedbackBars;

  const {
    challenges,
    selectedFeedbackTags,
    toggleFeedbackTag,
    clearFeedbackTags,
    allBarsUnfiltered,
    filteredBars,
    handleData,
    findNearestDateForTag,
    findNextDateForTag,
  } = useScheduleData({ extraBars });

  // 라이브 세션 바만 따로 추출 — LiveFeedbackReservationModal 네비게이션용
  const filteredLiveSessionBars = useMemo(
    () => filteredBars.filter((b) => b.barType === 'live-feedback'),
    [filteredBars],
  );

  // 캘린더 가로 스크롤 타겟 — 태그 클릭/재클릭으로 갱신.
  const [targetScrollDate, setTargetScrollDate] = useState<Date | null>(null);

  /**
   * 태그 클릭 동작 — 단일 선택 토글 + 해당 일정 위치로 스크롤.
   *  1) 비선택 태그 클릭: 그 태그만 선택 + 가장 가까운 일정으로 이동
   *  2) 선택된 태그 재클릭: 같은 태그의 다음 일정으로 순환
   */
  const handleTagClick = (tag: FeedbackTagType) => {
    if (selectedFeedbackTags.has(tag)) {
      const current = targetScrollDate ?? findNearestDateForTag(tag);
      const next = current
        ? findNextDateForTag(tag, current)
        : findNearestDateForTag(tag);
      if (next) setTargetScrollDate(next);
      return;
    }
    clearFeedbackTags();
    toggleFeedbackTag(tag);
    const nearest = findNearestDateForTag(tag);
    if (nearest) setTargetScrollDate(nearest);
  };

  /** "전체" 클릭 — 필터 해제 + 전체에서 가장 가까운 일정으로 이동 */
  const handleClearAll = () => {
    clearFeedbackTags();
    const nearest = findNearestDateForTag(null);
    setTargetScrollDate(nearest);
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
  const [mentorOpenChallengeBar, setMentorOpenChallengeBar] =
    useState<PeriodBarData | null>(null);

  // 모달에 전달할 focusDate (해당 챌린지 라이브 피드백 기간 시작일) — BE 슬롯 통합 운영으로
  // 챌린지 단위 분리 로직은 폐기.
  const mentorOpenFocusDate = useMemo(() => {
    if (!mentorOpenChallengeBar) return undefined;
    const periodBar = allBarsUnfiltered.find(
      (b) =>
        b.barType === 'live-feedback-period' &&
        b.challengeId === mentorOpenChallengeBar.challengeId,
    );
    return periodBar?.startDate;
  }, [mentorOpenChallengeBar, allBarsUnfiltered]);

  const [selectedLiveFeedbackBar, setSelectedLiveFeedbackBar] =
    useState<PeriodBarData | null>(null);

  // 선택된 라이브 세션의 라운드 회차(period 바의 th) — 모달 헤더 표시용
  const selectedRoundTh = useMemo(() => {
    if (!selectedLiveFeedbackBar) return undefined;
    const period = allBarsUnfiltered.find(
      (b) =>
        b.barType === 'live-feedback-period' &&
        b.challengeId === selectedLiveFeedbackBar.challengeId,
    );
    return period?.th;
  }, [selectedLiveFeedbackBar, allBarsUnfiltered]);

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
          <div className="flex flex-col gap-4">
            <FeedbackTagFilter
              selectedTags={selectedFeedbackTags}
              onToggle={handleTagClick}
              onClearAll={handleClearAll}
            />

            <WeeklyCalendar
              bars={filteredBars}
              allBars={allBarsUnfiltered}
              onBarClick={handleBarClick}
              targetScrollDate={targetScrollDate}
              onMentorOpenPeriodClick={() => setIsMentorOpenModalOpen(true)}
              onMentorOpenPeriodBarClick={(bar) => {
                setMentorOpenChallengeBar(bar);
                setIsMentorOpenModalOpen(true);
              }}
              onLiveFeedbackTimeBlockClick={(bar) =>
                setSelectedLiveFeedbackBar(bar)
              }
              onLiveFeedbackPeriodClick={(periodBar) => {
                // 해당 기간의 첫 세션 바를 선택 → 모달이 세션 기반으로 열림
                const firstSession = allBarsUnfiltered.find(
                  (b) =>
                    b.barType === 'live-feedback' &&
                    b.challengeId === periodBar.challengeId &&
                    b.startDate >= periodBar.startDate &&
                    b.startDate <= periodBar.endDate,
                );
                if (firstSession) setSelectedLiveFeedbackBar(firstSession);
              }}
            />
          </div>
        </div>
      </div>

      {challenges.map((c) => (
        <ChallengeDataFetcher
          key={c.challengeId}
          challenge={c}
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

      <FeedbackAvailabilityModal
        isOpen={isMentorOpenModalOpen}
        onClose={() => {
          setIsMentorOpenModalOpen(false);
          setMentorOpenChallengeBar(null);
        }}
        focusDate={mentorOpenFocusDate}
      />
      <LiveFeedbackReservationModal
        isOpen={!!selectedLiveFeedbackBar}
        onClose={() => setSelectedLiveFeedbackBar(null)}
        bar={selectedLiveFeedbackBar}
        liveFeedbackBars={filteredLiveSessionBars}
        onSelectBar={setSelectedLiveFeedbackBar}
        roundTh={selectedRoundTh}
      />
    </div>
  );
};

export default SchedulePage;
