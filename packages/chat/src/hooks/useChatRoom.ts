'use client';

import { useCallback, useMemo } from 'react';

import { getChatClient } from '../client';
import { COLLECTIONS } from '../config';
import { chatRoomKey } from '../roomKey';
import { LAST_READ_FIELD, type ChatRole } from '../schema';

/** 방 메타 (생성 시 1회 채움 — 표시·그룹핑용). */
export interface ChatRoomMeta {
  mentorName?: string;
  menteeName?: string;
  challengeTitle?: string;
}

interface UseChatRoomOptions {
  feedbackId: number;
  role: ChatRole;
  meta?: ChatRoomMeta;
  pbUrl?: string;
}

interface UseChatRoomResult {
  room: string;
  sendMessage: (text: string) => Promise<void>;
  markRead: () => Promise<void>;
  /** 내 역할의 종료(숨김) 플래그 set + 종료 안내 메시지. 메시지는 보존(삭제 X). */
  endChat: () => Promise<void>;
}

/**
 * 한 방에 대한 전송 + 읽음 처리.
 *
 * - `sendMessage`: 메시지 create (sender = 주입 role) + 방 보장(upsert).
 *   두 작업은 서로 독립이라 `Promise.all`로 병렬 실행.
 * - `markRead`: 방 보장 후 내 역할의 `lastReadAt = now()` update → 안읽음 리셋.
 * - 방이 없으면 첫 전송/읽음 시 create (unique 충돌 시 재조회로 멱등).
 */
export function useChatRoom({
  feedbackId,
  role,
  meta,
  pbUrl,
}: UseChatRoomOptions): UseChatRoomResult {
  const room = useMemo(() => chatRoomKey(feedbackId), [feedbackId]);
  const metaKey = JSON.stringify(meta ?? {});

  const ensureRoom = useCallback(async (): Promise<{ id: string }> => {
    const pb = getChatClient(pbUrl);
    const rooms = pb.collection(COLLECTIONS.rooms);
    try {
      return await rooms.getFirstListItem(`room="${room}"`);
    } catch {
      try {
        return await rooms.create({ room, ...(meta ?? {}) });
      } catch {
        // unique 제약 충돌 등 — 동시 생성된 방을 재조회.
        return await rooms.getFirstListItem(`room="${room}"`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, pbUrl, metaKey]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const pb = getChatClient(pbUrl);
      const record = (await ensureRoom()) as {
        id: string;
        mentorEnded?: boolean;
        menteeEnded?: boolean;
      };
      const endedField = role === 'mentor' ? 'mentorEnded' : 'menteeEnded';
      // 내가 종료(숨김)했던 방에 다시 보내면 내 화면에 다시 보이게(플래그 해제).
      if (record[endedField]) {
        await pb
          .collection(COLLECTIONS.rooms)
          .update(record.id, { [endedField]: false });
      }
      await pb
        .collection(COLLECTIONS.messages)
        .create({ room, sender: role, text: trimmed });
    },
    [room, role, pbUrl, ensureRoom],
  );

  const markRead = useCallback(async () => {
    const pb = getChatClient(pbUrl);
    const record = await ensureRoom();
    await pb
      .collection(COLLECTIONS.rooms)
      .update(record.id, { [LAST_READ_FIELD[role]]: new Date().toISOString() });
  }, [role, pbUrl, ensureRoom]);

  const endChat = useCallback(async (): Promise<void> => {
    const pb = getChatClient(pbUrl);
    const record = await ensureRoom();
    const endedField = role === 'mentor' ? 'mentorEnded' : 'menteeEnded';
    // 종료 안내 + 내 종료(숨김) 플래그 set.
    await pb.collection(COLLECTIONS.messages).create({
      room,
      sender: 'system',
      text: `${role === 'mentor' ? '멘토' : '멘티'}가 채팅을 종료했습니다.`,
    });
    const updated = await pb
      .collection(COLLECTIONS.rooms)
      .update<{ mentorEnded?: boolean; menteeEnded?: boolean }>(record.id, {
        [endedField]: true,
      });

    // 멘토·멘티 둘 다 종료하면 메시지 + 방 삭제.
    if (updated.mentorEnded && updated.menteeEnded) {
      const messages = await pb
        .collection(COLLECTIONS.messages)
        .getFullList({ filter: `room="${room}"` });
      await Promise.all(
        messages.map((m) => pb.collection(COLLECTIONS.messages).delete(m.id)),
      );
      await pb.collection(COLLECTIONS.rooms).delete(record.id);
    }
  }, [room, role, pbUrl, ensureRoom]);

  return { room, sendMessage, markRead, endChat };
}
