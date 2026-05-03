import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import FeedbackLiveReservationPage from '../FeedbackLiveReservationPage';

describe('FeedbackLiveReservationPage', () => {
  it('헤더와 mock 안내가 노출된다', () => {
    render(<FeedbackLiveReservationPage />);
    expect(
      screen.getByRole('heading', { name: '예약 현황' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/예약 리스트는 mock 데이터입니다/),
    ).toBeInTheDocument();
  });

  it('상태 탭이 3개 노출되고 클릭 시 활성 상태가 변한다', async () => {
    const user = userEvent.setup();
    render(<FeedbackLiveReservationPage />);

    const allTab = screen.getByRole('tab', { name: /전체/ });
    const waitingTab = screen.getByRole('tab', { name: /예정/ });
    const completedTab = screen.getByRole('tab', { name: /완료/ });

    expect(allTab).toHaveAttribute('aria-selected', 'true');
    expect(waitingTab).toHaveAttribute('aria-selected', 'false');

    await user.click(completedTab);
    expect(completedTab).toHaveAttribute('aria-selected', 'true');
    expect(allTab).toHaveAttribute('aria-selected', 'false');
  });
});
