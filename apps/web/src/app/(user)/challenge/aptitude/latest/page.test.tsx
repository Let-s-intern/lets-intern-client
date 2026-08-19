import { render, screen } from '@testing-library/react';
import AptitudeLatest from './page';

const mockUseLatestChallengeRedirect = jest.fn();

jest.mock('@/hooks/useLatestChallengeRedirect', () => ({
  useLatestChallengeRedirect: (type: string) =>
    mockUseLatestChallengeRedirect(type),
}));

describe('AptitudeLatest', () => {
  beforeEach(() => {
    mockUseLatestChallengeRedirect.mockClear();
  });

  it("인적성 챌린지 타입인 'ETC' 로 리다이렉트 훅을 호출한다", () => {
    render(<AptitudeLatest />);
    expect(mockUseLatestChallengeRedirect).toHaveBeenCalledWith('ETC');
  });

  it('리다이렉트 대기 중 로딩 문구를 보여준다', () => {
    render(<AptitudeLatest />);
    expect(screen.getByText('인적성 챌린지로 이동 중...')).toBeInTheDocument();
  });
});
