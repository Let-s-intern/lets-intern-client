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
