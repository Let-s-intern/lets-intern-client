import { render, screen } from '@testing-library/react';
import ChallengeScheduleSection from './ChallengeScheduleSection';
import {
  CHALLENGE_SCHEDULE,
  GANTT_ALT,
  NOTICE_ALT,
} from '../data/challengeSchedule';

// 이 섹션은 시안 5.png 를 통째로 한 장 넣는다. 헤더·안내 박스도 이미지 안에 있으므로
// 검증할 것은 (1) 이미지가 규격대로 들어갔는지 (2) alt 가 잃어버린 텍스트를 담고 있는지다.
describe('ChallengeScheduleSection', () => {
  it('앵커 네비가 쓰는 id="challenge-schedule" 를 유지한다', () => {
    const { container } = render(<ChallengeScheduleSection />);
    expect(
      container.querySelector('section#challenge-schedule'),
    ).not.toBeNull();
  });

  it('헤더는 텍스트로 그린다', () => {
    // 이미지에 넣으면 h2 가 사라져 검색에서 통째로 빠진다.
    render(<ChallengeScheduleSection />);
    expect(
      screen.getByRole('heading', { name: CHALLENGE_SCHEDULE.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(CHALLENGE_SCHEDULE.subtitle)).toBeInTheDocument();
  });

  it('간트 패널과 안내 박스를 각각 이미지로 넣는다', () => {
    render(<ChallengeScheduleSection />);
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toHaveAttribute(
      'src',
      '/images/membership/gantt-panel.webp',
    );
    expect(imgs[0]).toHaveAttribute('width', '2000');
    expect(imgs[0]).toHaveAttribute('height', '825');
    expect(imgs[1]).toHaveAttribute(
      'src',
      '/images/membership/gantt-notice.webp',
    );
    expect(imgs[1]).toHaveAttribute('width', '2000');
    expect(imgs[1]).toHaveAttribute('height', '193');
  });

  it('CLS 방지를 위해 두 이미지 모두 width·height 를 직접 지정한다', () => {
    // domain/membership 은 next/image 를 쓰지 않아 크기 예약이 자동으로 되지 않는다.
    render(<ChallengeScheduleSection />);
    for (const img of screen.getAllByRole('img')) {
      expect(img.getAttribute('width')).toBeTruthy();
      expect(img.getAttribute('height')).toBeTruthy();
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('decoding', 'async');
    }
  });

  it('alt 가 이미지 안 텍스트를 문장으로 담는다', () => {
    render(<ChallengeScheduleSection />);
    const [gantt, notice] = screen.getAllByRole('img');
    expect(notice.getAttribute('alt')).toBe(NOTICE_ALT);
    const alt = gantt.getAttribute('alt') ?? '';
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
    expect(scroll!.querySelector('.gantt-img')).not.toBeNull();
  });
});
