import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import FeedbackLiveMenteePage from '../FeedbackLiveMenteePage';

describe('FeedbackLiveMenteePage', () => {
  it('renders empty state when no mentee selected', () => {
    render(<FeedbackLiveMenteePage />);
    expect(screen.getByText('대화할 멘티를 선택하세요')).toBeInTheDocument();
  });

  it('shows mentee list with 5 mentees', () => {
    render(<FeedbackLiveMenteePage />);
    expect(screen.getByText('김지수')).toBeInTheDocument();
    expect(screen.getByText('박민준')).toBeInTheDocument();
    expect(screen.getByText('이서연')).toBeInTheDocument();
    expect(screen.getByText('최현우')).toBeInTheDocument();
    expect(screen.getByText('정다은')).toBeInTheDocument();
  });

  it('shows chat thread when mentee selected', async () => {
    const user = userEvent.setup();
    render(<FeedbackLiveMenteePage />);

    await user.click(screen.getByLabelText('김지수 멘티 대화 선택'));
    expect(screen.getByLabelText('메시지 입력')).toBeInTheDocument();
  });

  it('filters mentees by search keyword', async () => {
    const user = userEvent.setup();
    render(<FeedbackLiveMenteePage />);

    await user.type(screen.getByLabelText('멘티 검색'), '김지');
    expect(screen.getByText('김지수')).toBeInTheDocument();
    expect(screen.queryByText('박민준')).not.toBeInTheDocument();
  });
});
