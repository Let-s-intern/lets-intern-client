import { render, screen } from '@testing-library/react';
import SeminarSection from './SeminarSection';
import { SEMINAR_HEADER, SEMINAR_SESSIONS } from '../data/seminar';

describe('SeminarSection', () => {
  it('섹션 헤더(eyebrow·타이틀)를 렌더한다', () => {
    render(<SeminarSection />);
    expect(screen.getByText(SEMINAR_HEADER.badge)).toBeInTheDocument();
    expect(screen.getByText(SEMINAR_HEADER.title)).toBeInTheDocument();
  });

  it('데이터의 모든 세션 카드(LIVE 번호)를 렌더한다', () => {
    render(<SeminarSection />);
    for (const session of SEMINAR_SESSIONS) {
      expect(
        screen.getByText(`LIVE ${session.sessionNo}`),
      ).toBeInTheDocument();
    }
  });

  it('확정 세션은 "신청 가능", 미정 세션은 "오픈 예정" 상태를 표시한다', () => {
    render(<SeminarSection />);
    expect(screen.getByText('신청 가능')).toBeInTheDocument();
    // "오픈 예정"은 상태 배지와 비활성 CTA note 양쪽에 등장할 수 있다.
    expect(screen.getAllByText(/오픈 예정/).length).toBeGreaterThan(0);
  });
});
