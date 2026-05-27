'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useChatMessages } from '../hooks/useChatMessages';
import { useChatRoom, type ChatRoomMeta } from '../hooks/useChatRoom';
import { useUnreadSummary } from '../hooks/useUnreadSummary';
import { chatRoomKey } from '../roomKey';
import type { ChatRole } from '../schema';
import { formatBadge } from './badge';
import ChatComposer from './ChatComposer';
import ChatThread from './ChatThread';

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

  // 내가 종료한 방은 즉시 목록에서 숨긴다(양쪽 종료 시 PB에서 삭제됨).
  const [endedIds, setEndedIds] = useState<number[]>([]);

  const visibleRooms = rooms.filter((r) => !endedIds.includes(r.feedbackId));
  const feedbackIds = visibleRooms.map((r) => r.feedbackId);
  const { unreadByRoom } = useUnreadSummary({ feedbackIds, role, pbUrl });
  const selectedRoom =
    visibleRooms.find((r) => r.feedbackId === selectedId) ?? null;
  // 멘토관리처럼 항상 좌측 목록(멘토/멘티 로스터)을 노출한다.
  const showList = visibleRooms.length >= 1;

  const handleEnded = (feedbackId: number) => {
    const next = [...endedIds, feedbackId];
    setEndedIds(next);
    if (selectedId === feedbackId) {
      const remaining = rooms.filter((r) => !next.includes(r.feedbackId));
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
            rooms={visibleRooms}
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

function ChatRoomPanel({
  feedbackId,
  role,
  counterpartName,
  meta,
  pbUrl,
  onEnded,
}: {
  feedbackId: number;
  role: ChatRole;
  counterpartName: string;
  meta?: ChatRoomMeta;
  pbUrl?: string;
  onEnded: (feedbackId: number) => void;
}) {
  const room = chatRoomKey(feedbackId);
  const { messages } = useChatMessages({ room, pbUrl });
  const { sendMessage, markRead, endChat } = useChatRoom({
    feedbackId,
    role,
    meta,
    pbUrl,
  });

  // 진입·신규 메시지 수신 시 읽음 처리 → 안읽음 뱃지 리셋.
  const markReadRef = useRef(markRead);
  markReadRef.current = markRead;
  useEffect(() => {
    void markReadRef.current();
  }, [feedbackId, messages.length]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ending, setEnding] = useState(false);

  const handleEnd = async () => {
    setEnding(true);
    try {
      await endChat();
    } finally {
      setEnding(false);
      setConfirmOpen(false);
      onEnded(feedbackId);
    }
  };

  return (
    <>
      <div className="border-neutral-90 flex justify-end border-b px-4 py-2">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="border-neutral-80 text-neutral-40 hover:border-system-error hover:text-system-error flex items-center gap-1 rounded-md border bg-white px-2.5 py-1 text-xs font-semibold transition-colors"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          채팅 종료하기
        </button>
      </div>
      <ChatThread
        messages={messages}
        myRole={role}
        counterpartName={counterpartName}
      />
      <ChatComposer onSend={(text) => void sendMessage(text)} />

      {confirmOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: 10000 }}
          role="alertdialog"
          aria-modal="true"
          aria-label="채팅 종료 확인"
        >
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-neutral-10 text-base font-bold">
              채팅을 종료할까요?
            </h3>
            <p className="text-neutral-40 mt-2 text-sm leading-relaxed">
              멘토·멘티가 모두 종료하면 대화 내용이 삭제됩니다.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={ending}
                className="border-neutral-80 text-neutral-40 hover:bg-neutral-95 flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleEnd}
                disabled={ending}
                className="bg-system-error flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {ending ? '종료 중…' : '종료하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyRooms() {
  return (
    <div className="text-neutral-40 flex flex-1 items-center justify-center text-sm">
      대화할 상대가 없습니다.
    </div>
  );
}
