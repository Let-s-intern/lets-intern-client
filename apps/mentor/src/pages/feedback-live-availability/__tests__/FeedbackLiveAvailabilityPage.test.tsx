import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import FeedbackLiveAvailabilityPage from '../FeedbackLiveAvailabilityPage';

describe('FeedbackLiveAvailabilityPage', () => {
  it('페이지 헤더와 안내 문구를 노출한다', () => {
    render(<FeedbackLiveAvailabilityPage />);
    expect(
      screen.getByRole('heading', { name: '가능한 시간 설정' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /라이브 피드백을 진행할 수 있는 시간대를 챌린지별로 설정하세요./,
      ),
    ).toBeInTheDocument();
  });

  it('page 모드 콘텐츠가 마운트되어 "되돌리기" 버튼이 노출된다', () => {
    render(<FeedbackLiveAvailabilityPage />);
    expect(
      screen.getByRole('button', { name: '되돌리기' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '저장하기' }),
    ).toBeInTheDocument();
  });
});
