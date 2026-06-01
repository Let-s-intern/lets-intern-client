import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

// NotificationBell 은 react-query 의존성 + import.meta.env 가 필요해서 별도 모듈로 모킹.
vi.mock('@/pages/notification/ui/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell" />,
}));

import { MentorSidebar } from '../MentorSidebar';

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

describe('MentorSidebar', () => {
  it('재구성된 메뉴 라벨이 모두 노출된다', () => {
    renderSidebar('/');

    expect(screen.getByText('공지사항')).toBeInTheDocument();
    expect(screen.getByText('피드백')).toBeInTheDocument();
    expect(screen.getByText('피드백 캘린더')).toBeInTheDocument();
    expect(screen.getByText('피드백 내역')).toBeInTheDocument();
    expect(screen.getByText('LIVE 슬롯 오픈')).toBeInTheDocument();
    expect(screen.getByText('예약 현황')).toBeInTheDocument();
    expect(screen.getByText('채팅')).toBeInTheDocument();
    expect(screen.getByText('참여중인 챌린지')).toBeInTheDocument();
    expect(screen.getByText('프로필')).toBeInTheDocument();
  });

  it('"멘티관리" 구 라벨은 노출되지 않는다', () => {
    renderSidebar('/');

    expect(screen.queryByText('멘티관리')).not.toBeInTheDocument();
  });

  it('구 라벨과 정산 메뉴는 노출되지 않는다', () => {
    renderSidebar('/');

    expect(screen.queryByText('프로그램 일정')).not.toBeInTheDocument();
    expect(screen.queryByText('피드백 관리')).not.toBeInTheDocument();
    expect(
      screen.queryByText('라이브 피드백 일정 열기'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('정산')).not.toBeInTheDocument();
  });

  it('공지사항이 최상단에 위치한다', () => {
    renderSidebar('/notice');

    const labels = screen
      .getAllByRole('listitem')
      .map((li) => li.textContent ?? '');
    expect(labels[0]).toContain('공지사항');
  });

  it('피드백 캘린더(/) 진입 시 캘린더가 활성 표시된다', () => {
    renderSidebar('/');

    const calendarLink = screen.getByRole('link', { name: '피드백 캘린더' });
    expect(calendarLink).toHaveClass('text-primary');
    expect(calendarLink).toHaveClass('font-semibold');
  });

  it('피드백 내역(/feedback-management) 진입 시 내역이 활성 표시된다', () => {
    renderSidebar('/feedback-management');

    const historyLink = screen.getByRole('link', { name: '피드백 내역' });
    expect(historyLink).toHaveClass('text-primary');
    expect(historyLink).toHaveClass('font-semibold');

    // 같은 그룹의 다른 자식은 비활성
    const calendarLink = screen.getByRole('link', { name: '피드백 캘린더' });
    expect(calendarLink).not.toHaveClass('text-primary');
  });

  it('피드백 그룹 토글 버튼이 없고 하위 메뉴는 항상 펼쳐져 노출된다', () => {
    // 피드백 그룹 밖 라우트에서도 하위 메뉴가 항상 보인다
    renderSidebar('/profile');

    expect(
      screen.queryByRole('button', { name: /피드백/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('피드백 캘린더')).toBeInTheDocument();
    expect(screen.getByText('피드백 내역')).toBeInTheDocument();
    expect(screen.getByText('LIVE 슬롯 오픈')).toBeInTheDocument();
    expect(screen.getByText('예약 현황')).toBeInTheDocument();
    expect(screen.getByText('채팅')).toBeInTheDocument();
  });
});
