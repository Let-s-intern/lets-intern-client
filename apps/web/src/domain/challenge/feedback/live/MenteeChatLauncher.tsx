'use client';

import { useMemo, useState } from 'react';

import dynamic from 'next/dynamic';

import { useQueries } from '@tanstack/react-query';

import { liveFeedbackListSchema } from '@/api/feedback/feedbackSchema';
import { useMentorChallengeListQuery } from '@/api/user/user';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';

import type { ChatRoomListItem } from '@letscareer/chat/ui/ChatModal';

// 채팅 UI 는 PocketBase 클라이언트를 끌어오므로 동적 import 로 분리해
// 전역 레이아웃의 초기 번들에서 제외한다. 로그인·방 존재 시에만 로드된다.
const ChatFloatingButton = dynamic(
  () => import('@letscareer/chat/ui/ChatFloatingButton'),
  { ssr: false },
);
const ChatModal = dynamic(() => import('@letscareer/chat/ui/ChatModal'), {
  ssr: false,
});

/**
 * 멘티 본인이 참여 중인 챌린지들의 라이브 피드백 → 채팅 방 목록 파생.
 *
 * 사용자 단위 "내 라이브 피드백" 단일 엔드포인트는 없으므로, 멘토가 배정된
 * 내 챌린지 목록(`/challenge-mentor`)을 기준으로 챌린지별 라이브 피드백을
 * 병렬 조회해 `feedbackId` 보유 항목만 방으로 만든다. 전역 마운트라 잦은
 * 재조회를 막기 위해 `staleTime` 을 둔다.
 */
function useMenteeLiveFeedbackRooms(enabled: boolean): ChatRoomListItem[] {
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
    // useQueries 는 매 렌더 새 배열을 반환하므로 dataUpdatedAt(primitive)을
    // join 해 안정적 의존성 키를 만든다 (useLegacyMissionCounts 와 동일 패턴).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    challenges.map((c) => c.challengeId).join(','),
    feedbackQueries.map((q) => q.dataUpdatedAt).join('-'),
  ]);
}

/**
 * 멘티 전역 채팅 플로팅 버튼 마운트 래퍼 (데이터 주입 전용).
 *
 * 버튼/안읽음/모달 UI 는 `@letscareer/chat` 패키지가 담당하고, 이 래퍼는
 * 로그인 게이트와 `feedbackId[]`(방 목록) 주입만 한다. 비로그인이거나 방이
 * 없으면 `null` 을 반환한다.
 */
export default function MenteeChatLauncher() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const rooms = useMenteeLiveFeedbackRooms(isLoggedIn);
  const [isOpen, setIsOpen] = useState(false);

  const feedbackIds = useMemo(
    () => rooms.map((room) => room.feedbackId),
    [rooms],
  );

  if (!isLoggedIn || rooms.length === 0) return null;

  return (
    <>
      <ChatFloatingButton
        role="mentee"
        feedbackIds={feedbackIds}
        onOpen={() => setIsOpen(true)}
      />
      {isOpen && (
        <ChatModal
          role="mentee"
          rooms={rooms}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
