import { describe, expect, it } from 'vitest';

import { chatRoomKey, feedbackIdFromRoomKey } from './roomKey';

describe('chatRoomKey', () => {
  it('feedbackId로 feedback_{id} 키를 만든다', () => {
    expect(chatRoomKey(1234)).toBe('feedback_1234');
  });

  it('멘토/멘티가 동일 feedbackId면 동일 키로 수렴한다', () => {
    const feedbackId = 42;
    const mentorRoom = chatRoomKey(feedbackId);
    const menteeRoom = chatRoomKey(feedbackId);
    expect(mentorRoom).toBe(menteeRoom);
  });

  it('서로 다른 feedbackId는 다른 키가 된다', () => {
    expect(chatRoomKey(1)).not.toBe(chatRoomKey(2));
  });
});

describe('feedbackIdFromRoomKey', () => {
  it('키에서 feedbackId를 역으로 추출한다', () => {
    expect(feedbackIdFromRoomKey('feedback_1234')).toBe(1234);
  });

  it('round-trip이 보존된다', () => {
    expect(feedbackIdFromRoomKey(chatRoomKey(777))).toBe(777);
  });

  it('형식이 맞지 않으면 null을 반환한다', () => {
    expect(feedbackIdFromRoomKey('room_1')).toBeNull();
    expect(feedbackIdFromRoomKey('feedback_')).toBeNull();
    expect(feedbackIdFromRoomKey('feedback_abc')).toBeNull();
  });
});
