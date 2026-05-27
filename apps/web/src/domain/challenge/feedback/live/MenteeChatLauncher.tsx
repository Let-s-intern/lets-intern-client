'use client';

import { useMemo, useState } from 'react';

import dynamic from 'next/dynamic';

import useAuthStore from '@/store/useAuthStore';

import { useMenteeChatRooms } from './useMenteeChatRooms';

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
 * 멘티 전역 채팅 플로팅 버튼 마운트 래퍼 (데이터 주입 전용).
 *
 * 버튼/안읽음/모달 UI 는 `@letscareer/chat` 패키지가 담당하고, 이 래퍼는
 * 로그인 게이트와 방 목록(전체 멘토 로스터) 주입만 한다. 비로그인이거나 방이
 * 없으면 `null` 을 반환한다.
 */
export default function MenteeChatLauncher() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const rooms = useMenteeChatRooms(isLoggedIn);
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
        positionClassName="bottom-36 right-6"
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
