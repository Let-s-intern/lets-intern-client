import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

// 예약 관리 컨테이너는 네트워크 의존이 있어 목으로 대체한다.
// 유형 고정 여부가 하위탭마다 다르므로 받은 prop 을 그대로 그린다.
vi.mock('./reservation/ReservationManagement', () => ({
  default: ({ fixedType }: { fixedType?: string }) => (
    <div>예약관리목 {fixedType ?? '유형선택가능'}</div>
  ),
}));

// 멘토 스케줄도 네트워크 의존(lazy) 이라 목으로 대체한다.
vi.mock('./mentor-schedule/MentorScheduleView', () => ({
  default: () => <div>멘토스케줄목</div>,
}));

import LiveFeedbackTab from './LiveFeedbackTab';

const renderTab = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LiveFeedbackTab />
    </MemoryRouter>,
  );

describe('LiveFeedbackTab', () => {
  it('하위탭은 예약 관리 / 1대1 라이브 멘토링 / 멘토 스케줄 세 개다', () => {
    renderTab();
    expect(
      screen.getAllByRole('button').map((button) => button.textContent),
    ).toEqual(['예약 관리', '1대1 라이브 멘토링', '멘토 스케줄']);
  });

  it('기본 서브탭은 예약 관리이며 헤더를 표시한다', () => {
    renderTab();
    expect(screen.getByText('전체 예약 목록')).toBeInTheDocument();
    expect(screen.getByText('예약관리목 유형선택가능')).toBeInTheDocument();
  });

  it('1대1 서브탭은 같은 화면을 유형만 고정해 쓴다', () => {
    renderTab();
    fireEvent.click(screen.getByText('1대1 라이브 멘토링'));
    expect(screen.getByText('예약관리목 LIVE_MENTORING')).toBeInTheDocument();
  });

  it('멘토 스케줄 서브탭으로 전환하면 멘토 스케줄 뷰를 표시한다', async () => {
    renderTab();
    fireEvent.click(screen.getByText('멘토 스케줄'));
    expect(await screen.findByText('멘토스케줄목')).toBeInTheDocument();
    expect(screen.queryByText(/예약관리목/)).not.toBeInTheDocument();
  });

  // 새로고침해도 보던 하위탭이 유지되어야 한다.
  it('URL 의 sub 파라미터로 하위탭을 복원한다', () => {
    renderTab('/?sub=live-mentoring');
    expect(screen.getByText('예약관리목 LIVE_MENTORING')).toBeInTheDocument();
  });

  it('알 수 없는 sub 값은 예약 관리로 되돌린다', () => {
    renderTab('/?sub=unknown');
    expect(screen.getByText('예약관리목 유형선택가능')).toBeInTheDocument();
  });
});
