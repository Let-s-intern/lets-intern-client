'use client';

import { useCallback, useEffect, useState } from 'react';

import { getChatClient } from '../client';
import { COLLECTIONS } from '../config';
import { chatRoomKey } from '../roomKey';
import {
  ChatMessageSchema,
  ChatRoomSchema,
  LAST_READ_FIELD,
  type ChatMessage,
  type ChatRole,
} from '../schema';

/**
 * 한 메시지가 "내게 안 읽음"인지 판정 (PRD §7).
 * - 내가 보낸 메시지는 안읽음이 아니다.
 * - `lastReadAt`이 없으면(빈 문자열) 상대 메시지는 모두 안읽음.
 * - 동시각(`created === lastReadAt`)은 읽음으로 본다 → strict `>`.
 */
export function isUnread(
  message: Pick<ChatMessage, 'sender' | 'created'>,
  myRole: ChatRole,
  lastReadAt: string,
): boolean {
  if (message.sender === myRole) return false;
  if (!lastReadAt) return true;
  return message.created > lastReadAt;
}

/** 방별 lastReadAt 맵을 기준으로 전체 안읽음 합계 계산. */
export function sumUnread(
  messages: Pick<ChatMessage, 'room' | 'sender' | 'created'>[],
  myRole: ChatRole,
  lastReadByRoom: Record<string, string>,
): number {
  return messages.reduce(
    (acc, m) =>
      acc + (isUnread(m, myRole, lastReadByRoom[m.room] ?? '') ? 1 : 0),
    0,
  );
}

interface UseUnreadSummaryOptions {
  /** 내가 속한 방들의 feedbackId 목록 (피드백 API에서 파생). */
  feedbackIds: number[];
  role: ChatRole;
  pbUrl?: string;
}

interface UseUnreadSummaryResult {
  total: number;
  unreadByRoom: Record<string, number>;
}

function parseList<T>(
  records: unknown[],
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T } },
): T[] {
  const out: T[] = [];
  for (const record of records) {
    const result = schema.safeParse(record);
    if (result.success && result.data) out.push(result.data);
  }
  return out;
}

/**
 * 내 역할 기준 전체 안읽음 합계 (플로팅 뱃지용).
 *
 * 방 메타(lastReadAt)와 메시지를 병렬 fetch 후 `sumUnread`로 계산하고,
 * 메시지/방 변경 realtime 이벤트마다 재계산한다. 언마운트 시 구독 해제.
 */
export function useUnreadSummary({
  feedbackIds,
  role,
  pbUrl,
}: UseUnreadSummaryOptions): UseUnreadSummaryResult {
  const [unreadByRoom, setUnreadByRoom] = useState<Record<string, number>>({});
  const roomsKey = feedbackIds
    .slice()
    .sort((a, b) => a - b)
    .join(',');

  const load = useCallback(async () => {
    if (feedbackIds.length === 0) {
      setUnreadByRoom({});
      return;
    }
    const pb = getChatClient(pbUrl);
    const rooms = feedbackIds.map(chatRoomKey);
    const roomFilter = rooms.map((r) => `room="${r}"`).join(' || ');
    const otherRole: ChatRole = role === 'mentor' ? 'mentee' : 'mentor';

    const [roomRecords, messageRecords] = await Promise.all([
      pb.collection(COLLECTIONS.rooms).getFullList({ filter: roomFilter }),
      pb.collection(COLLECTIONS.messages).getFullList({
        filter: `(${roomFilter}) && sender="${otherRole}"`,
      }),
    ]);

    const lastReadByRoom: Record<string, string> = {};
    for (const r of parseList(roomRecords, ChatRoomSchema)) {
      lastReadByRoom[r.room] = r[LAST_READ_FIELD[role]];
    }

    const messages = parseList(messageRecords, ChatMessageSchema);
    const byRoom: Record<string, number> = {};
    for (const room of rooms) byRoom[room] = 0;
    for (const m of messages) {
      if (isUnread(m, role, lastReadByRoom[m.room] ?? '')) {
        byRoom[m.room] = (byRoom[m.room] ?? 0) + 1;
      }
    }
    setUnreadByRoom(byRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomsKey, role, pbUrl]);

  useEffect(() => {
    let active = true;
    let unsubscribers: (() => void)[] = [];

    void load();

    if (feedbackIds.length > 0) {
      const pb = getChatClient(pbUrl);
      const reload = () => {
        if (active) void load();
      };
      Promise.all([
        pb.collection(COLLECTIONS.messages).subscribe('*', reload),
        pb.collection(COLLECTIONS.rooms).subscribe('*', reload),
      ]).then((fns: (() => void)[]) => {
        if (active) unsubscribers = fns;
        else fns.forEach((fn) => fn());
      });
    }

    return () => {
      active = false;
      const fns = unsubscribers;
      unsubscribers = [];
      fns.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const total = Object.values(unreadByRoom).reduce((a, b) => a + b, 0);
  return { total, unreadByRoom };
}
