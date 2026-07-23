import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

// NotificationBell 은 react-query 의존성 + import.meta.env 가 필요해서 별도 모듈로 모킹.
vi.mock('@/pages/notification/ui/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell" />,
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
  it('그룹 라벨 클릭(드롭다운)으로 4개 하위 항목이 열린다', () => {
    renderSidebar('/');

    // 다른 경로에서는 기본 접힘 — 클릭 전엔 하위 항목이 없다
    expect(screen.getByText('1대1 라이브 멘토링')).toBeInTheDocument();
    expect(screen.queryByText('오픈 설정')).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /1대1 라이브 멘토링/ }),
    );

    expect(screen.getByText('오픈 설정')).toBeInTheDocument();
    expect(screen.getByText('상세 페이지 설정')).toBeInTheDocument();
    expect(screen.getByText('정산 현황')).toBeInTheDocument();
    expect(screen.getByText('오픈 현황')).toBeInTheDocument();
  });

  it('하위 항목의 url 매핑이 정확하다', () => {
    renderSidebar('/');
    fireEvent.click(
      screen.getByRole('button', { name: /1대1 라이브 멘토링/ }),
    );

    const cases: [string, string][] = [
      ['오픈 설정', '/live-mentoring/open-settings'],
      ['상세 페이지 설정', '/live-mentoring/detail-settings'],
      ['정산 현황', '/live-mentoring/settlement'],
      ['오픈 현황', '/live-mentoring/open-status'],
    ];
    for (const [name, url] of cases) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', url);
    }
  });

  it('그룹 대주제는 클릭 가능한 토글 버튼이며, 다시 클릭하면 닫힌다', () => {
    renderSidebar('/');
    const toggle = screen.getByRole('button', {
      name: /1대1 라이브 멘토링/,
    });

    fireEvent.click(toggle); // 열기
    expect(screen.getByText('오픈 설정')).toBeInTheDocument();
    fireEvent.click(toggle); // 닫기
    expect(screen.queryByText('오픈 설정')).not.toBeInTheDocument();
  });

  it('하위 경로 진입 시 그룹이 자동으로 열리고 해당 항목이 활성 표시된다', () => {
    renderSidebar('/live-mentoring/settlement');

    const link = screen.getByRole('link', { name: '정산 현황' });
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
