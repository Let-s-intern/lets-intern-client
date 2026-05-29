import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isUnread, sumUnread } from './useUnreadSummary';

describe('isUnread (경계)', () => {
  it('내가 보낸 메시지는 안읽음이 아니다', () => {
    expect(
      isUnread({ sender: 'mentor', created: '2026-05-28 10:00' }, 'mentor', ''),
    ).toBe(false);
  });

  it('lastReadAt이 없으면 상대 메시지는 모두 안읽음', () => {
    expect(
      isUnread({ sender: 'mentee', created: '2026-05-28 10:00' }, 'mentor', ''),
    ).toBe(true);
  });

  it('lastReadAt 이후 메시지만 안읽음', () => {
    const lastRead = '2026-05-28 10:00:00.000Z';
    expect(
      isUnread(
        { sender: 'mentee', created: '2026-05-28 10:00:01.000Z' },
        'mentor',
        lastRead,
      ),
    ).toBe(true);
    expect(
      isUnread(
        { sender: 'mentee', created: '2026-05-28 09:59:59.000Z' },
        'mentor',
        lastRead,
      ),
    ).toBe(false);
  });

  it('동시각(created === lastReadAt)은 읽음으로 본다', () => {
    const t = '2026-05-28 10:00:00.000Z';
    expect(isUnread({ sender: 'mentee', created: t }, 'mentor', t)).toBe(false);
  });
});

describe('sumUnread', () => {
  it('여러 방의 안읽음을 합산한다', () => {
    const messages = [
      { room: 'feedback_1', sender: 'mentee' as const, created: '3' },
      { room: 'feedback_1', sender: 'mentor' as const, created: '4' },
      { room: 'feedback_2', sender: 'mentee' as const, created: '5' },
    ];
    const lastReadByRoom = { feedback_1: '1', feedback_2: '9' };
    // f1: mentee@3 > 1 → 1개 / f2: mentee@5 < 9 → 0개
    expect(sumUnread(messages, 'mentor', lastReadByRoom)).toBe(1);
  });
});

const roomsGetFullList = vi.fn();
const messagesGetFullList = vi.fn();
const subscribe = vi.fn();

vi.mock('../client', () => ({
  getChatClient: () => ({
    collection: (name: string) =>
      name === 'chat_rooms'
        ? { getFullList: roomsGetFullList, subscribe }
        : { getFullList: messagesGetFullList, subscribe },
  }),
}));

import { useUnreadSummary } from './useUnreadSummary';

describe('useUnreadSummary (hook)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    subscribe.mockResolvedValue(() => {});
    roomsGetFullList.mockResolvedValue([
      { id: 'r1', room: 'feedback_1', mentorLastReadAt: '2026-05-28 10:00' },
      { id: 'r2', room: 'feedback_2', mentorLastReadAt: '' },
    ]);
    messagesGetFullList.mockResolvedValue([
      {
        id: 'm1',
        room: 'feedback_1',
        sender: 'mentee',
        text: 'a',
        created: '2026-05-28 11:00',
      },
      {
        id: 'm2',
        room: 'feedback_2',
        sender: 'mentee',
        text: 'b',
        created: '2026-05-28 09:00',
      },
    ]);
  });

  it('feedbackIds가 비면 total 0이고 fetch하지 않는다', () => {
    const { result } = renderHook(() =>
      useUnreadSummary({ feedbackIds: [], role: 'mentor' }),
    );
    expect(result.current.total).toBe(0);
    expect(roomsGetFullList).not.toHaveBeenCalled();
  });

  it('역할 기준 방별 안읽음 합계를 계산한다', async () => {
    const { result } = renderHook(() =>
      useUnreadSummary({ feedbackIds: [1, 2], role: 'mentor' }),
    );
    // f1: lastRead 10:00, mentee@11:00 → 1 / f2: lastRead 없음, mentee@09:00 → 1
    await waitFor(() => expect(result.current.total).toBe(2));
    expect(result.current.unreadByRoom).toEqual({
      feedback_1: 1,
      feedback_2: 1,
    });
  });
});
