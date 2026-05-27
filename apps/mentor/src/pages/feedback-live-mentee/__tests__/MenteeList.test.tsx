import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Mentee } from '../schema';
import MenteeList from '../ui/MenteeList';

const mockMentees: Mentee[] = [
  {
    id: '홍길동|챌린지 1기',
    name: '홍길동',
    avatarInitial: '홍',
    challengeTitle: '챌린지 1기',
  },
  {
    id: '김철수|챌린지 2기',
    name: '김철수',
    avatarInitial: '김',
    challengeTitle: '챌린지 2기',
  },
];

describe('MenteeList', () => {
  it('renders all mentees with name and challenge', () => {
    render(
      <MenteeList
        mentees={mockMentees}
        activeMenteeId={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();
    expect(screen.getByText('챌린지 1기')).toBeInTheDocument();
    expect(screen.getByText('챌린지 2기')).toBeInTheDocument();
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

  it('filters by challenge title', async () => {
    const user = userEvent.setup();
    render(
      <MenteeList
        mentees={mockMentees}
        activeMenteeId={null}
        onSelect={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText('멘티 검색'), '2기');
    expect(screen.getByText('김철수')).toBeInTheDocument();
    expect(screen.queryByText('홍길동')).not.toBeInTheDocument();
  });

  it('shows empty-search state when no match', async () => {
    const user = userEvent.setup();
    render(
      <MenteeList
        mentees={mockMentees}
        activeMenteeId={null}
        onSelect={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText('멘티 검색'), '없는이름');
    expect(screen.getByText('검색 결과 없음')).toBeInTheDocument();
  });

  it('shows empty state when no mentees', () => {
    render(
      <MenteeList mentees={[]} activeMenteeId={null} onSelect={vi.fn()} />,
    );
    expect(screen.getByText('멘티가 없습니다.')).toBeInTheDocument();
  });

  it('calls onSelect with stable id when mentee row clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <MenteeList
        mentees={mockMentees}
        activeMenteeId={null}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByLabelText('홍길동 멘티 선택'));
    expect(onSelect).toHaveBeenCalledWith('홍길동|챌린지 1기');
  });
});
