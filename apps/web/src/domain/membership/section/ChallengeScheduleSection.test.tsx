import { render, screen } from '@testing-library/react';
import ChallengeScheduleSection from './ChallengeScheduleSection';
import { GANTT_ALT } from '../data/challengeSchedule';

// 이 섹션은 시안 5.png 를 통째로 한 장 넣는다. 헤더·안내 박스도 이미지 안에 있으므로
// 검증할 것은 (1) 이미지가 규격대로 들어갔는지 (2) alt 가 잃어버린 텍스트를 담고 있는지다.
describe('ChallengeScheduleSection', () => {
  it('앵커 네비가 쓰는 id="challenge-schedule" 를 유지한다', () => {
    const { container } = render(<ChallengeScheduleSection />);
    expect(container.querySelector('section#challenge-schedule')).not.toBeNull();
  });

  it('시안 전체를 한 장으로 넣는다', () => {
    render(<ChallengeScheduleSection />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/images/membership/gantt-full.webp');
    expect(img).toHaveAttribute('width', '2880');
    expect(img).toHaveAttribute('height', '1914');
  });

  it('CLS 방지를 위해 width·height 를 직접 지정한다', () => {
    // domain/membership 은 next/image 를 쓰지 않아 크기 예약이 자동으로 되지 않는다.
    render(<ChallengeScheduleSection />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('width')).toBeTruthy();
    expect(img.getAttribute('height')).toBeTruthy();
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('alt 가 이미지 안 텍스트를 문장으로 담는다', () => {
    render(<ChallengeScheduleSection />);
    const img = screen.getByRole('img');
    const alt = img.getAttribute('alt') ?? '';
    expect(alt).toBe(GANTT_ALT);
    // 이름표 수준("간트 차트")이면 검색·스크린리더 손실을 못 메운다.
    expect(alt.length).toBeGreaterThan(30);
    for (const row of ['경험 정리', '서류 완성', '인적성']) {
      expect(alt).toContain(row);
    }
  });

  it('좁은 폭 대비 가로 스크롤 컨테이너로 감싼다', () => {
    // 페이지가 아니라 이 컨테이너 안에서만 가로로 스크롤돼야 한다.
    const { container } = render(<ChallengeScheduleSection />);
    const scroll = container.querySelector('.gantt-scroll');
    expect(scroll).not.toBeNull();
    expect(scroll!.querySelector('img')).not.toBeNull();
  });
});
