'use client';

import { useMemo, useState } from 'react';

import { useMediaQuery } from '@mui/material';

import FeedbackModal from '@/domain/mentor/feedback/FeedbackModal';
import MobileFeedbackPage from '@/domain/mentor/feedback/ui/MobileFeedbackPage';
import LiveFeedbackReservationModal from '@/domain/mentor/schedule/modal/LiveFeedbackReservationModal';
import type { PeriodBarData } from '@/domain/mentor/schedule/types';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import ChallengeFeedbackCard from './ui/ChallengeFeedbackCard';
import FeedbackTabs, { type FeedbackTabKey } from './ui/FeedbackTabs';
import LiveFeedbackRoundList from './ui/LiveFeedbackRoundList';
import { useFeedbackManagement } from './hooks/useFeedbackManagement';
import {
  useLiveFeedbackList,
  type LiveFeedbackChallenge,
  type LiveFeedbackRound,
} from './hooks/useLiveFeedbackList';
import {
  WRITTEN_CHALLENGE_MISSION_FEEDBACK_RANGES,
  WRITTEN_CHALLENGE_MOCK,
} from './mocks/writtenChallengeMock';

type Challenge = MentorFeedbackManagement['challengeList'][number];

/** API 서면 + mock 서면 병합 (challengeId 중복 시 API 우선). */
function useMergedWrittenChallenges(apiChallenges: Challenge[]) {
  return useMemo(() => {
    const apiIds = new Set(apiChallenges.map((c) => c.challengeId));
    const extras = WRITTEN_CHALLENGE_MOCK.filter(
      (c) => !apiIds.has(c.challengeId),
    );
    return [...apiChallenges, ...extras];
  }, [apiChallenges]);
}

/** 서면 + 라이브 챌린지를 challengeId 기준 outer join. */
function useMergedChallenges(
  writtenChallenges: Challenge[],
  liveChallenges: LiveFeedbackChallenge[],
) {
  return useMemo(() => {
    type Merged = {
      challengeId: number;
      title: string;
      written?: Challenge;
      liveRounds: LiveFeedbackRound[];
    };

    const map = new Map<number, Merged>();

    for (const c of writtenChallenges) {
      map.set(c.challengeId, {
        challengeId: c.challengeId,
        title: c.title ?? '챌린지',
        written: c,
        liveRounds: [],
      });
    }
    for (const c of liveChallenges) {
      const existing = map.get(c.challengeId);
      if (existing) {
        existing.liveRounds = c.rounds;
      } else {
        map.set(c.challengeId, {
          challengeId: c.challengeId,
          title: c.title,
          liveRounds: c.rounds,
        });
      }
    }

    return Array.from(map.values());
  }, [writtenChallenges, liveChallenges]);
}

