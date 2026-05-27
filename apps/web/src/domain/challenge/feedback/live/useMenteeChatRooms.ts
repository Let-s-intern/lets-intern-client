'use client';

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { liveFeedbackListSchema } from '@/api/feedback/feedbackSchema';
import { useMentorChallengeListQuery } from '@/api/user/user';
import axios from '@/utils/axios';

import type { ChatRoomListItem } from '@letscareer/chat/ui/ChatModal';

/**
 * 멘티 본인의 라이브 피드백 → 채팅 방 목록(feedbackId 단위).
 *
 * 사용자 단위 "내 라이브 피드백" 단일 엔드포인트가 없어, 멘토가 배정된 내 챌린지
 * 목록(`/challenge-mentor`)을 기준으로 챌린지별 라이브 피드백을 병렬 조회해
 * `feedbackId` 보유 항목만 방으로 만든다. 전역/모달 마운트라 `staleTime`을 둔다.
 *
 * 전역 플로팅 런처와 라이브 피드백 진입 버튼이 공유한다(같은 query key → 캐시 재사용).
 */
export function useMenteeChatRooms(enabled: boolean): ChatRoomListItem[] {
  const { data: challengeData } = useMentorChallengeListQuery({ enabled });
  const challenges = useMemo(
    () => challengeData?.myChallengeMentorVoList ?? [],
    [challengeData],
  );

  const feedbackQueries = useQueries({
    queries: challenges.map((challenge) => ({
      queryKey: ['liveFeedbackList', challenge.challengeId] as const,
      queryFn: async () => {
        const res = await axios.get(
          `/challenge/${challenge.challengeId}/feedback/live`,
        );
        return liveFeedbackListSchema.parse(res.data.data);
      },
      enabled: enabled && !!challenge.challengeId,
      staleTime: 5 * 60 * 1000,
    })),
  });

  return useMemo(() => {
    if (!enabled) return [];

    const rooms: ChatRoomListItem[] = [];
    challenges.forEach((challenge, idx) => {
      const list = feedbackQueries[idx]?.data?.liveFeedbackList;
      if (!list) return;
      for (const item of list) {
        if (item.feedbackId == null) continue;
        const mentorName = item.mentorInfo?.nickname ?? '멘토';
        rooms.push({
          feedbackId: item.feedbackId,
          title: mentorName,
          subtitle: `${challenge.title} · ${item.missionTh}회차`,
          meta: { mentorName, challengeTitle: challenge.title },
        });
      }
    });
    return rooms;
    // useQueries는 매 렌더 새 배열을 반환하므로 dataUpdatedAt(primitive)을 join해
    // 안정적 의존성 키를 만든다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    challenges.map((c) => c.challengeId).join(','),
    feedbackQueries.map((q) => q.dataUpdatedAt).join('-'),
  ]);
}
