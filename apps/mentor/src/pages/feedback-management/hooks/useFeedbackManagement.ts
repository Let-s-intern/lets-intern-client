import { useState } from 'react';

import { useMentorFeedbackManagementQuery } from '@/api/challenge/challenge';
import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';

type Challenge = MentorFeedbackManagement['challengeList'][number];

interface FeedbackModalState {
  isOpen: boolean;
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
  /** 진입 시 초기 선택할 멘티의 출석 id (없으면 첫 멘티). */
  initialAttendanceId?: number | null;
}

/**
 * Manages feedback management page data and modal state.
 *
 * PRD-0503 #4: 챌린지 색상 매핑 제거 — colorIndex 의존성 제거.
 */
export function useFeedbackManagement() {
  const { data, isLoading } = useMentorFeedbackManagementQuery();
  const challengeList = data?.challengeList ?? [];

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    challengeId: 0,
    missionId: 0,
  });

  const handleMissionClick = (
    challenge: Challenge,
    missionId: number,
    missionTh: number,
  ) => {
    setFeedbackModal({
      isOpen: true,
      challengeId: challenge.challengeId,
      missionId,
      challengeTitle: challenge.title ?? undefined,
      missionTh,
    });
  };

  /**
   * 표 형태 페이지에서 평면화된 FeedbackRow 데이터로 모달을 여는 헬퍼.
   * `handleMissionClick`은 카드형 호환을 위해 그대로 유지한다.
   */
  const openWrittenFeedbackModal = (params: {
    challengeId: number;
    challengeTitle?: string;
    missionId: number;
    missionTh: number;
    attendanceId?: number | null;
  }) => {
    setFeedbackModal({
      isOpen: true,
      challengeId: params.challengeId,
      missionId: params.missionId,
      challengeTitle: params.challengeTitle,
      missionTh: params.missionTh,
      initialAttendanceId: params.attendanceId ?? null,
    });
  };

  const handleCloseModal = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    challengeList,
    isLoading,
    feedbackModal,
    handleMissionClick,
    openWrittenFeedbackModal,
    handleCloseModal,
  };
}
