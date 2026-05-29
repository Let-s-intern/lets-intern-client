import { describe, expect, it } from 'vitest';

import { ChatMessageSchema, ChatRoomSchema } from './schema';

describe('ChatMessageSchema', () => {
  it('정상 메시지 레코드를 파싱한다', () => {
    const parsed = ChatMessageSchema.parse({
      id: 'abc',
      room: 'feedback_1',
      sender: 'mentor',
      text: '안녕하세요',
      created: '2026-05-28 00:00:00.000Z',
      collectionId: 'pb_extra',
    });
    expect(parsed.sender).toBe('mentor');
    expect(parsed.text).toBe('안녕하세요');
  });

  it('sender가 mentor/mentee가 아니면 실패한다', () => {
    const result = ChatMessageSchema.safeParse({
      id: 'abc',
      room: 'feedback_1',
      sender: 'admin',
      text: 'x',
      created: '2026-05-28',
    });
    expect(result.success).toBe(false);
  });
});

describe('ChatRoomSchema', () => {
  it('lastReadAt/이름 미설정 시 빈 문자열로 기본값 채운다', () => {
    const parsed = ChatRoomSchema.parse({
      id: 'room1',
      room: 'feedback_1',
    });
    expect(parsed.mentorLastReadAt).toBe('');
    expect(parsed.menteeLastReadAt).toBe('');
    expect(parsed.menteeName).toBe('');
  });
});
