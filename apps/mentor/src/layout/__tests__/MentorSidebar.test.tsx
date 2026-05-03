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
});
