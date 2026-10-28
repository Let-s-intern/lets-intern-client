jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

let authState = { isInitialized: true, isLoggedIn: false };
jest.mock('@letscareer/store', () => ({
  useAuthStore: (selector: (s: typeof authState) => unknown) =>
    selector(authState),
}));

import { metadata } from '@/app/(user)/mentor-apply/status/page';
import axios from '@/utils/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import MentorApplyStatusPage from './MentorApplyStatusPage';

const get = axios.get as jest.Mock;

const renderPage = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MentorApplyStatusPage />
    </QueryClientProvider>,
  );

describe('MentorApplyStatusPage', () => {
  beforeEach(() => get.mockReset());

  it('비회원에게는 성함·연락처 폼을 보이고 회원 목록을 부르지 않는다', () => {
    authState = { isInitialized: true, isLoggedIn: false };
    renderPage();

    expect(
      screen.getByRole('heading', { level: 1, name: '신청 현황 조회' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('신청 시 입력한 성함과 연락처를 입력해주세요.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '조회하기' }),
    ).toBeInTheDocument();
    expect(get).not.toHaveBeenCalled();
  });

  it('회원에게는 폼 없이 본인 신청 카드를 보인다', async () => {
    authState = { isInitialized: true, isLoggedIn: true };
    get.mockResolvedValue({
      data: {
        data: {
          applicationList: [
            {
              submittedAt: '2026-10-28T10:00:05',
              status: 'CHECKING',
              expectedReplyDate: '2026-11-04',
            },
          ],
        },
      },
    });
    renderPage();

    expect(await screen.findByText('신청일 2026. 10. 28.')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/mentor-application/my');
    expect(
      screen.queryByRole('button', { name: '조회하기' }),
    ).not.toBeInTheDocument();
  });

  it('회원 신청이 없으면 안내와 신청하기 버튼을 보인다', async () => {
    authState = { isInitialized: true, isLoggedIn: true };
    get.mockResolvedValue({ data: { data: { applicationList: [] } } });
    renderPage();

    expect(
      await screen.findByText('아직 신청한 내역이 없습니다.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '신청하기' })).toHaveAttribute(
      'href',
      '/mentor-apply',
    );
  });

  it('로그인 상태를 복원하기 전에는 폼도 목록도 그리지 않는다', () => {
    authState = { isInitialized: false, isLoggedIn: false };
    renderPage();

    expect(
      screen.queryByRole('button', { name: '조회하기' }),
    ).not.toBeInTheDocument();
    expect(get).not.toHaveBeenCalled();
  });

  it('라우트 metadata 에 canonical 과 OG 를 둔다', () => {
    expect(metadata.alternates?.canonical).toBe('/mentor-apply/status');
    expect(metadata.openGraph?.url).toBe('/mentor-apply/status');
  });
});
