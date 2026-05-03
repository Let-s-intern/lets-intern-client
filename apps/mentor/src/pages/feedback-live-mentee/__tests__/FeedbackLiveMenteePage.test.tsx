import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import FeedbackLiveMenteePage from '../FeedbackLiveMenteePage';

describe('FeedbackLiveMenteePage', () => {
  it('헤더와 검색 입력이 노출된다', () => {
    render(<FeedbackLiveMenteePage />);
    expect(
      screen.getByRole('heading', { name: '멘티관리' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('멘티 검색')).toBeInTheDocument();
  });

  it('검색 키워드로 필터링된다 (없는 이름 → 빈 상태)', async () => {
    const user = userEvent.setup();
    render(<FeedbackLiveMenteePage />);

    await user.type(screen.getByLabelText('멘티 검색'), '__존재하지않는이름__');
    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });
});
