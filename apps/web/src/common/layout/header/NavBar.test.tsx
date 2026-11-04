import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';

import NavBar from './NavBar';

let mockPathname = '/';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

// 모바일 Swiper 블록만 그리도록 모바일 폭으로 고정한다.
jest.mock('@mui/material', () => ({
  useMediaQuery: () => true,
}));

// jsdom 에서 Swiper 를 돌리지 않는다. 슬라이드 순서만 보면 된다.
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: ReactNode }) => (
    <div data-testid="mobile-nav">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
jest.mock('swiper/modules', () => ({ FreeMode: {} }));
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/free-mode', () => ({}));

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({ isLoggedIn: false }),
}));

jest.mock('@/api/user/user', () => ({
  useGetUserAdmin: () => ({ data: false }),
  useIsMentorQuery: () => ({ data: false }),
}));

jest.mock('@/hooks/useProgramCategoryNav', () => ({
  __esModule: true,
  default: () => [],
}));
jest.mock('@/hooks/useScrollDirection', () => ({
  __esModule: true,
  default: () => 'UP',
}));
jest.mock('@/hooks/useControlScroll', () => ({
  useControlScroll: () => undefined,
}));

jest.mock('./useMembershipNavEntry', () => ({
  useMembershipNavEntry: () => ({
    title: '올인원패스',
    href: '/program?type=MEMBERSHIP',
    activePath: '/program',
    isOpen: false,
  }),
}));

// 헤더 1단·드로어는 이 테스트 범위가 아니다.
jest.mock('./GlobalNavTopBar', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./SideNavContainer', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./NavOverlay', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./ExternalNavList', () => ({
  __esModule: true,
  default: () => null,
}));

const NEW_BADGE = "after:content-['N']";

function renderMobileNav(pathname: string) {
  mockPathname = pathname;
  render(<NavBar />);
  return within(screen.getByTestId('mobile-nav'));
}

describe('NavBar 모바일 헤더 가로 탭', () => {
  it('탭 순서: 프로그램, 1:1 LIVE 멘토링, 대기업 멘토관, 렛츠커리어 멘토, 무료 세미나, 무료 자료집', () => {
    const nav = renderMobileNav('/');

    expect(nav.getAllByRole('link').map((link) => link.textContent)).toEqual([
      '프로그램',
      '1:1 LIVE 멘토링',
      '대기업 멘토관',
      '렛츠커리어 멘토',
      '무료 세미나',
      '무료 자료집',
    ]);
  });

  it('대기업 멘토관은 /bigfirm 으로 가고, N 뱃지와 GTM 추적 클래스가 붙는다', () => {
    const nav = renderMobileNav('/');
    const bigfirm = nav.getByRole('link', { name: '대기업 멘토관' });

    expect(bigfirm).toHaveAttribute('href', '/bigfirm');
    expect(bigfirm).toHaveClass('bigfirm_gnb_click');
    expect(bigfirm.className).toContain(NEW_BADGE);
  });

  it('/bigfirm 에서는 대기업 멘토관만 활성 색이다', () => {
    const nav = renderMobileNav('/bigfirm');

    expect(nav.getByRole('link', { name: '대기업 멘토관' })).toHaveClass(
      'text-primary',
    );
    expect(nav.getByRole('link', { name: '렛츠커리어 멘토' })).not.toHaveClass(
      'text-primary',
    );
  });

  it('/mentors 에서는 대기업 멘토관이 활성 색이 아니다', () => {
    const nav = renderMobileNav('/mentors');

    expect(nav.getByRole('link', { name: '대기업 멘토관' })).not.toHaveClass(
      'text-primary',
    );
    expect(nav.getByRole('link', { name: '렛츠커리어 멘토' })).toHaveClass(
      'text-primary',
    );
  });

  it('무료 세미나·무료 자료집에는 N 뱃지가 없다', () => {
    const nav = renderMobileNav('/');

    expect(
      nav.getByRole('link', { name: '무료 세미나' }).className,
    ).not.toContain(NEW_BADGE);
    expect(
      nav.getByRole('link', { name: '무료 자료집' }).className,
    ).not.toContain(NEW_BADGE);
  });
});
