import { render, screen } from '@testing-library/react';
import type { ChallengeModalItem } from '../data/challengeModalItems';
import ChallengeBenefitCard from './ChallengeBenefitCard';

const coreItem: ChallengeModalItem = {
  label: '기필코 경험정리 챌린지',
  src: 'challenge-experience.jpg',
  url: '/challenge/experience-summary/latest',
  desc: '흩어진 활동을 정리해 나만의 경험 데이터베이스를 완성하세요.',
  badges: ['베이직 무료 참여', '플랜 업그레이드 시 차액 결제'],
  group: 'core',
  challengeType: 'EXPERIENCE_SUMMARY',
};

const jobItem: ChallengeModalItem = {
  ...coreItem,
  label: 'HR/인사 직무 챌린지',
  url: '/challenge/hr/latest',
  group: 'job',
  challengeType: 'HR',
};

describe('ChallengeBenefitCard', () => {
  it('제목·설명·배지 2개·링크를 렌더한다', () => {
    render(<ChallengeBenefitCard item={coreItem} />);
    expect(screen.getByText(coreItem.label)).toBeInTheDocument();
    expect(screen.getByText(coreItem.desc)).toBeInTheDocument();
    expect(screen.getByText('베이직 무료 참여')).toBeInTheDocument();
    expect(screen.getByText('플랜 업그레이드 시 차액 결제')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveTextContent('챌린지 자세히 보기');
  });

  it('링크 href 가 전달한 url 과 같다', () => {
    render(<ChallengeBenefitCard item={coreItem} />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/challenge/experience-summary/latest',
    );
  });

  it('썸네일에 alt 와 width/height, 지연 로딩 속성이 있다', () => {
    render(<ChallengeBenefitCard item={coreItem} />);
    const img = screen.getByAltText(`${coreItem.label} 썸네일`);
    expect(img).toHaveAttribute('src', '/images/membership/challenge-experience.jpg');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('job 그룹은 설명 문단 없이 제목·배지·링크만 보여준다', () => {
    const { container } = render(<ChallengeBenefitCard item={jobItem} />);
    expect(screen.getByText(jobItem.label)).toBeInTheDocument();
    expect(screen.queryByText(jobItem.desc)).not.toBeInTheDocument();
    expect(container.querySelector('.cb-card--job')).not.toBeNull();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/challenge/hr/latest',
    );
  });
});
