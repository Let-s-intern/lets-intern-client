import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('@/utils/axiosV2', () => ({ default: {} }));

// 페이지의 useEffect 가 userDetail 을 의존하므로 렌더마다 같은 객체를 돌려줘야 무한 렌더가 나지 않는다
const userDetail = vi.hoisted(() => ({
  userInfo: { name: '김멘토' },
  mentorHashTagInfos: [],
}));
const careerData = vi.hoisted(() => ({ userCareers: [] }));

vi.mock('@/api/user/user', () => ({
  AdminUserDetailQueryKey: 'adminUserDetailQuery',
  useAdminUserDetailQuery: () => ({ isLoading: false, data: userDetail }),
  usePatchUserAdminMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/api/career/career', () => ({
  useGetAdminUserCareerQuery: () => ({ data: careerData }),
  usePostAdminCareerMutation: () => ({ mutate: vi.fn() }),
  useDeleteAdminCareerMutation: () => ({ mutate: vi.fn() }),
}));

vi.mock('@/api/file', () => ({ uploadFile: vi.fn() }));

vi.mock('@/domain/admin/user/mentor-detail/ui/ProfileImageUploadModal', () => ({
  default: () => null,
}));

// 섹션 자체는 MentorReviewExposureSection.test.tsx 에서 본다. 여기서는 연결만 확인한다
vi.mock(
  '@/domain/mentor/review-exposure/ui/MentorReviewExposureSection',
  () => ({
    default: ({ mentorId }: { mentorId: number }) => (
      <div data-testid="mentor-review-exposure-section">{mentorId}</div>
    ),
  }),
);

import AdminMentorDetailPage from '../AdminMentorDetailPage';

describe('AdminMentorDetailPage', () => {
  it('멘토 페이지 후기 섹션을 두 칸 그리드 밖, 키워드 섹션 아래에 mentorId 와 함께 렌더한다', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/mentors/7']}>
          <Routes>
            <Route
              path="/mentors/:mentorId"
              element={<AdminMentorDetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const section = screen.getByTestId('mentor-review-exposure-section');
    expect(section).toHaveTextContent('7');

    const keywordHeading = screen.getByText('키워드');
    expect(
      keywordHeading.compareDocumentPosition(section) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // 반쪽 칸에 들어가면 후기 내용 열이 좁아져 잘린다
    const grid = keywordHeading.closest('.grid');
    expect(grid).not.toBeNull();
    expect(grid?.contains(section)).toBe(false);
  });
});
