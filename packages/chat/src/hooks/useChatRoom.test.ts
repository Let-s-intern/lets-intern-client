import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const roomsGetFirst = vi.fn();
const roomsCreate = vi.fn();
const roomsUpdate = vi.fn();
const messagesCreate = vi.fn();

vi.mock('../client', () => ({
  getChatClient: () => ({
    collection: (name: string) =>
      name === 'chat_rooms'
        ? {
            getFirstListItem: roomsGetFirst,
            create: roomsCreate,
            update: roomsUpdate,
          }
        : { create: messagesCreate },
  }),
}));

import { useChatRoom } from './useChatRoom';

describe('useChatRoom', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    roomsGetFirst.mockResolvedValue({ id: 'room1', room: 'feedback_1' });
    roomsCreate.mockResolvedValue({ id: 'room1', room: 'feedback_1' });
    roomsUpdate.mockResolvedValue({});
    messagesCreate.mockResolvedValue({});
  });

  it('room 키는 feedbackId로 합성된다', () => {
    const { result } = renderHook(() =>
      useChatRoom({ feedbackId: 1, role: 'mentee' }),
    );
    expect(result.current.room).toBe('feedback_1');
  });

  it('sendMessage가 주입된 role을 sender로 메시지를 생성한다', async () => {
    const { result } = renderHook(() =>
      useChatRoom({ feedbackId: 1, role: 'mentee' }),
    );
    await result.current.sendMessage('  안녕  ');
    expect(messagesCreate).toHaveBeenCalledWith({
      room: 'feedback_1',
      sender: 'mentee',
      text: '안녕',
    });
  });

  it('빈/공백 메시지는 전송하지 않는다 (early return)', async () => {
    const { result } = renderHook(() =>
      useChatRoom({ feedbackId: 1, role: 'mentor' }),
    );
    await result.current.sendMessage('   ');
    expect(messagesCreate).not.toHaveBeenCalled();
  });

  it('방이 없으면 meta와 함께 생성한다 (upsert)', async () => {
    roomsGetFirst.mockRejectedValueOnce(new Error('404'));
    const { result } = renderHook(() =>
      useChatRoom({
        feedbackId: 7,
        role: 'mentor',
        meta: { menteeName: '김멘티', challengeTitle: '챌린지' },
      }),
    );
    await result.current.markRead();
    expect(roomsCreate).toHaveBeenCalledWith({
      room: 'feedback_7',
      menteeName: '김멘티',
      challengeTitle: '챌린지',
    });
  });

  it('markRead가 내 역할의 lastReadAt 필드를 갱신한다', async () => {
    const { result } = renderHook(() =>
      useChatRoom({ feedbackId: 1, role: 'mentor' }),
    );
    await result.current.markRead();
    expect(roomsUpdate).toHaveBeenCalledTimes(1);
    const [id, payload] = roomsUpdate.mock.calls[0];
    expect(id).toBe('room1');
    expect(payload).toHaveProperty('mentorLastReadAt');
    expect(payload).not.toHaveProperty('menteeLastReadAt');
  });

  it('멘티 markRead는 menteeLastReadAt를 갱신한다', async () => {
    const { result } = renderHook(() =>
      useChatRoom({ feedbackId: 1, role: 'mentee' }),
    );
    await result.current.markRead();
    expect(roomsUpdate.mock.calls[0][1]).toHaveProperty('menteeLastReadAt');
  });
});
