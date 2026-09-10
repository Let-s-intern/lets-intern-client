import { render, screen } from '@testing-library/react';
import SeminarSessionCard from './SeminarSessionCard';
import type { SeminarSession } from '../data/seminar';

const base: SeminarSession = {
  sessionNo: '01',
  theme: 'blue',
  heroImage: '/images/membership/seminar-hero-01.png',
  heroAlt: '히어로 배너',
  date: '6월 28일 (일)',
  time: '오전 10:30–11:30',
  title: '대기업 하반기 공채 준비는 지금부터',
  description: '현직자와 함께 13주 계획을 세워요.',
  agenda: [
    { no: '01', title: '하반기 공채의 현실', duration: '10분' },
    { no: '02', title: '13주 합격 로드맵', duration: '20분' },
    { no: '03', title: '단계별 준비법 + 합격 사례', duration: '20분' },
    { no: '04', title: '실시간 Q&A', duration: '10분' },
  ],
  mentor: {
    name: '닉',
    role: '삼성 계열사 영업지원팀',
    profile: '삼성·CJ 동시 최종합격',
  },
  ctaLabel: '6/28 세미나 신청하기',
  ctaHref: 'https://www.letscareer.co.kr/program/live/100/abc',
};

describe('SeminarSessionCard', () => {
  it('hero 이미지·일시·제목·설명을 렌더한다', () => {
    render(<SeminarSessionCard session={base} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', base.heroImage);
    expect(screen.getByText('SESSION 01')).toBeInTheDocument();
    expect(screen.getByText('6월 28일 (일)')).toBeInTheDocument();
    expect(screen.getByText('오전 10:30–11:30')).toBeInTheDocument();
    expect(
      screen.getByText('대기업 하반기 공채 준비는 지금부터'),
    ).toBeInTheDocument();
  });

  it('커리큘럼 4종과 멘토 이름·소속을 표시한다', () => {
    render(<SeminarSessionCard session={base} />);
    expect(screen.getByText('13주 합격 로드맵')).toBeInTheDocument();
    expect(screen.getAllByText('10분')).toHaveLength(2);
    expect(
      screen.getByText('닉 멘토 · 삼성 계열사 영업지원팀'),
    ).toBeInTheDocument();
  });

  it('ctaHref 로 향하는 신규 탭 링크 CTA 를 렌더한다', () => {
    render(<SeminarSessionCard session={base} />);
    const cta = screen.getByRole('link', { name: /6\/28 세미나 신청하기/ });
    expect(cta).toHaveAttribute('href', base.ctaHref);
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', 'noopener');
  });

  it('notice 가 있으면 경고 문구를, 없으면 표시하지 않는다', () => {
    const { rerender } = render(<SeminarSessionCard session={base} />);
    expect(screen.queryByText(/VOD/)).not.toBeInTheDocument();

    rerender(
      <SeminarSessionCard
        session={{ ...base, notice: 'VOD 미제공 · LIVE 참여 필수' }}
      />,
    );
    expect(screen.getByText('VOD 미제공 · LIVE 참여 필수')).toBeInTheDocument();
  });
});
