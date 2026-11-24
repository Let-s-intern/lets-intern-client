import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
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

const openList = () => fireEvent.mouseDown(screen.getByRole('combobox'));

const optionNames = () =>
  screen.queryAllByRole('option').map((option) => option.textContent);

describe('ChallengeMentorRegistrationSection', () => {
  it('기존 멘토 목록이 늦게 도착해도 칩으로 선택돼 보인다', () => {
    const { rerender } = render(tree());
    expect(screen.queryByText('1 김멘토')).toBeNull();

    mockUseChallengeMentorList.mockReturnValue(challengeMentors([1, 30]));
    rerender(tree());

    expect(screen.getByText('1 김멘토')).toBeTruthy();
    expect(screen.getByText('30 박코치')).toBeTruthy();
    expect(screen.queryByText('2 이멘토')).toBeNull();
  });

  it('사용자가 이미 고른 뒤에 목록이 도착하면 덮어쓰지 않는다', () => {
    const onChange = vi.fn();
    const { rerender } = render(tree(onChange));

    openList();
    fireEvent.click(screen.getByRole('option', { name: '2 이멘토' }));
    expect(onChange).toHaveBeenLastCalledWith([2]);

    mockUseChallengeMentorList.mockReturnValue(challengeMentors([1, 30]));
    rerender(tree(onChange));

    expect(
      screen.getByText('2 이멘토', { selector: '.MuiChip-label' }),
    ).toBeTruthy();
    expect(
      screen.queryByText('1 김멘토', { selector: '.MuiChip-label' }),
    ).toBeNull();
  });

  it('이름으로 검색하면 목록이 걸러진다', async () => {
    render(tree());
    await userEvent.type(screen.getByRole('combobox'), '박코');

    expect(optionNames()).toEqual(['30 박코치']);
  });

  it('id 로 검색하면 목록이 걸러진다', async () => {
    render(tree());
    await userEvent.type(screen.getByRole('combobox'), '30');

    expect(optionNames()).toEqual(['30 박코치']);
  });

  it('검색 결과가 없으면 안내 문구를 보여 준다', async () => {
    render(tree());
    await userEvent.type(screen.getByRole('combobox'), '없는사람');

    expect(screen.getByText('검색 결과가 없습니다')).toBeTruthy();
  });

  it('선택과 해제가 onChange 로 전달되고 선택해도 목록이 닫히지 않는다', () => {
    const onChange = vi.fn();
    mockUseChallengeMentorList.mockReturnValue(challengeMentors([1]));
    render(tree(onChange));

    openList();
    fireEvent.click(screen.getByRole('option', { name: '2 이멘토' }));
    expect(onChange).toHaveBeenLastCalledWith([1, 2]);
    expect(screen.getByRole('listbox')).toBeTruthy();

    fireEvent.click(screen.getByRole('option', { name: '1 김멘토' }));
    expect(onChange).toHaveBeenLastCalledWith([2]);
  });

  it('전체 목록에 없는 기존 멘토는 다른 선택을 바꿔도 유지된다', () => {
    const onChange = vi.fn();
    mockUseChallengeMentorList.mockReturnValue(challengeMentors([99]));
    render(tree(onChange));

    openList();
    fireEvent.click(screen.getByRole('option', { name: '2 이멘토' }));

    expect(onChange).toHaveBeenLastCalledWith([99, 2]);
  });

  it('챌린지 id 가 없는 생성 화면에서는 비활성이고 안내 문구가 보인다', () => {
    render(tree(undefined, '/challenge/create'));

    expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(true);
    expect(
      screen.getByText('*챌린지 생성 후 멘토 등록이 가능합니다.'),
    ).toBeTruthy();
  });

  it('챌린지 id 가 있으면 활성이고 안내 문구가 없다', () => {
    render(tree());

    expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(false);
    expect(
      screen.queryByText('*챌린지 생성 후 멘토 등록이 가능합니다.'),
    ).toBeNull();
  });
});
