'use client';

import { useEffect, useRef, useState } from 'react';

import { useChatMessages } from '../hooks/useChatMessages';
import { useChatRoom, type ChatRoomMeta } from '../hooks/useChatRoom';
import { chatRoomKey } from '../roomKey';
import type { ChatRole } from '../schema';
import ChatComposer from './ChatComposer';
import ChatThread from './ChatThread';

interface ChatRoomViewProps {
  feedbackId: number;
  role: ChatRole;
  /** 상대 표시명(아바타·헤더용). */
  counterpartName: string;
  /** 방 생성 시 채울 메타. */
  meta?: ChatRoomMeta;
  pbUrl?: string;
  /** 내가 종료한 직후 호출(목록/선택 갱신용). 미지정 시 무시. */
  onEnded?: (feedbackId: number) => void;
}

/**
 * 한 방의 대화 화면 — 종료 바 + 스레드 + 입력창 + 종료 확인 다이얼로그.
 *
 * 모달(ChatModal)과 임베드(멘토 멘티관리) 양쪽이 공유한다. 종료 동작·디자인이
 * 한 곳에서 관리되도록 추출했다.
 */
export default function ChatRoomView({
  feedbackId,
  role,
  counterpartName,
  meta,
  pbUrl,
  onEnded,
}: ChatRoomViewProps) {
  const room = chatRoomKey(feedbackId);
  const { messages } = useChatMessages({ room, pbUrl });
  const { sendMessage, markRead, endChat, counterpartEnded } = useChatRoom({
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
      onEnded?.(feedbackId);
    }
  };

  return (
    <>
      <div className="border-neutral-90 flex items-center justify-between gap-2 border-b px-4 py-2">
        {counterpartEnded ? (
          <span className="text-system-error truncate text-xs font-semibold">
            상대가 채팅을 종료했어요. 종료하면 대화가 삭제됩니다.
          </span>
        ) : (
          <span aria-hidden />
        )}
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className={
            counterpartEnded
              ? 'bg-system-error flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90'
              : 'border-neutral-80 text-neutral-40 hover:border-system-error hover:text-system-error flex shrink-0 items-center gap-1 rounded-md border bg-white px-2.5 py-1 text-xs font-semibold transition-colors'
          }
        >
          <svg
            width={counterpartEnded ? 15 : 13}
            height={counterpartEnded ? 15 : 13}
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
