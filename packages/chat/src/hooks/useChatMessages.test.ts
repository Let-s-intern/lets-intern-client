import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type SubscribeCallback = (event: { action: string; record: unknown }) => void;

const getFullList = vi.fn();
const subscribe = vi.fn();
const unsubscribe = vi.fn();
let capturedCallback: SubscribeCallback | null = null;

vi.mock('../client', () => ({
  getChatClient: () => ({
    collection: () => ({ getFullList, subscribe }),
  }),
}));

import { useChatMessages } from './useChatMessages';

function msg(id: string, created: string, sender = 'mentee') {
  return { id, room: 'feedback_1', sender, text: id, created };
}

describe('useChatMessages', () => {
  beforeEach(() => {
    // 직전 테스트의 testing-library auto-cleanup(언마운트)이 afterEach 이후 실행되어
    // unsubscribe 호출이 누적될 수 있으므로, 각 테스트 시작 시점에 초기화한다.
    vi.clearAllMocks();
    capturedCallback = null;
    getFullList.mockResolvedValue([
      msg('b', '2026-05-28 10:00:00.000Z'),
      msg('a', '2026-05-28 09:00:00.000Z'),
    ]);
    subscribe.mockImplementation((_topic, cb: SubscribeCallback) => {
      capturedCallback = cb;
      return Promise.resolve(unsubscribe);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    capturedCallback = null;
  });

  it('초기 fetch 결과를 created 오름차순으로 정렬한다', async () => {
    const { result } = renderHook(() =>
      useChatMessages({ room: 'feedback_1' }),
    );
    await waitFor(() =>
      expect(result.current.messages.map((m) => m.id)).toEqual(['a', 'b']),
    );
  });

  it('realtime create 이벤트를 정렬 위치에 append한다', async () => {
    const { result } = renderHook(() =>
      useChatMessages({ room: 'feedback_1' }),
    );
    await waitFor(() => expect(result.current.messages).toHaveLength(2));

    act(() => {
      capturedCallback?.({
        action: 'create',
        record: msg('c', '2026-05-28 09:30:00.000Z', 'mentor'),
      });
    });
    expect(result.current.messages.map((m) => m.id)).toEqual(['a', 'c', 'b']);
  });

  it('다른 방의 메시지/중복 id는 무시한다', async () => {
    const { result } = renderHook(() =>
      useChatMessages({ room: 'feedback_1' }),
    );
    await waitFor(() => expect(result.current.messages).toHaveLength(2));

    act(() => {
      capturedCallback?.({
        action: 'create',
        record: { ...msg('z', '2026-05-28 11:00:00.000Z'), room: 'feedback_9' },
      });
      capturedCallback?.({
        action: 'create',
        record: msg('a', '2026-05-28 09:00:00.000Z'),
      });
    });
    expect(result.current.messages).toHaveLength(2);
  });

  it('언마운트 시 unsubscribe를 호출한다', async () => {
    const { unmount } = renderHook(() =>
      useChatMessages({ room: 'feedback_1' }),
    );
    await waitFor(() => expect(subscribe).toHaveBeenCalled());
    unmount();
    await waitFor(() => expect(unsubscribe).toHaveBeenCalledTimes(1));
  });

  it('room이 null이면 구독하지 않고 빈 목록이다', () => {
    const { result } = renderHook(() => useChatMessages({ room: null }));
    expect(result.current.messages).toEqual([]);
    expect(subscribe).not.toHaveBeenCalled();
  });
});
