import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

// 두 탭의 내용은 각자 테스트에서 본다. 여기서는 탭 전환·URL 유지만 본다
vi.mock('@/api/mentor/mentor', () => ({
  UseAdminUserMentorListQueryKey: 'useAdminUserMentorListQuery',
  useAdminUserMentorListQuery: () => ({
    data: { mentorList: [] },
    isLoading: false,
  }),
}));
vi.mock('@/api/user/user', () => ({
  UseUserAdminQueryKey: 'useUserAdminQuery',
  usePatchUserAdminMutation: () => ({ mutateAsync: vi.fn() }),
}));
vi.mock(
  '@/domain/admin/pages/mentor-application/ui/MentorApplicationTable',
  () => ({ default: () => <span>신청현황목</span> }),
);

import AdminMentorPage from '../AdminMentorPage';

const Search = () => <span data-testid="search">{useLocation().search}</span>;

const renderPage = (entry = '/mentors') =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[entry]}>
        <AdminMentorPage />
        <Search />
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('AdminMentorPage 탭', () => {
  it('기본 탭은 활동 멘토다', () => {
    renderPage();
    expect(screen.getByText('등록된 멘토가 없습니다.')).toBeInTheDocument();
    expect(screen.queryByText('신청현황목')).not.toBeInTheDocument();
  });

  it('?tab=applications 로 들어오면(새로고침) 신청 현황 탭을 띄운다', () => {
    renderPage('/mentors?tab=applications');
    expect(screen.getByText('신청현황목')).toBeInTheDocument();
  });

  it('탭을 누르면 URL 의 tab 을 바꾸고, 활동 멘토로 돌아오면 지운다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '신청 현황' }));
    expect(screen.getByText('신청현황목')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toHaveTextContent('?tab=applications');

    fireEvent.click(screen.getByRole('button', { name: '활동 멘토' }));
    expect(screen.getByText('등록된 멘토가 없습니다.')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeEmptyDOMElement();
  });
});
