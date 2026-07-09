import { render, screen } from '@testing-library/react';
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
  it('그룹 라벨과 4개 하위 항목이 노출된다', () => {
    renderSidebar('/');

    expect(screen.getByText('1대1 라이브 멘토링')).toBeInTheDocument();
    expect(screen.getByText('오픈 설정')).toBeInTheDocument();
    expect(screen.getByText('상세 페이지 설정')).toBeInTheDocument();
    expect(screen.getByText('정산 현황')).toBeInTheDocument();
    expect(screen.getByText('오픈 현황')).toBeInTheDocument();
  });

  it('하위 항목의 url 매핑이 정확하다', () => {
    renderSidebar('/');

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

  it('그룹 대주제는 링크가 아니라 비링크 라벨이다(클릭 불가)', () => {
    renderSidebar('/');

    expect(
      screen.queryByRole('link', { name: '1대1 라이브 멘토링' }),
    ).not.toBeInTheDocument();
  });

  it('하위 항목 진입 시 해당 항목이 활성 표시된다', () => {
    renderSidebar('/live-mentoring/settlement');

    const link = screen.getByRole('link', { name: '정산 현황' });
    expect(link).toHaveClass('text-primary');
    expect(link).toHaveClass('font-semibold');
  });

  it('기존 피드백 그룹은 그대로 유지된다', () => {
    renderSidebar('/');

    expect(screen.getByText('피드백')).toBeInTheDocument();
    expect(screen.getByText('LIVE 슬롯 오픈')).toBeInTheDocument();
    expect(screen.getByText('예약 현황')).toBeInTheDocument();
  });
});
