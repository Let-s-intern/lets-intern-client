import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ChallengeMentorRegistrationSection from '../ChallengeMentorRegistrationSection';

const mockUseUserMentorList = vi.fn();
const mockUseChallengeMentorList = vi.fn();

vi.mock('@/api/mentor/mentor', () => ({
  useAdminUserMentorListQuery: () => mockUseUserMentorList(),
  useAdminChallengeMentorListQuery: () => mockUseChallengeMentorList(),
}));

const allMentors = {
  data: {
    mentorList: [
      { id: 1, name: '김멘토' },
      { id: 2, name: '이멘토' },
      { id: 30, name: '박코치' },
    ],
  },
};

const challengeMentors = (userIds: number[]) => ({
  data: {
    mentorList: userIds.map((userId) => ({
      challengeMentorId: userId * 100,
      userId,
      name: `mentor-${userId}`,
    })),
  },
});

const tree = (onChange?: (ids: number[]) => void, path = '/challenge/10') => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/challenge/:challengeId"
          element={<ChallengeMentorRegistrationSection onChange={onChange} />}
        />
        <Route
          path="/challenge/create"
          element={<ChallengeMentorRegistrationSection onChange={onChange} />}
        />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

beforeEach(() => {
  mockUseUserMentorList.mockReturnValue(allMentors);
  mockUseChallengeMentorList.mockReturnValue({ data: undefined });
});

describe('ChallengeMentorRegistrationSection 선택 상태 동기화', () => {
  it('기존 멘토 목록이 늦게 도착해도 선택된 것으로 보인다', () => {
    const { rerender } = render(tree());
    expect(screen.getByRole('combobox').textContent).not.toContain('김멘토');

    mockUseChallengeMentorList.mockReturnValue(challengeMentors([1, 30]));
    rerender(tree());

    const display = screen.getByRole('combobox').textContent;
    expect(display).toContain('김멘토');
    expect(display).toContain('박코치');
    expect(display).not.toContain('이멘토');
  });

  it('사용자가 이미 고른 뒤에 목록이 도착하면 덮어쓰지 않는다', () => {
    const onChange = vi.fn();
    const { rerender } = render(tree(onChange));

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('2 이멘토'));
    expect(onChange).toHaveBeenLastCalledWith([2]);

    mockUseChallengeMentorList.mockReturnValue(challengeMentors([1, 30]));
    rerender(tree(onChange));

    const display = screen.getByRole('combobox', { hidden: true }).textContent;
    expect(display).toContain('이멘토');
    expect(display).not.toContain('김멘토');
  });
});
