import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

let mockTotal = 0;
vi.mock('../hooks/useUnreadSummary', () => ({
  useUnreadSummary: () => ({ total: mockTotal, unreadByRoom: {} }),
}));

import ChatFloatingButton from './ChatFloatingButton';

describe('ChatFloatingButton', () => {
  afterEach(() => {
    mockTotal = 0;
  });

  it('방이 없으면 버튼을 렌더하지 않는다', () => {
    mockTotal = 0;
    render(
      <ChatFloatingButton role="mentee" feedbackIds={[]} onOpen={vi.fn()} />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('방이 있으면 안읽음 0이어도 버튼을 표시한다(뱃지 없음)', () => {
    mockTotal = 0;
    render(
      <ChatFloatingButton role="mentee" feedbackIds={[1]} onOpen={vi.fn()} />,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByText(/\d/)).not.toBeInTheDocument();
  });

  it('안읽음이 있으면 개수 뱃지를 표시한다', () => {
    mockTotal = 5;
    render(
      <ChatFloatingButton
        role="mentor"
        feedbackIds={[1, 2]}
        onOpen={vi.fn()}
      />,
    );
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      '채팅 열기, 안 읽은 메시지 5개',
    );
  });

  it('100개 이상은 99+로 표기한다', () => {
    mockTotal = 150;
    render(
      <ChatFloatingButton role="mentor" feedbackIds={[1]} onOpen={vi.fn()} />,
    );
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('클릭 시 onOpen을 호출한다', async () => {
    mockTotal = 5;
    const onOpen = vi.fn();
    render(
      <ChatFloatingButton role="mentee" feedbackIds={[1]} onOpen={onOpen} />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
