import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMentorMissionFeedbackListQuery } from '@/api/challenge/challenge';
import { useMentorChallengeListQuery } from '@/api/user/user';
import {
  useLiveFeedbackList,
  type LiveFeedbackRound,
} from '@/pages/feedback-management/hooks/useLiveFeedbackList';
import type { PeriodBarData } from '@/pages/schedule/types';

interface FeedbackModalState {
  isOpen: boolean;
  missionId: number;
  missionTh: number;
}

/**
 * Manages challenge detail page data and feedback modal state.
 *
 * 미션 클릭 시 타입(`challengeOptionType`)에 따라 분기한다:
 *  - WRITTEN_FEEDBACK → 서면 `FeedbackModal`
 *  - LIVE_FEEDBACK    → 라이브 `LiveFeedbackReservationModal`
 *    (해당 챌린지의 라이브 세션은 `useLiveFeedbackList`에서 title 매칭으로 가져온다)
 */
export function useChallengeDetail() {
  const params = useParams<{ challengeId: string }>();
  const challengeId = Number(params.challengeId);

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    missionId: 0,
    missionTh: 0,
  });

  // Get challenge title from list
  const { data: challengeListData } = useMentorChallengeListQuery();
  const challenge = challengeListData?.myChallengeMentorVoList.find(
    (c) => c.challengeId === challengeId,
  );
  const challengeTitle = challenge?.title ?? '';

  // Get mission list
  const { data: missionData, isLoading } =
    useMentorMissionFeedbackListQuery(challengeId);
  const missions = missionData?.missionList ?? [];

  // 라이브 피드백 세션 — 이 챌린지(title 매칭)의 회차별 세션 바.
  // TODO(BE 선행): FeedbackMentorVo에 challengeId/missionId가 없어 챌린지는 programTitle,
  //   미션은 회차(th)로만 매칭한다. (1) title 중복/변경 시, (2) 미션의 LIVE 피드백 회차가
  //   미션 순번(th)과 다를 때(예: "2회차 미션"의 옵션이 "LIVE 피드백 4회차") 매칭이 어긋날
  //   수 있다. BE가 세션에 challengeId·missionId(또는 옵션 회차)를 실어주면 정밀 매칭 가능.
  const { challenges: liveChallenges, allSessionBars } = useLiveFeedbackList();
  const liveRounds = useMemo<LiveFeedbackRound[]>(
    () => liveChallenges.find((c) => c.title === challengeTitle)?.rounds ?? [],
    [liveChallenges, challengeTitle],
  );

  // 미션 회차(th)에 정확히 매칭되는 라이브 라운드. ⚠️ 폴백 금지 —
  // 폴백하면 세션 없는 미션까지 같은 세션이 중복으로 붙는다(중복 표기 버그).
  const findLiveRound = (missionTh: number) =>
    liveRounds.find((r) => r.th === missionTh) ?? null;

  const [liveModalBar, setLiveModalBar] = useState<PeriodBarData | null>(null);
  const [liveSelectedRound, setLiveSelectedRound] =
    useState<LiveFeedbackRound | null>(null);

  const handleClickFeedback = (missionId: number, missionTh: number) => {
    const mission = missions.find((m) => m.id === missionId);

    // 라이브 피드백 미션 → 라이브 모달 (해당 회차 세션으로 네비게이션)
    if (mission?.challengeOptionType === 'LIVE_FEEDBACK') {
      const round = findLiveRound(missionTh);
      const firstBar = round?.sessionBars[0] ?? null;
      if (firstBar) {
        setLiveSelectedRound(round);
        setLiveModalBar(firstBar);
      }
      return;
    }

    // 서면 피드백 미션 → 서면 모달
    setFeedbackModal({ isOpen: true, missionId, missionTh });
  };

  const handleCloseModal = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
  };

  const closeLiveModal = () => {
    setLiveSelectedRound(null);
    setLiveModalBar(null);
  };

  /** 라이브 미션(회차)의 예약 세션(멘티) 수 — 매칭 실패 시 0. */
  const liveMenteeCount = (missionTh: number) =>
    findLiveRound(missionTh)?.sessionBars.length ?? 0;

  /** 라이브 미션(회차)에 열 수 있는 세션이 있는지 — 없으면 버튼 비활성. */
  const canOpenLiveMission = (missionTh: number) =>
    liveMenteeCount(missionTh) > 0;

  return {
    challengeId,
    challenge,
    challengeTitle,
    missions,
    isLoading,
    feedbackModal,
    handleClickFeedback,
    handleCloseModal,
    // 라이브 피드백 모달
    liveModalBar,
    liveSelectedRound,
    allSessionBars,
    setLiveModalBar,
    closeLiveModal,
    canOpenLiveMission,
    liveMenteeCount,
  };
}
