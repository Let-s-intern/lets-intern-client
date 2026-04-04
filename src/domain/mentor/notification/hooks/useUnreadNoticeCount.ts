import { useMemo } from 'react';
import { useChallengeMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useMentorChallengeListQuery } from '@/api/user/user';
import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import { useNotificationState } from './useNotificationState';

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/** 특정 챌린지의 오늘 공지 중 안 읽은 수를 반환하는 내부 훅 */
function useChallengeUnreadCount(challengeId: number, readIds: number[]) {
  const { data } = useChallengeMentorGuideListQuery(challengeId);
  const guides = data?.challengeMentorGuideList ?? [];

  return useMemo(() => {
    return guides.filter(
      (g: ChallengeMentorGuideItem) =>
        g.createDate &&
        isToday(g.createDate) &&
        !readIds.includes(g.challengeMentorGuideId),
    ).length;
  }, [guides, readIds]);
}

/** 전체 안 읽은 공지 수 + 전체 공지 목록 반환 */
export function useUnreadNoticeCount() {
  const { data: challengeData } = useMentorChallengeListQuery();
  const challenges = challengeData?.myChallengeMentorVoList ?? [];
  const { readIds, markAsRead, isRead } = useNotificationState();

  // 각 챌린지별 안 읽은 수를 합산하기 위해 최상위에서 계산
  // (훅 규칙상 챌린지별 훅을 반복 호출할 수 없으므로 컴포넌트 기반으로 처리)
  return {
    challenges,
    readIds,
    markAsRead,
    isRead,
  };
}

export { useChallengeUnreadCount };