const FeedbackManagementPage = () => {
  const {
    challengeList: apiChallengeList,
    isLoading,
    feedbackModal,
    handleMissionClick,
    handleCloseModal,
  } = useFeedbackManagement();

  const challengeList = useMergedWrittenChallenges(apiChallengeList);
  const { challenges: liveChallenges, allSessionBars } = useLiveFeedbackList();
  const merged = useMergedChallenges(challengeList, liveChallenges);

  const [activeTab, setActiveTab] = useState<FeedbackTabKey>('all');
  const [selectedRound, setSelectedRound] = useState<LiveFeedbackRound | null>(
    null,
  );
  const [modalBar, setModalBar] = useState<PeriodBarData | null>(null);

  const isMobile = useMediaQuery('(max-width: 767px)');

  const handleLiveRoundClick = (round: LiveFeedbackRound) => {
    setSelectedRound(round);
    setModalBar(round.sessionBars[0] ?? null);
  };
  const closeLiveModal = () => {
    setSelectedRound(null);
    setModalBar(null);
  };

  const isEmpty =
    activeTab === 'live'
      ? merged.every((m) => m.liveRounds.length === 0)
      : activeTab === 'written'
        ? challengeList.length === 0
        : merged.length === 0;

  return (
    <div className="flex flex-col gap-4 pb-20 md:gap-6 md:pb-0">
      <h1 className="text-lg font-semibold leading-7 text-neutral-900 md:text-xl md:leading-8">
        피드백 현황
      </h1>

      <FeedbackTabs activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">로딩 중...</div>
      ) : isEmpty ? (
        <div className="py-12 text-center text-gray-400">
          {activeTab === 'live'
            ? '라이브 피드백 일정이 없습니다.'
            : activeTab === 'written'
              ? '참여 중인 챌린지가 없습니다.'
              : '표시할 피드백이 없습니다.'}
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          {activeTab === 'all' &&
            merged.map((m) =>
              m.written ? (
                <ChallengeFeedbackCard
                  key={m.challengeId}
                  challenge={m.written}
                  mode="combined"
                  liveRounds={m.liveRounds}
                  missionDateOverrides={WRITTEN_CHALLENGE_MISSION_FEEDBACK_RANGES}
                  onMissionClick={handleMissionClick}
                  onLiveRoundClick={handleLiveRoundClick}
                />
              ) : (
                <LiveOnlyChallengeCard
                  key={m.challengeId}
                  title={m.title}
                  rounds={m.liveRounds}
                  onRoundClick={handleLiveRoundClick}
                />
              ),
            )}

          {activeTab === 'written' &&
            challengeList.map((challenge) => (
              <ChallengeFeedbackCard
                key={challenge.challengeId}
                challenge={challenge}
                mode="written-only"
                liveRounds={
                  liveChallenges.find(
                    (l) => l.challengeId === challenge.challengeId,
                  )?.rounds ?? []
                }
                missionDateOverrides={WRITTEN_CHALLENGE_MISSION_FEEDBACK_RANGES}
                onMissionClick={handleMissionClick}
              />
            ))}

          {activeTab === 'live' &&
            merged
              .filter((m) => m.liveRounds.length > 0)
              .map((m) =>
                m.written ? (
                  <ChallengeFeedbackCard
                    key={m.challengeId}
                    challenge={m.written}
                    mode="live-only"
                    liveRounds={m.liveRounds}
                    missionDateOverrides={WRITTEN_CHALLENGE_MISSION_FEEDBACK_RANGES}
                    onMissionClick={handleMissionClick}
                    onLiveRoundClick={handleLiveRoundClick}
                  />
                ) : (
                  <LiveOnlyChallengeCard
                    key={m.challengeId}
                    title={m.title}
                    rounds={m.liveRounds}
                    onRoundClick={handleLiveRoundClick}
                  />
                ),
              )}
        </div>
      )}

      {/* 서면 피드백 모달 */}
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

      {/* 라이브 피드백 예약 모달 — 선택한 회차의 세션들만 네비게이션 대상 */}
      <LiveFeedbackReservationModal
        isOpen={!!modalBar}
        onClose={closeLiveModal}
        bar={modalBar}
        liveFeedbackBars={selectedRound?.sessionBars ?? allSessionBars}
        onSelectBar={setModalBar}
        roundTh={selectedRound?.th}
      />
    </div>
  );
};

interface LiveOnlyChallengeCardProps {
  title: string;
  rounds: LiveFeedbackRound[];
  onRoundClick?: (round: LiveFeedbackRound) => void;
}

/** 서면 API 데이터 없이 라이브만 있는 챌린지 카드. */
const LiveOnlyChallengeCard = ({
  title,
  rounds,
  onRoundClick,
}: LiveOnlyChallengeCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 md:p-6">
    <div className="mb-3 flex flex-col gap-1 md:mb-4">
      <h2 className="text-base font-bold text-gray-900 md:text-lg">{title}</h2>
    </div>
    <LiveFeedbackRoundList rounds={rounds} onRoundClick={onRoundClick} />
  </div>
);

export default FeedbackManagementPage;
