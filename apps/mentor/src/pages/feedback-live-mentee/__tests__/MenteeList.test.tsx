import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Mentee } from '../schema';
import MenteeList from '../ui/MenteeList';

const mockMentees: Mentee[] = [
  {
    id: '1',
    name: '홍길동',
    email: 'hong@test.com',
    avatarInitial: '홍',
    challengeTitle: '챌린지 1기',
    unreadCount: 2,
    lastMessage: '안녕하세요',
    lastMessageAt: '2025-05-03T10:00:00',
  },
  {
    id: '2',
    name: '김철수',
    email: 'kim@test.com',
    avatarInitial: '김',
    challengeTitle: '챌린지 2기',
    unreadCount: 0,
    lastMessage: '감사합니다',
    lastMessageAt: '2025-05-02T10:00:00',
  },
];

describe('MenteeList', () => {
  it('renders all mentees', () => {
    render(
      <MenteeList
        mentees={mockMentees}
        activeMenteeId={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();
  });

  it('filters by name', async () => {
    const user = userEvent.setup();
    render(
      <MenteeList
        mentees={mockMentees}
        activeMenteeId={null}
        onSelect={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText('멘티 검색'), '홍');
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.queryByText('김철수')).not.toBeInTheDocument();
  });

  it('shows unread count badge', () => {
    render(
      <MenteeList
        mentees={mockMentees}
        activeMenteeId={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onSelect when mentee row clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <MenteeList
        mentees={mockMentees}
        activeMenteeId={null}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByLabelText('홍길동 멘티 대화 선택'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
