import { render, screen } from '@testing-library/react';

let mockPathname = '/';
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

jest.mock('@/common/layout/header/NavBar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar" />,
}));
jest.mock('@/common/layout/footer/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));
jest.mock('@/common/layout/channel/ChannelTalkBtn', () => ({
  __esModule: true,
  default: () => <div data-testid="channel-talk" />,
}));
jest.mock('@/common/layout/BottomNavBarWithPathname', () => ({
  __esModule: true,
  default: () => <div data-testid="bottom-nav" />,
}));

let mockAuth = { isInitialized: true, isLoggedIn: false };
jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: (selector: (s: typeof mockAuth) => unknown) => selector(mockAuth),
}));

import ConditionalLayout from './ConditionalLayout';

describe('ConditionalLayout — /sso/login (LC-3208)', () => {
  it('NavBar·Footer·채널톡·바텀바 없이 children만 렌더한다 — 렛츠커리어 사이트 티가 나면 안 된다', () => {
    mockPathname = '/sso/login';

    render(
      <ConditionalLayout>
        <div data-testid="sso-content">SSO 로그인</div>
      </ConditionalLayout>,
    );

    expect(screen.getByTestId('sso-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('channel-talk')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();
  });

  it('다른 경로는 회귀 없이 NavBar를 그대로 렌더한다', () => {
    mockPathname = '/';

    render(
      <ConditionalLayout>
        <div>홈</div>
      </ConditionalLayout>,
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});

describe('ConditionalLayout — 멘토 모집 화면 (LC-3529)', () => {
  const renderAt = (pathname: string) => {
    mockPathname = pathname;
    render(
      <ConditionalLayout>
        <div data-testid="mentor-content">본문</div>
      </ConditionalLayout>,
    );
  };

  it.each(['/mentor-join', '/mentor-apply', '/mentor-apply/status'])(
    '%s 에서 비회원에게는 렛츠커리어 헤더 대신 시안 헤더를 보인다',
    (pathname) => {
      mockAuth = { isInitialized: true, isLoggedIn: false };
      renderAt(pathname);

      expect(screen.getByTestId('mentor-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: '렛츠커리어' })).toHaveAttribute(
        'href',
        '/mentor-join',
      );
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('channel-talk')).not.toBeInTheDocument();
      expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();
    },
  );

  it('회원에게는 렛츠커리어 헤더를 보인다', () => {
    mockAuth = { isInitialized: true, isLoggedIn: true };
    renderAt('/mentor-join');

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: '렛츠커리어' }),
    ).not.toBeInTheDocument();
  });

  it('로그인 상태를 복원하기 전에는 어느 헤더도 그리지 않는다', () => {
    mockAuth = { isInitialized: false, isLoggedIn: false };
    renderAt('/mentor-join');

    expect(screen.getByTestId('mentor-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: '렛츠커리어' }),
    ).not.toBeInTheDocument();
  });

  it('신청서 작성 중에는 시안 헤더의 신청 버튼을 숨긴다', () => {
    mockAuth = { isInitialized: true, isLoggedIn: false };
    renderAt('/mentor-apply');
    expect(
      screen.queryByRole('link', { name: '신청하기' }),
    ).not.toBeInTheDocument();
  });

  it('신청 현황 조회에서는 시안 헤더의 버튼을 보인다', () => {
    mockAuth = { isInitialized: true, isLoggedIn: false };
    renderAt('/mentor-apply/status');
    expect(screen.getByRole('link', { name: '신청하기' })).toHaveAttribute(
      'href',
      '/mentor-apply',
    );
  });
});
