import { z } from 'zod';

/** 메시지 보낸 역할 = 현재 사용자의 역할(앱이 주입). */
export const ChatRoleSchema = z.enum(['mentor', 'mentee']);
export type ChatRole = z.infer<typeof ChatRoleSchema>;

/**
 * `chat_messages` 레코드 (PRD §6).
 * PB 응답은 메타 필드(collectionId 등)가 더 있으나 패키지에서 쓰는 필드만 파싱한다.
 */
export const ChatMessageSchema = z.object({
  id: z.string(),
  room: z.string(),
  sender: ChatRoleSchema,
  text: z.string(),
  created: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/**
 * `chat_rooms` 레코드 (PRD §6). 안읽음 추적·표시 메타.
 * 날짜/이름 필드는 미설정 시 PB가 빈 문자열을 반환하므로 기본값 ''로 둔다.
 */
export const ChatRoomSchema = z.object({
  id: z.string(),
  room: z.string(),
  mentorLastReadAt: z.string().optional().default(''),
  menteeLastReadAt: z.string().optional().default(''),
  mentorName: z.string().optional().default(''),
  menteeName: z.string().optional().default(''),
  challengeTitle: z.string().optional().default(''),
});
export type ChatRoom = z.infer<typeof ChatRoomSchema>;

/** 역할별 `lastReadAt` 필드명. */
export const LAST_READ_FIELD = {
  mentor: 'mentorLastReadAt',
  mentee: 'menteeLastReadAt',
} as const;
