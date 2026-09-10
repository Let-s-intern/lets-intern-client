import { render, screen } from '@testing-library/react';
import RecommendSection from './RecommendSection';
import { RECOMMEND } from '../data/recommend';

describe('RecommendSection', () => {
  it('섹션 헤더(뱃지·제목)를 렌더한다', () => {
    render(<RecommendSection />);
    expect(screen.getByText(RECOMMEND.badge)).toBeInTheDocument();
    expect(screen.getByText('이런 분들을 위해 준비했어요')).toBeInTheDocument();
  });

  it('추천 컬럼 3개의 뱃지를 모두 보여준다', () => {
    render(<RecommendSection />);
    expect(screen.getByText('추천 1')).toBeInTheDocument();
    expect(screen.getByText('추천 2')).toBeInTheDocument();
    expect(screen.getByText('추천 3')).toBeInTheDocument();
  });

  it('컬럼 3개 × 항목 3개 = 9개의 공감 항목을 렌더한다', () => {
    const { container } = render(<RecommendSection />);
    expect(container.querySelectorAll('.rec-item')).toHaveLength(9);
    expect(
      screen.getByText('7~9월 공채 시즌을 전략적으로 준비하고 싶은 사람'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('매주 인증하며 취준 페이스를 유지하고 싶은 사람'),
    ).toBeInTheDocument();
  });
});
