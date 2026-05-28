/**
 * 멘토 전역 채팅 런처 — feedbackId[] 파생 + 모달 연결 검증.
 *
 * 패키지 컴포넌트(ChatFloatingButton/ChatModal)는 PocketBase realtime에 연결되므로
 * 모킹해 래퍼가 전달하는 props(role·feedbackIds·rooms)만 검증한다.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MemoryRouter } from 'react-router-dom';

import axios from '@/utils/axios';

vi.mock('@/utils/axios', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

vi.mock('@letscareer/chat/ui/ChatFloatingButton', () => ({
  default: ({
    role,
    feedbackIds,
    onOpen,
  }: {
    role: string;
    feedbackIds: number[];
    onOpen: () => void;
  }) => (
    <button
      type="button"
      data-testid="floating-button"
      data-role={role}
      data-feedback-ids={feedbackIds.join(',')}
      onClick={onOpen}
    >
      채팅 열기
    </button>
  ),
}));

vi.mock('@letscareer/chat/ui/ChatModal', () => ({
  default: ({
    role,
    rooms,
  }: {
    role: string;
    rooms: { feedbackId: number; title: string }[];
  }) => (
    <div
      data-testid="chat-modal"
      data-role={role}
      data-room-ids={rooms.map((r) => r.feedbackId).join(',')}
      data-room-titles={rooms.map((r) => r.title).join(',')}
    />
  ),
}));

import MentorChatLauncher from '../MentorChatLauncher';

function makeFeedback(overrides: Record<string, unknown> = {}) {
  return {
    feedbackId: 1,
    startDate: '2026-05-20T10:00:00',
    endDate: '2026-05-20T10:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    menteeName: '이지수',
    ...overrides,
  };
}

const axiosMock = vi.mocked(axios, true);

function renderLauncher() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <MentorChatLauncher />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  axiosMock.get.mockResolvedValue({
    data: {
      data: {
        feedbackList: [
          makeFeedback({ feedbackId: 1, menteeName: '이지수' }),
          makeFeedback({ feedbackId: 2, menteeName: '박서연' }),
        ],
      },
    },
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('MentorChatLauncher', () => {
  it('role=mentor·목록의 feedbackId[]를 플로팅 버튼에 주입한다', async () => {
    renderLauncher();
    const btn = await screen.findByTestId('floating-button');
    await vi.waitFor(() =>
      expect(btn).toHaveAttribute('data-feedback-ids', '1,2'),
    );
    expect(btn).toHaveAttribute('data-role', 'mentor');
  });

  it('클릭 전에는 모달이 렌더되지 않는다', async () => {
    renderLauncher();
    await screen.findByTestId('floating-button');
    expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument();
  });

  it('클릭 시 세션(feedbackId) 단위 방 목록으로 모달을 연다', async () => {
    const user = userEvent.setup();
    renderLauncher();
    const btn = await screen.findByTestId('floating-button');
    await vi.waitFor(() =>
      expect(btn).toHaveAttribute('data-feedback-ids', '1,2'),
    );

    await user.click(btn);

    const modal = await screen.findByTestId('chat-modal');
    expect(modal).toHaveAttribute('data-role', 'mentor');
    expect(modal).toHaveAttribute('data-room-ids', '1,2');
    expect(modal).toHaveAttribute('data-room-titles', '이지수,박서연');
  });
});
