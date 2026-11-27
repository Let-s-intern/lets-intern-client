import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserDetail from '@/pages/pages/user/UserDetail';
import UserInquirySection from '../UserInquirySection';

const get = vi.hoisted(() => vi.fn());
vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('@/utils/axiosV2', () => ({ default: { get } }));

const detail = vi.hoisted(() => ({
  userInfo: { id: '7', name: '김유저' },
  applicationInfo: [],
}));
vi.mock('@/api/user/user', () => ({
  useUserDetailAdminQuery: () => ({ data: detail, isLoading: false }),
}));
vi.mock('@/pages/pages/user/PersonalInfo', () => ({ default: () => null }));
vi.mock('@/pages/pages/user/PersonalHistory', () => ({ default: () => null }));
vi.mock('@/pages/pages/user/PersonalExperience', () => ({
  default: () => null,
}));

const question = (overrides: Record<string, unknown>) => ({
  id: 1,
  answerStatus: 'WAITING',
  title: '환불 문의',
  content: '내용',
  answer: null,
  isVisible: true,
  challengeId: 30,
  challengeTitle: '면접 챌린지',
  userId: 7,
  userName: '김유저',
  email: 'u@test.com',
  createDate: '2026-11-20T10:30:00.123456',
  ...overrides,
});

const respond = (questionList: unknown[]) =>
  get.mockResolvedValue({
    data: {
      data: {
        questionList,
        pageInfo: {
          totalElements: questionList.length,
          totalPages: 1,
          pageNum: 0,
          pageSize: 20,
        },
      },
    },
  });

const withClient = (ui: React.ReactNode) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('UserInquirySection', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('그 유저의 문의를 userId 로 조회해 목록으로 보인다', async () => {
    respond([
      question({ id: 1 }),
      question({
        id: 2,
        title: '답변 받은 문의',
        answerStatus: 'COMPLETED',
        isVisible: false,
      }),
    ]);
    render(withClient(<UserInquirySection userId={7} />));

    expect(await screen.findByText('환불 문의')).toBeInTheDocument();
    expect(get.mock.calls[0][1].params.userId).toBe(7);
    expect(screen.getByText('답변 대기 · 노출')).toBeInTheDocument();
    expect(screen.getByText('답변 완료 · 비노출')).toBeInTheDocument();
    expect(screen.getAllByText('면접 챌린지 · 2026-11-20 10:30')).toHaveLength(
      2,
    );
  });

  it('행은 답변 화면을 새 탭으로 여는 링크다', async () => {
    respond([question({ id: 5, challengeId: 30 })]);
    render(withClient(<UserInquirySection userId={7} />));

    const link = (await screen.findByText('환불 문의')).closest('a');
    expect(link).toHaveAttribute('href', '/challenge/inquiry/30/5/answer');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('문의가 없으면 빈 상태를 보인다', async () => {
    respond([]);
    render(withClient(<UserInquirySection userId={7} />));

    expect(
      await screen.findByText('등록한 문의가 없습니다.'),
    ).toBeInTheDocument();
  });

  it('서버가 userId 로 거르지 못해도 다른 유저의 문의는 보이지 않는다', async () => {
    respond([
      question({ id: 1 }),
      question({ id: 2, title: '남의 문의', userId: 99 }),
    ]);
    render(withClient(<UserInquirySection userId={7} />));

    expect(await screen.findByText('환불 문의')).toBeInTheDocument();
    expect(screen.queryByText('남의 문의')).not.toBeInTheDocument();
  });
});

describe('유저 상세의 문의 탭', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('탭을 열기 전에는 조회하지 않고 열면 조회한다', async () => {
    respond([]);
    render(
      withClient(
        <MemoryRouter initialEntries={['/users/7']}>
          <Routes>
            <Route path="/users/:userId" element={<UserDetail />} />
          </Routes>
        </MemoryRouter>,
      ),
    );

    expect(get).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('tab', { name: '문의' }));

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
    expect(get.mock.calls[0][0]).toBe('/admin/challenge/questions');
    expect(get.mock.calls[0][1].params.userId).toBe(7);
  });
});
