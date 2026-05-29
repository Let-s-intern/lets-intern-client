'use client';

import { useEffect, useState } from 'react';

import { getChatClient } from '../client';
import { COLLECTIONS } from '../config';
import { ChatMessageSchema, type ChatMessage } from '../schema';

interface UseChatMessagesOptions {
  /** 방 키 (`feedback_{id}`). null이면 비활성(빈 목록). */
  room: string | null;
  /** PB 인스턴스 override (기본값은 config 상수). */
  pbUrl?: string;
}

interface UseChatMessagesResult {
  messages: ChatMessage[];
  isLoading: boolean;
}

/** `created` 오름차순 정렬을 유지하며 중복 없이 메시지를 추가한다. */
function appendSorted(prev: ChatMessage[], next: ChatMessage): ChatMessage[] {
  if (prev.some((m) => m.id === next.id)) return prev;
  const merged = [...prev, next];
  merged.sort((a, b) => a.created.localeCompare(b.created));
  return merged;
}

function parseMessages(records: unknown[]): ChatMessage[] {
  const parsed: ChatMessage[] = [];
  for (const record of records) {
    const result = ChatMessageSchema.safeParse(record);
    if (result.success) parsed.push(result.data);
  }
  parsed.sort((a, b) => a.created.localeCompare(b.created));
  return parsed;
}

/**
 * 단일 방의 메시지 목록 + realtime 구독.
 *
 * - 초기 `getFullList` fetch 후 `subscribe`로 신규 메시지 append.
 * - `room` 변경/언마운트 시 unsubscribe (effect cleanup → 누수 차단).
 */
export function useChatMessages({
  room,
  pbUrl,
}: UseChatMessagesOptions): UseChatMessagesResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!room) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const pb = getChatClient(pbUrl);
    const collection = pb.collection(COLLECTIONS.messages);
    const filter = `room="${room}"`;
    let active = true;
    let unsubscribe: (() => void) | undefined;

    setIsLoading(true);
    collection
      .getFullList({ filter, sort: 'created' })
      .then((records) => {
        if (active) setMessages(parseMessages(records));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    collection
      .subscribe(
        '*',
        (event: { action: string; record: unknown }) => {
          if (event.action !== 'create') return;
          const result = ChatMessageSchema.safeParse(event.record);
          if (!result.success || result.data.room !== room) return;
          setMessages((prev) => appendSorted(prev, result.data));
        },
        { filter },
      )
      .then((fn: () => void) => {
        // 이미 cleanup이 끝났으면 즉시 해제, 아니면 핸들 보관 (단 한 번만 호출).
        if (active) unsubscribe = fn;
        else fn();
      });

    return () => {
      active = false;
      const fn = unsubscribe;
      unsubscribe = undefined;
      fn?.();
    };
  }, [room, pbUrl]);

  return { messages, isLoading };
}
