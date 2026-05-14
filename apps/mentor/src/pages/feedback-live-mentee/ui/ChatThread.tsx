import { useEffect, useRef } from 'react';

import type { Message } from '../schema';

interface ChatThreadProps {
  messages: Message[];
  menteeName: string;
}

export default function ChatThread({ messages, menteeName }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof bottomRef.current?.scrollIntoView === 'function') {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-neutral-40">
        아직 메시지가 없습니다.
      </div>
    );
  }

  const grouped = groupByDate(messages);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
      {grouped.map(({ date, messages: dayMessages }) => (
        <div key={date}>
          {/* 날짜 구분선 */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 border-t border-neutral-90" />
            <span className="text-xxsmall12 text-neutral-40">
              {formatDate(date)}
            </span>
            <div className="flex-1 border-t border-neutral-90" />
          </div>

          {dayMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} menteeName={menteeName} />
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({
  message,
  menteeName,
}: {
  message: Message;
  menteeName: string;
}) {
  const isMentor = message.sender === 'mentor';
  const time = new Date(message.sentAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`mb-2 flex items-end gap-2 ${isMentor ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isMentor && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-90 text-[10px] font-semibold text-neutral-30">
          {menteeName[0]}
        </div>
      )}
      <div
        className={`max-w-[70%] ${isMentor ? 'items-end' : 'items-start'} flex flex-col gap-1`}
      >
        <div
          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
            isMentor
              ? 'bg-primary rounded-br-sm text-white'
              : 'rounded-bl-sm bg-neutral-95 text-neutral-10'
          }`}
        >
          {message.text}
        </div>
        <span className="text-[10px] text-neutral-40">{time}</span>
      </div>
    </div>
  );
}

function groupByDate(
  messages: Message[],
): { date: string; messages: Message[] }[] {
  const map = new Map<string, Message[]>();
  for (const msg of messages) {
    const date = msg.sentAt.slice(0, 10);
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
