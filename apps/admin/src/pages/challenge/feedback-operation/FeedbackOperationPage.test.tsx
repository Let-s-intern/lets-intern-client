import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./MentorNoticeManagement', () => ({
  default: () => <div>공지사항화면</div>,
}));
vi.mock('./OngoingChallenges', () => ({
  default: () => <div>진행중챌린지화면</div>,
}));
vi.mock('./live-feedback/LiveFeedbackTab', () => ({
  default: () => <div>라이브피드백화면</div>,
}));

import FeedbackOperationPage from './FeedbackOperationPage';

describe('FeedbackOperationPage', () => {
  it('탭은 공지사항/진행중 챌린지/LIVE 피드백 순으로 렌더된다', () => {
    render(<FeedbackOperationPage />);
    const tabs = screen.getAllByRole('button');
    expect(tabs.map((t) => t.textContent)).toEqual([
      '공지사항',
      '진행중 챌린지',
      'LIVE 피드백',
    ]);
  });

  it('기본 탭은 공지사항이다', () => {
    render(<FeedbackOperationPage />);
    expect(screen.getByText('공지사항화면')).toBeInTheDocument();
  });

  it('LIVE 피드백 탭 클릭 시 lazy 컴포넌트를 렌더한다', async () => {
    render(<FeedbackOperationPage />);
    fireEvent.click(screen.getByText('LIVE 피드백'));
    await waitFor(() =>
      expect(screen.getByText('라이브피드백화면')).toBeInTheDocument(),
    );
  });
});
