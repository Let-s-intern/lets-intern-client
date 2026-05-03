import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('MentorSidebar', () => {
  it('피드백 메뉴 라벨이 "피드백"으로 노출된다 (구 "피드백 현황" 아님)', () => {
    render(
      <MemoryRouter initialEntries={['/feedback-management']}>
        <MentorSidebar isOpen onClose={() => {}} />
      </MemoryRouter>,
    );

    expect(screen.getByText('피드백')).toBeInTheDocument();
    expect(screen.queryByText('피드백 현황')).not.toBeInTheDocument();
  });

  it('피드백 그룹은 자식 라우트에 진입하면 자동으로 펼쳐지고 3개 하위 메뉴가 노출된다', () => {
    render(
      <MemoryRouter initialEntries={['/feedback/live-availability']}>
        <MentorSidebar isOpen onClose={() => {}} />
      </MemoryRouter>,
    );

    // 펼쳐진 상태이므로 하위 메뉴가 모두 보여야 함
    expect(screen.getByText('라이브 피드백 일정 열기')).toBeInTheDocument();
    expect(screen.getByText('예약 현황')).toBeInTheDocument();
    expect(screen.getByText('멘티관리')).toBeInTheDocument();
    expect(screen.getByText('피드백 관리')).toBeInTheDocument();

    const groupButton = screen.getByRole('button', { name: /피드백/ });
    expect(groupButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('피드백 그룹 토글 버튼을 클릭하면 펼침/접힘이 전환된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <MentorSidebar isOpen onClose={() => {}} />
      </MemoryRouter>,
    );

    const groupButton = screen.getByRole('button', { name: /피드백/ });
    expect(groupButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('라이브 피드백 일정 열기')).not.toBeInTheDocument();

    await user.click(groupButton);
    expect(groupButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('라이브 피드백 일정 열기')).toBeInTheDocument();

    await user.click(groupButton);
    expect(groupButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('라이브 피드백 일정 열기')).not.toBeInTheDocument();
  });
});
