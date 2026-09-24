import { render, screen } from '@testing-library/react';
import SeminarSection from './SeminarSection';
import { SEMINAR_HEADER, SEMINAR_SESSIONS } from '../data/seminar';

describe('SeminarSection', () => {
  it('섹션 헤더(eyebrow·타이틀)를 렌더한다', () => {
    render(<SeminarSection />);
    expect(screen.getByText(SEMINAR_HEADER.badge)).toBeInTheDocument();
    expect(screen.getByText(SEMINAR_HEADER.title)).toBeInTheDocument();
  });

  it('데이터의 모든 세션 카드(SESSION 번호)를 렌더한다', () => {
    render(<SeminarSection />);
    for (const session of SEMINAR_SESSIONS) {
      expect(
        screen.getByText(`SESSION ${session.sessionNo}`),
      ).toBeInTheDocument();
    }
  });

  it('각 세션 CTA 가 실제 program/live 신청 링크(신규 탭)로 연결된다', () => {
    render(<SeminarSection />);
    const ctas = screen.getAllByRole('link');
    expect(ctas).toHaveLength(2);
    for (const cta of ctas) {
      expect(cta.getAttribute('href')).toMatch(/\/program\/live\/(99|100)\//);
      expect(cta).toHaveAttribute('target', '_blank');
      expect(cta).toHaveAttribute('rel', 'noopener');
    }
  });
});
