import { lazy, Suspense, useMemo, useState } from 'react';

import ChatFloatingButton from '@letscareer/chat/ui/ChatFloatingButton';
import type { ChatRoomListItem } from '@letscareer/chat/ui/ChatModal';

import { useFeedbackMentorListQuery } from '@/api/feedback/feedback';

/** 채팅 모달 — 열릴 때만 로드 (동적 import). */
const ChatModal = lazy(() => import('@letscareer/chat/ui/ChatModal'));

/**
 * 멘토 전역 채팅 런처 (얇은 마운트 래퍼).
 *
 * - 버튼/안읽음 로직은 패키지 `ChatFloatingButton`이 담당 — 여기서 재구현하지 않는다.
 * - `useFeedbackMentorListQuery` 캐시를 재사용해 방 목록(feedbackId 단위)을 파생한다.
 *   (예약 현황·멘티 로스터와 동일 query key → 추가 fetch 없음)
 * - 방 단위는 세션(`feedbackId`), 표시는 멘티 이름 + 챌린지.
 *
 * 삭제 surface: `MentorShell`의 `<MentorChatLauncher />` 1줄 + 이 파일.
 */
export default function MentorChatLauncher() {
  const { data } = useFeedbackMentorListQuery();
  const [isOpen, setIsOpen] = useState(false);

  const rooms: ChatRoomListItem[] = useMemo(() => {
    const seen = new Set<number>();
    const list: ChatRoomListItem[] = [];
    for (const fb of data ?? []) {
      if (seen.has(fb.feedbackId)) continue;
      seen.add(fb.feedbackId);
      list.push({
        feedbackId: fb.feedbackId,
        title: fb.menteeName,
        subtitle: fb.programTitle,
        meta: { menteeName: fb.menteeName, challengeTitle: fb.programTitle },
      });
    }
    return list;
  }, [data]);

  const feedbackIds = useMemo(() => rooms.map((r) => r.feedbackId), [rooms]);

  return (
    <>
      <ChatFloatingButton
        role="mentor"
        feedbackIds={feedbackIds}
        onOpen={() => setIsOpen(true)}
        positionClassName="bottom-20 right-4"
      />

      {isOpen && (
        <Suspense fallback={null}>
          <ChatModal
            role="mentor"
            rooms={rooms}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
