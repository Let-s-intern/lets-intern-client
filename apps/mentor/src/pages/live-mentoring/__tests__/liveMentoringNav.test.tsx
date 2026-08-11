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

describe('1대1 라이브 멘토링 사이드바 그룹', () => {
  // 하위 항목이 2개뿐이라(오픈 현황·정산 현황 폐지) 더 이상 접이식이 아니다 —
  // 항상 펼쳐진 채로 보인다.
  it('접힘 없이 하위 항목 2개가 항상 노출된다', () => {
    renderSidebar('/');

    expect(screen.getByText('1대1 라이브 멘토링')).toBeInTheDocument();
    expect(screen.getByText('오픈 설정')).toBeInTheDocument();
    expect(screen.getByText('상세 페이지 설정')).toBeInTheDocument();
    // 그룹 라벨은 더 이상 토글 버튼이 아니다.
    expect(
      screen.queryByRole('button', { name: /1대1 라이브 멘토링/ }),
    ).not.toBeInTheDocument();
    // 오픈 현황·정산 현황은 폐지됐다 — 오픈/닫기는 오픈 설정 상단에서 바로 한다.
    expect(screen.queryByText('정산 현황')).not.toBeInTheDocument();
    expect(screen.queryByText('오픈 현황')).not.toBeInTheDocument();
  });

  it('하위 항목의 url 매핑이 정확하다', () => {
    renderSidebar('/');

    const cases: [string, string][] = [
      ['오픈 설정', '/live-mentoring/open-settings'],
      ['상세 페이지 설정', '/live-mentoring/detail-settings'],
    ];
    for (const [name, url] of cases) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', url);
    }
  });

  it('하위 경로 진입 시 해당 항목이 활성 표시된다', () => {
    renderSidebar('/live-mentoring/open-settings');

    const link = screen.getByRole('link', { name: '오픈 설정' });
    expect(link).toHaveClass('text-primary');
    expect(link).toHaveClass('font-semibold');
  });

  it('기존 피드백 그룹은 그대로 유지된다', () => {
    renderSidebar('/');

    expect(screen.getByText('피드백')).toBeInTheDocument();
    // '예약 현황'은 main 병합분에서 임시 숨김 처리됨(dusvlf111, 2026-07-17) — 라우트는 유지, 진입점만 가려짐.
    expect(screen.getByText('LIVE 슬롯 오픈')).toBeInTheDocument();
    expect(screen.queryByText('예약 현황')).not.toBeInTheDocument();
  });
});
