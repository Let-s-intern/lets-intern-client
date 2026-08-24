import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

// 두 표 모두 네트워크 의존이라 목으로 대체한다. 이 테스트가 보는 것은 탭 전환이다.
vi.mock('@/domain/live-mentoring/AdminLiveMentoringTable', () => ({
  default: () => <div>상품표목</div>,
}));
vi.mock('@/domain/live-mentoring/AdminLiveMentoringParticipantTable', () => ({
  default: () => <div>참여자표목</div>,
}));

import AdminLiveMentoringPage from './AdminLiveMentoringPage';

const renderPage = (initialEntry = '/live-mentoring') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AdminLiveMentoringPage />
    </MemoryRouter>,
  );

describe('AdminLiveMentoringPage', () => {
  it('기본 탭은 상품 관리다', () => {
    renderPage();
    expect(screen.getByText('상품표목')).toBeInTheDocument();
    expect(screen.queryByText('참여자표목')).not.toBeInTheDocument();
  });

  it('참여자 탭으로 전환하면 참여자 표를 보여 준다', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: '참여자' }));
    expect(screen.getByText('참여자표목')).toBeInTheDocument();
    expect(screen.queryByText('상품표목')).not.toBeInTheDocument();
  });

  it('탭마다 설명 문구가 바뀐다', () => {
    renderPage();
    expect(
      screen.getByText(/개설은 멘토가 직접 열고 닫으며/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '참여자' }));
    expect(screen.getByText(/조작은 환불뿐입니다/)).toBeInTheDocument();
  });

  // 새로고침해도 보던 탭이 유지되어야 한다.
  it('URL 의 tab 파라미터로 탭을 복원한다', () => {
    renderPage('/live-mentoring?tab=participants');
    expect(screen.getByText('참여자표목')).toBeInTheDocument();
  });

  it('알 수 없는 tab 값은 상품 관리로 되돌린다', () => {
    renderPage('/live-mentoring?tab=unknown');
    expect(screen.getByText('상품표목')).toBeInTheDocument();
  });
});
