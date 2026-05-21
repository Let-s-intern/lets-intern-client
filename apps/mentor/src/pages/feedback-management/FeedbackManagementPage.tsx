import { useMemo, useState } from 'react';

import { useMediaQuery } from '@mui/material';

import FeedbackModal from '@/pages/feedback/FeedbackModal';
import MobileFeedbackPage from '@/pages/feedback/ui/MobileFeedbackPage';
import LiveFeedbackReservationModal from '@/pages/schedule/modal/LiveFeedbackReservationModal';
import type { PeriodBarData } from '@/pages/schedule/types';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';
import FeedbackSummary from './ui/FeedbackSummary';
import FeedbackTabs from './ui/FeedbackTabs';
import FeedbackTable from './ui/FeedbackTable';
import { useFeedbackManagement } from './hooks/useFeedbackManagement';
import { useFeedbackTabQuery } from './hooks/useFeedbackTabQuery';
import {
  useLiveFeedbackList,
  type LiveFeedbackRound,
} from './hooks/useLiveFeedbackList';
import { useMergedFeedbackRows } from './hooks/useMergedFeedbackRows';
import { WRITTEN_CHALLENGE_MOCK } from './mocks/writtenChallengeMock';
import type { FeedbackRow } from './types';

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

const FeedbackManagementPage = () => {
  const {
    challengeList: apiChallengeList,
    isLoading,
    feedbackModal,
    openWrittenFeedbackModal,
    handleCloseModal,
  } = useFeedbackManagement();

  const challengeList = useMergedWrittenChallenges(apiChallengeList);
  const { challenges: liveChallenges, allSessionBars } = useLiveFeedbackList();

  const allLiveRounds = useMemo<LiveFeedbackRound[]>(
    () => liveChallenges.flatMap((c) => c.rounds),
    [liveChallenges],
  );

  const allRows = useMergedFeedbackRows(challengeList, allLiveRounds);

  const [activeTab, setActiveTab] = useFeedbackTabQuery();

  // 클라이언트 필터 — type 기반
  const filteredRows = useMemo(() => {
    if (activeTab === 'all') return allRows;
    return allRows.filter((r) => r.type === activeTab);
  }, [allRows, activeTab]);

  // 라이브 모달 상태
  const [selectedRound, setSelectedRound] = useState<LiveFeedbackRound | null>(
    null,
  );
  const [modalBar, setModalBar] = useState<PeriodBarData | null>(null);

  const isMobile = useMediaQuery('(max-width: 767px)');

  const handleClickDetail = (row: FeedbackRow) => {
    if (!row.canOpenDetail) return;

    if (row.source.type === 'written') {
      openWrittenFeedbackModal({
        challengeId: row.source.challengeId,
        challengeTitle: row.source.challengeTitle,
        missionId: row.source.missionId,
        missionTh: row.source.missionTh,
      });
      return;
    }

    // live → 라이브 모달
    setSelectedRound(row.source.round);
    setModalBar(row.source.bar);
  };

  const closeLiveModal = () => {
    setSelectedRound(null);
    setModalBar(null);
  };

  return (
    <div className="flex flex-col gap-4 pb-20 md:gap-6 md:pb-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold leading-7 text-neutral-900 md:text-xl md:leading-8">
          피드백 현황
        </h1>
        <p className="text-xs text-neutral-500 md:text-sm">
          서면 피드백, LIVE 피드백 현황을 확인하세요.
        </p>
      </div>

      <FeedbackSummary />

      <FeedbackTabs activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">로딩 중...</div>
      ) : (
        <FeedbackTable
          rows={filteredRows}
          onClickDetail={handleClickDetail}
        />
      )}

      {/* 서면 피드백 모달 — 모바일/데스크탑 분기 */}
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

      {/* 라이브 피드백 모달 — 선택한 회차의 세션들만 네비게이션 대상 */}
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

export default FeedbackManagementPage;
