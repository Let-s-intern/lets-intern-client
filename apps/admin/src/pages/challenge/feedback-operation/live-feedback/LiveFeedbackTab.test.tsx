import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

// 예약 관리 컨테이너는 네트워크 의존이 있어 목으로 대체한다.
vi.mock('./reservation/ReservationManagement', () => ({
  default: () => <div>예약관리목</div>,
}));

// 멘토 스케줄도 네트워크 의존(lazy) 이라 목으로 대체한다.
vi.mock('./mentor-schedule/MentorScheduleView', () => ({
  default: () => <div>멘토스케줄목</div>,
}));

import LiveFeedbackTab from './LiveFeedbackTab';

const renderTab = () =>
  render(
    <MemoryRouter>
      <LiveFeedbackTab />
    </MemoryRouter>,
  );

describe('LiveFeedbackTab', () => {
  it('기본 서브탭은 예약 관리이며 헤더와 관리자 홈 링크를 표시한다', () => {
    renderTab();
    expect(screen.getByText('전체 예약 목록')).toBeInTheDocument();
    expect(screen.getByText('← 관리자 홈')).toBeInTheDocument();
    expect(screen.getByText('예약관리목')).toBeInTheDocument();
  });

  it('멘토 스케줄 서브탭으로 전환하면 멘토 스케줄 뷰를 표시한다', async () => {
    renderTab();
    fireEvent.click(screen.getByText('멘토 스케줄'));
    expect(await screen.findByText('멘토스케줄목')).toBeInTheDocument();
    expect(screen.queryByText('예약관리목')).not.toBeInTheDocument();
  });
});
