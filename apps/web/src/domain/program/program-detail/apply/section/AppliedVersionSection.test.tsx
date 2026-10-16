import { render, screen } from '@testing-library/react';

import AppliedVersionSection from './AppliedVersionSection';

describe('AppliedVersionSection', () => {
  it('신청 버전을 읽기 전용으로 보인다', () => {
    render(<AppliedVersionSection versionTitle="이직자" />);

    expect(screen.getByText('신청 버전')).toBeInTheDocument();
    expect(screen.getByText('이직자')).toBeInTheDocument();
    expect(screen.queryByRole('radio')).toBeNull();
  });
});
