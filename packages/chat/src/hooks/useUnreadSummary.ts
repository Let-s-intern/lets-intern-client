'use client';

import { useCallback, useEffect, useState } from 'react';

import { getChatClient } from '../client';
import { COLLECTIONS } from '../config';
import { chatRoomKey } from '../roomKey';
import {
  ChatMessageSchema,
  ChatRoomSchema,
  ENDED_FIELD,
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
  /** 메시지가 있고(빈 방 제외) 내가 종료(숨김)하지 않은 방 키 집합. */
  visibleRooms: Set<string>;
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
  const [state, setState] = useState<{
    unreadByRoom: Record<string, number>;
    visibleRooms: Set<string>;
  }>({ unreadByRoom: {}, visibleRooms: new Set<string>() });

  const roomsKey = feedbackIds
    .slice()
    .sort((a, b) => a - b)
    .join(',');

  const load = useCallback(async () => {
    if (feedbackIds.length === 0) {
      setState({ unreadByRoom: {}, visibleRooms: new Set<string>() });
      return;
    }
    const pb = getChatClient(pbUrl);
    const rooms = feedbackIds.map(chatRoomKey);
    const roomFilter = rooms.map((r) => `room="${r}"`).join(' || ');

    const [roomRecords, messageRecords] = await Promise.all([
      pb.collection(COLLECTIONS.rooms).getFullList({ filter: roomFilter }),
      pb.collection(COLLECTIONS.messages).getFullList({ filter: roomFilter }),
    ]);

    const lastReadByRoom: Record<string, string> = {};
    const endedByRoom: Record<string, boolean> = {};
    for (const r of parseList(roomRecords, ChatRoomSchema)) {
      lastReadByRoom[r.room] = r[LAST_READ_FIELD[role]];
      endedByRoom[r.room] = Boolean(r[ENDED_FIELD[role]]);
    }

    const messages = parseList(messageRecords, ChatMessageSchema);
    const unreadByRoom: Record<string, number> = {};
    const hasMessages: Record<string, boolean> = {};
    for (const room of rooms) unreadByRoom[room] = 0;
    for (const m of messages) {
      hasMessages[m.room] = true;
      if (isUnread(m, role, lastReadByRoom[m.room] ?? '')) {
        unreadByRoom[m.room] = (unreadByRoom[m.room] ?? 0) + 1;
      }
    }

    // 메시지가 있고(빈 방 제외) 내가 종료(숨김)하지 않은 방만 노출.
    const visibleRooms = new Set<string>();
    for (const room of rooms) {
      if (hasMessages[room] && !endedByRoom[room]) visibleRooms.add(room);
    }

    setState({ unreadByRoom, visibleRooms });
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

  // 숨겨진/빈 방의 안읽음은 합계에서 제외한다.
  const total = Array.from(state.visibleRooms).reduce(
    (acc, room) => acc + (state.unreadByRoom[room] ?? 0),
    0,
  );
  return {
    total,
    unreadByRoom: state.unreadByRoom,
    visibleRooms: state.visibleRooms,
  };
}
