import { useCallback, useMemo, useState } from 'react';

import { useMediaQuery } from '@mui/material';

import FeedbackModal from '@/pages/feedback/FeedbackModal';
import MobileFeedbackPage from '@/pages/feedback/ui/MobileFeedbackPage';
import LiveFeedbackReservationModal from '@/pages/schedule/modal/LiveFeedbackReservationModal';
import type { PeriodBarData } from '@/pages/schedule/types';
import FeedbackTabs from './ui/FeedbackTabs';
import FeedbackTable from './ui/FeedbackTable';
import WrittenMenteeAttendanceFetcher from './ui/WrittenMenteeAttendanceFetcher';
import { useFeedbackManagement } from './hooks/useFeedbackManagement';
import { useFeedbackTabQuery } from './hooks/useFeedbackTabQuery';
import {
  useLiveFeedbackList,
  type LiveFeedbackRound,
} from './hooks/useLiveFeedbackList';
import {
  useMergedFeedbackRows,
  useWrittenMissionRangeMap,
  type WrittenMenteeAttendance,
} from './hooks/useMergedFeedbackRows';
import type { FeedbackRow } from './types';

const FeedbackManagementPage = () => {
  const {
    challengeList,
    isLoading,
    feedbackModal,
    openWrittenFeedbackModal,
    handleCloseModal,
  } = useFeedbackManagement();

  const { challenges: liveChallenges, allSessionBars } = useLiveFeedbackList();

  const allLiveRounds = useMemo<LiveFeedbackRound[]>(
    () => liveChallenges.flatMap((c) => c.rounds),
    [liveChallenges],
  );

  // 서면 멘티별 출석 fan-out 결과를 모으는 맵 — 도착 즉시 행이 멘티별로 펼쳐진다.
  const [writtenAttendance, setWrittenAttendance] = useState<
    Map<string, WrittenMenteeAttendance[]>
  >(new Map());

  const handleWrittenAttendance = useCallback(
    (key: string, list: WrittenMenteeAttendance[]) => {
      setWrittenAttendance((prev) => {
        const next = new Map(prev);
        next.set(key, list);
        return next;
      });
    },
    [],
  );

  // 서면 피드백 기간 — feedback-management 응답엔 미션 날짜가 없어, 챌린지별
  // 미션 목록을 병렬 조회해 missionId→{start,end} 맵을 채운다(서면 행 일정 표시용).
  const challengeIds = useMemo(
    () => challengeList.map((c) => c.challengeId),
    [challengeList],
  );
  const missionRangeMap = useWrittenMissionRangeMap(challengeIds);

  const allRows = useMergedFeedbackRows(
    challengeList,
    allLiveRounds,
    writtenAttendance,
    missionRangeMap,
  );

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
          피드백 내역
        </h1>
        <p className="text-xs text-neutral-500 md:text-sm">
          서면 피드백, LIVE 피드백 내역을 확인하세요.
        </p>
      </div>

      <FeedbackTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* 서면 멘티별 출석 fan-out — 화면 출력 없음. 미션마다 출석을 병렬 조회해
          handleWrittenAttendance 로 보고하면 서면 행이 멘티별로 펼쳐진다. */}
      <WrittenMenteeAttendanceFetcher
        challenges={challengeList}
        onData={handleWrittenAttendance}
      />

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">로딩 중...</div>
      ) : (
        <FeedbackTable rows={filteredRows} onClickDetail={handleClickDetail} />
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

      {/* 라이브 피드백 모달 — 선택한 회차의 세션들만 네비게이션 대상.
          ⚠️ 회차 한계: BE에 missionTh가 없어 옵션 A로 selectedRound.th는 항상 1.
          모달 헤더 "N차 피드백"은 1차로 고정된다 (정밀 회차는 BE 선행 필요, PRD §6.1). */}
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
