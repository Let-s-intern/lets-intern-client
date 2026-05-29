import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
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
  });

  it('멘토 스케줄 서브탭으로 전환하면 준비 중 안내를 표시한다', () => {
    renderTab();
    fireEvent.click(screen.getByText('멘토 스케줄'));
    expect(
      screen.getByText('멘토 스케줄은 준비 중입니다.'),
    ).toBeInTheDocument();
  });
});
