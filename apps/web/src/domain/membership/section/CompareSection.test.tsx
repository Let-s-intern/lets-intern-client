import { render, screen } from '@testing-library/react';
import CompareSection from './CompareSection';

describe('CompareSection', () => {
  it('섹션 뱃지와 비교 타이틀(탈락자/합격자) + 가운데 VS 메달을 렌더한다', () => {
    render(<CompareSection />);
    expect(screen.getByText('왜 지금 시작해야 할까')).toBeInTheDocument();
    // "공채 n번째 탈락자"는 타이틀·loser 카드 헤딩 두 곳에 등장
    expect(
      screen.getAllByText('공채 n번째 탈락자').length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('공채 단기간 합격자')).toBeInTheDocument();
    // 텍스트 vs 는 제거, 카드 사이 VS 메달만 존재
    expect(screen.queryByText('vs')).not.toBeInTheDocument();
    expect(screen.getByText('VS')).toBeInTheDocument();
  });

  it('loser·winner 카드를 각각 1장씩 보여준다', () => {
    const { container } = render(<CompareSection />);
    expect(
      container.querySelector('.cmp-card[data-kind="loser"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('.cmp-card[data-kind="winner"]'),
    ).not.toBeNull();
  });

  it('winner 카드 헤더와 합격자 항목을 렌더한다', () => {
    render(<CompareSection />);
    expect(screen.getByText('7월부터 준비한 합격자')).toBeInTheDocument();
    expect(
      screen.getByText('7월부터 플랜에 맞춰 철저하게 대비'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('합격자 예시 참고해 미리 지원서 완성'),
    ).toBeInTheDocument();
  });

  it('loser 카드의 탈락자 항목을 렌더한다', () => {
    render(<CompareSection />);
    expect(
      screen.getByText('미루고 미루다 공고 뜨면 급하게 지원서 작성'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('탈락 경험은 있지만 뭐가 부족한지 몰라 또 똑같이 준비'),
    ).toBeInTheDocument();
  });
});
