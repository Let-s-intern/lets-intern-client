'use client';

import { useEffect, useRef } from 'react';

import type { ChatMessage, ChatRole } from '../schema';

/** 자동 스크롤 지연 (DOM 반영 후 스크롤). */
const SCROLL_DELAY_MS = 0;

interface ChatThreadProps {
  messages: ChatMessage[];
  /** 현재 사용자 역할 — 내 메시지는 오른쪽 정렬. */
  myRole: ChatRole;
  /** 상대 이름 (아바타 이니셜·표시용). */
  counterpartName?: string;
}

export default function ChatThread({
  messages,
  myRole,
  counterpartName = '',
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof bottomRef.current?.scrollIntoView === 'function') {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, SCROLL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="text-neutral-40 flex flex-1 items-center justify-center text-sm">
        아직 메시지가 없습니다.
      </div>
    );
  }

  const grouped = groupByDate(messages);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
      {grouped.map(({ date, messages: dayMessages }) => (
        <div key={date}>
          {/* 날짜 구분선 */}
          <div className="flex items-center gap-3 py-2">
            <div className="border-neutral-90 flex-1 border-t" />
            <span className="text-xxsmall12 text-neutral-40">
              {formatDate(date)}
            </span>
            <div className="border-neutral-90 flex-1 border-t" />
          </div>

          {dayMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              myRole={myRole}
              counterpartName={counterpartName}
            />
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({
  message,
  myRole,
  counterpartName,
}: {
  message: ChatMessage;
  myRole: ChatRole;
  counterpartName: string;
}) {
  // 시스템 메시지(채팅 종료 안내 등)는 가운데 정렬 안내로 표시.
  if (message.sender === 'system') {
    return (
      <div className="my-2 flex justify-center">
        <span className="bg-neutral-95 text-neutral-40 rounded-full px-3 py-1 text-[11px]">
          {message.text}
        </span>
      </div>
    );
  }

  const isMine = message.sender === myRole;
  const time = new Date(message.created).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`mb-2 flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isMine && (
        <div className="bg-neutral-90 text-neutral-30 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
          {counterpartName[0] ?? ''}
        </div>
      )}
      <div
        className={`flex max-w-[70%] flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
            isMine
              ? 'bg-primary rounded-br-sm text-white'
              : 'bg-neutral-95 text-neutral-10 rounded-bl-sm'
          }`}
        >
          {message.text}
        </div>
        <span className="text-neutral-40 text-[10px]">{time}</span>
      </div>
    </div>
  );
}

function groupByDate(
  messages: ChatMessage[],
): { date: string; messages: ChatMessage[] }[] {
  const map = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    const date = msg.created.slice(0, 10);
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(msg);
  }
  return Array.from(map.entries()).map(([date, messages]) => ({
    date,
    messages,
  }));
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}
