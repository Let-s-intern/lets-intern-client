import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

// NotificationBell 은 react-query 의존성 + import.meta.env 가 필요해서 별도 모듈로 모킹.
vi.mock('@/pages/notification/ui/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell" />,
}));

// 오픈 상태 배지도 react-query 를 쓰므로 같은 이유로 모킹한다(사이드바는 provider 없이 렌더).
vi.mock('@/pages/live-mentoring/ui/LiveMentoringOpenBadge', () => ({
  default: () => null,
}));

import { MentorSidebar } from '@/layout/MentorSidebar';

beforeAll(() => {
  // jsdom 은 matchMedia 가 없어 PWA 감지 effect 가 실패함 → 폴리필
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
});

const renderSidebar = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <MentorSidebar isOpen onClose={() => {}} />
    </MemoryRouter>,
  );

describe('1대1 라이브 멘토링 사이드바 항목', () => {
  /*
    오픈 설정과 상세 페이지 설정이 한 화면의 스텝으로 합쳐지면서(LC-3264) 하위
    항목이 사라지고 최상위 링크 하나가 됐다.
  */
  it('하위 항목 없이 최상위 링크 하나로 보인다', () => {
    renderSidebar('/');

    expect(
      screen.getByRole('link', { name: '1대1 라이브 멘토링' }),
    ).toHaveAttribute('href', '/live-mentoring/settings');
    expect(screen.queryByText('오픈 설정')).not.toBeInTheDocument();
    expect(screen.queryByText('상세 페이지 설정')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /1대1 라이브 멘토링/ }),
    ).not.toBeInTheDocument();
  });

  it('설정 화면에 들어가면 활성 표시된다', () => {
    renderSidebar('/live-mentoring/settings');

    const link = screen.getByRole('link', { name: '1대1 라이브 멘토링' });
    expect(link).toHaveClass('text-primary');
    expect(link).toHaveClass('font-semibold');
  });

  it('기존 피드백 항목은 그룹 해체 후에도 그대로 남는다', () => {
    renderSidebar('/');

    // '피드백' 상위 그룹은 없어지고 하위 항목이 최상위로 올라왔다.
    expect(screen.queryByText('피드백')).not.toBeInTheDocument();
    expect(screen.getByText('LIVE 슬롯 오픈')).toBeInTheDocument();
    // '예약 현황'은 main 병합분에서 임시 숨김 처리됨(dusvlf111, 2026-07-17) — 라우트는 유지, 진입점만 가려짐.
    expect(screen.queryByText('예약 현황')).not.toBeInTheDocument();
  });
});
