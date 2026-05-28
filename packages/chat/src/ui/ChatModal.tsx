'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import { type ChatRoomMeta } from '../hooks/useChatRoom';
import { useUnreadSummary } from '../hooks/useUnreadSummary';
import { chatRoomKey } from '../roomKey';
import type { ChatRole } from '../schema';
import { formatBadge } from './badge';
import ChatRoomView from './ChatRoomView';

/** 모달 좌측 목록의 방 한 건. */
export interface ChatRoomListItem {
  feedbackId: number;
  /** 멘토 화면=멘티 이름, 멘티 화면=챌린지/세션 제목. */
  title: string;
  subtitle?: string;
  /** 방 생성 시 채울 메타. */
  meta?: ChatRoomMeta;
}

interface ChatModalProps {
  role: ChatRole;
  rooms: ChatRoomListItem[];
  /** 진입 시 선택할 방 (없으면 첫 방). */
  activeFeedbackId?: number | null;
  onClose: () => void;
  pbUrl?: string;
}

export default function ChatModal({
  role,
  rooms,
  activeFeedbackId,
  onClose,
  pbUrl,
}: ChatModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    activeFeedbackId ?? rooms[0]?.feedbackId ?? null,
  );

  // 내가 방금 종료한 방은 즉시 목록에서 제거(낙관적). PB 숨김 플래그는 비동기 반영.
  const [endedIds, setEndedIds] = useState<number[]>([]);

  const { unreadByRoom, visibleRooms: visibleRoomKeys } = useUnreadSummary({
    feedbackIds: rooms.map((r) => r.feedbackId),
    role,
    pbUrl,
  });

  // 메시지가 있고 내가 숨기지 않은 방만 노출. 단, 명시적으로 연 방
  // (activeFeedbackId)은 시작/재입장을 위해 항상 포함한다.
  const displayRooms = rooms.filter(
    (r) =>
      !endedIds.includes(r.feedbackId) &&
      (visibleRoomKeys.has(chatRoomKey(r.feedbackId)) ||
        r.feedbackId === activeFeedbackId),
  );
  const selectedRoom =
    displayRooms.find((r) => r.feedbackId === selectedId) ?? null;
  const showList = displayRooms.length >= 1;

  const handleEnded = (feedbackId: number) => {
    const next = [...endedIds, feedbackId];
    setEndedIds(next);
    if (selectedId === feedbackId) {
      const remaining = displayRooms.filter((r) => r.feedbackId !== feedbackId);
      setSelectedId(remaining[0]?.feedbackId ?? null);
    }
  };

  const overlay = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-label="채팅"
    >
      <div
        className="flex w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
        style={{
          height: 'min(600px, 80dvh)',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}
      >
        {showList && (
          <ChatRoomList
            rooms={displayRooms}
            selectedId={selectedId}
            unreadByRoom={unreadByRoom}
            onSelect={setSelectedId}
          />
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="border-neutral-90 flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-neutral-10 text-sm font-semibold">
              {selectedRoom?.title ?? '채팅'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-40 hover:text-neutral-10"
              aria-label="채팅 닫기"
            >
              ✕
            </button>
          </header>

          {selectedRoom ? (
            <ChatRoomPanel
              key={selectedRoom.feedbackId}
              feedbackId={selectedRoom.feedbackId}
              role={role}
              counterpartName={selectedRoom.title}
              meta={selectedRoom.meta}
              pbUrl={pbUrl}
              onEnded={handleEnded}
            />
          ) : (
            <EmptyRooms />
          )}
        </div>
      </div>
    </div>
  );

  // 다른 모달(예약 상세 등) 내부에서 열려도 최상위에 표시되도록 body로 포털.
  return typeof document !== 'undefined'
    ? createPortal(overlay, document.body)
    : overlay;
}

function ChatRoomList({
  rooms,
  selectedId,
  unreadByRoom,
  onSelect,
}: {
  rooms: ChatRoomListItem[];
  selectedId: number | null;
  unreadByRoom: Record<string, number>;
  onSelect: (feedbackId: number) => void;
}) {
  return (
    <nav className="border-neutral-90 w-56 shrink-0 overflow-y-auto border-r">
      <ul>
        {rooms.map((room) => {
          const badge = formatBadge(
            unreadByRoom[chatRoomKey(room.feedbackId)] ?? 0,
          );
          const isActive = room.feedbackId === selectedId;
          return (
            <li key={room.feedbackId}>
              <button
                type="button"
                onClick={() => onSelect(room.feedbackId)}
                className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm ${
                  isActive
                    ? 'bg-neutral-95 font-semibold'
                    : 'hover:bg-neutral-95'
                }`}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-neutral-10 truncate">{room.title}</span>
                  {room.subtitle && (
                    <span className="text-neutral-40 truncate text-xs">
                      {room.subtitle}
                    </span>
                  )}
                </span>
                {badge && (
                  <span className="bg-primary shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ChatRoomPanel(props: {
  feedbackId: number;
  role: ChatRole;
  counterpartName: string;
  meta?: ChatRoomMeta;
  pbUrl?: string;
  onEnded: (feedbackId: number) => void;
}) {
  return <ChatRoomView {...props} />;
}

function EmptyRooms() {
  return (
    <div className="text-neutral-40 flex flex-1 items-center justify-center text-sm">
      대화할 상대가 없습니다.
    </div>
  );
}
