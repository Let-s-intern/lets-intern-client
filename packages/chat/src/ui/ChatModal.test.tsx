import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const markRead = vi.fn();
const sendMessage = vi.fn();

vi.mock('../hooks/useChatMessages', () => ({
  useChatMessages: () => ({ messages: [], isLoading: false }),
}));
vi.mock('../hooks/useChatRoom', () => ({
  useChatRoom: () => ({
    room: 'feedback_1',
    sendMessage,
    markRead,
    endChat: vi.fn().mockResolvedValue({ deleted: false }),
  }),
}));
vi.mock('../hooks/useUnreadSummary', () => ({
  useUnreadSummary: () => ({
    total: 3,
    unreadByRoom: { feedback_1: 3, feedback_2: 0 },
    visibleRooms: new Set(['feedback_1', 'feedback_2']),
  }),
}));

import ChatModal from './ChatModal';
import type { ChatRoomListItem } from './ChatModal';

const ROOMS: ChatRoomListItem[] = [
  { feedbackId: 1, title: '김멘티', subtitle: '챌린지A' },
  { feedbackId: 2, title: '이멘티', subtitle: '챌린지B' },
];

describe('ChatModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    markRead.mockResolvedValue(undefined);
  });

  it('진입 시 선택된 방의 markRead를 호출한다', () => {
    render(
      <ChatModal
        role="mentor"
        rooms={ROOMS}
        activeFeedbackId={1}
        onClose={vi.fn()}
      />,
    );
    expect(markRead).toHaveBeenCalled();
  });

  it('방이 2개 이상이면 목록과 안읽음 뱃지를 보여준다', () => {
    render(<ChatModal role="mentor" rooms={ROOMS} onClose={vi.fn()} />);
    // 김멘티는 목록 + 헤더(선택됨)에 모두 노출
    expect(screen.getAllByText('김멘티').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('이멘티')).toBeInTheDocument();
    // feedback_1 안읽음 3 뱃지
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('목록에서 다른 방 선택 시 헤더 제목이 바뀐다', async () => {
    render(<ChatModal role="mentor" rooms={ROOMS} onClose={vi.fn()} />);
    await userEvent.click(screen.getByText('이멘티'));
    expect(screen.getByRole('heading', { name: '이멘티' })).toBeInTheDocument();
  });

  it('빈 목록이면 빈 상태를 보여준다', () => {
    render(<ChatModal role="mentee" rooms={[]} onClose={vi.fn()} />);
    expect(screen.getByText('대화할 상대가 없습니다.')).toBeInTheDocument();
  });

  it('단일 방이어도 목록(멘토관리 스타일)을 표시한다', () => {
    render(<ChatModal role="mentee" rooms={[ROOMS[0]]} onClose={vi.fn()} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose 호출', async () => {
    const onClose = vi.fn();
    render(<ChatModal role="mentor" rooms={ROOMS} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText('채팅 닫기'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
