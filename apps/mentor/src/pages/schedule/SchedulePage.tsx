

import { useMemo, useState } from 'react';

import { useMediaQuery } from '@mui/material';

import FeedbackModal from '../feedback/FeedbackModal';
import MobileFeedbackPage from '../feedback/ui/MobileFeedbackPage';
import ChallengeDataFetcher from './ui/ChallengeDataFetcher';
import FeedbackTagFilter from './ui/FeedbackTagFilter';
import WelcomeMessage from './ui/WelcomeMessage';
import WeeklyCalendar from './weekly-calendar/WeeklyCalendar';

import {
  MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE,
  MENTOR_OPEN_SCHEDULES_BY_CHALLENGE,
  type MentorOpenSlot,
} from './challenge-content/mentorOpenScheduleMock';
import type { FeedbackTagType } from './constants/feedbackTag';
import { useLiveFeedbackData } from './hooks/useLiveFeedbackData';
import { useScheduleData } from './hooks/useScheduleData';
import { useWrittenFeedbackMockData } from './hooks/useWrittenFeedbackMockData';
import LiveFeedbackReservationModal from './modal/LiveFeedbackReservationModal';
import MentorOpenScheduleModal from './modal/MentorOpenScheduleModal';
import type { PeriodBarData } from './types';

const SchedulePage = () => {
  const { bars: writtenMockBars } = useWrittenFeedbackMockData();
  const liveFeedbackBars = useLiveFeedbackData();

  // 서면 + 라이브 mock 모두 extraBars로 주입
  const extraBars = useMemo(
    () => [...writtenMockBars, ...liveFeedbackBars],
    [writtenMockBars, liveFeedbackBars],
  );

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
  const [mentorOpenSlotsByChallenge, setMentorOpenSlotsByChallenge] = useState<
    Record<number, MentorOpenSlot[]>
  >(MENTOR_OPEN_SCHEDULES_BY_CHALLENGE);

  // 모달이 열릴 때 대상 챌린지의 슬롯 & 다른 챌린지들의 블록 슬롯 파생
  const mentorOpenContext = useMemo(() => {
    if (!mentorOpenChallengeBar) return null;
    const activeChallengeId = mentorOpenChallengeBar.challengeId;
    const initialSlots = mentorOpenSlotsByChallenge[activeChallengeId] ?? [];
    const appliedBookings =
      MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE[activeChallengeId] ?? [];
    // 신청 예정 멘티 수 = 해당 챌린지 live-feedback-period 바의 submittedCount
    const periodBar = allBarsUnfiltered.find(
      (b) =>
        b.barType === 'live-feedback-period' &&
        b.challengeId === activeChallengeId,
    );
    const requiredSlotCount = periodBar?.submittedCount;
    const blockedSlots: Array<{
      date: string;
      time: string;
      challengeTitle?: string;
      challengeId?: number;
      menteeName?: string;
    }> = [];
    for (const [idText, slots] of Object.entries(mentorOpenSlotsByChallenge)) {
      const id = Number(idText);
      if (id === activeChallengeId) continue;
      const otherBar = allBarsUnfiltered.find((b) => b.challengeId === id);
      const applied = MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE[id] ?? [];
      for (const slot of slots) {
        const appliedMatch = applied.find(
          (a) => a.date === slot.date && a.time === slot.time,
        );
        blockedSlots.push({
          date: slot.date,
          time: slot.time,
          challengeTitle: otherBar?.challengeTitle,
          challengeId: id,
          menteeName: appliedMatch?.menteeName,
        });
      }
    }
    return {
      challengeId: activeChallengeId,
      initialSlots,
      blockedSlots,
      appliedBookings,
      requiredSlotCount,
      focusDate: periodBar?.startDate,
    };
  }, [mentorOpenChallengeBar, mentorOpenSlotsByChallenge, allBarsUnfiltered]);

  // 라이브 피드백이 진행되는 모든 챌린지 이름 (중복 제거, 등록 순) — 상단 태그 표시용
  const liveChallengeTitles = useMemo(() => {
    const map = new Map<number, string>();
    for (const bar of allBarsUnfiltered) {
      if (bar.barType === 'live-feedback-period') {
        map.set(bar.challengeId, bar.challengeTitle);
      }
    }
    return Array.from(map.values());
  }, [allBarsUnfiltered]);
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

      <MentorOpenScheduleModal
        isOpen={isMentorOpenModalOpen}
        onClose={() => {
          setIsMentorOpenModalOpen(false);
          setMentorOpenChallengeBar(null);
        }}
        initialSlots={mentorOpenContext?.initialSlots ?? []}
        blockedSlots={mentorOpenContext?.blockedSlots ?? []}
        appliedBookings={mentorOpenContext?.appliedBookings ?? []}
        challengeTitles={liveChallengeTitles}
        requiredSlotCount={mentorOpenContext?.requiredSlotCount}
        focusDate={mentorOpenContext?.focusDate}
        onSave={(slots) => {
          const challengeId = mentorOpenContext?.challengeId;
          if (challengeId !== undefined) {
            setMentorOpenSlotsByChallenge((prev) => ({
              ...prev,
              [challengeId]: slots,
            }));
          }
        }}
        onSwapFromOtherChallenge={(fromChallengeId, slot) => {
          setMentorOpenSlotsByChallenge((prev) => {
            const fromSlots = (prev[fromChallengeId] ?? []).filter(
              (s) => !(s.date === slot.date && s.time === slot.time),
            );
            return { ...prev, [fromChallengeId]: fromSlots };
          });
        }}
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
