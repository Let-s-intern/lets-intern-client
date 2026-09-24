import { render, screen } from '@testing-library/react';
import ChallengeScheduleSection from './ChallengeScheduleSection';
import { CHALLENGE_SCHEDULE, GANTT_ALT } from '../data/challengeSchedule';

// 이용 기간은 연동 챌린지의 endDate 에서 온다. 훅을 목으로 대체해 그 경로를 검증한다.
// (정오 기준 날짜를 써서 실행 환경 타임존이 달라도 날짜가 밀리지 않게 한다)
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => ({
    endDate: new Date('2026-11-30T12:00:00+09:00'),
  }),
}));

// 이 섹션에서 이미지는 간트 패널 한 장뿐이다. 헤더와 안내 박스는 텍스트다 —
// 안내 박스가 통이미지였을 때 375px 에서 글자가 읽히지 않아 되돌렸다.
describe('ChallengeScheduleSection', () => {
  it('앵커 네비가 쓰는 id="challenge-schedule" 를 유지한다', () => {
    const { container } = render(<ChallengeScheduleSection />);
    expect(
      container.querySelector('section#challenge-schedule'),
    ).not.toBeNull();
  });

  it('헤더는 텍스트로 그린다', () => {
    // 이미지에 넣으면 h2 가 사라져 검색에서 통째로 빠진다.
    const { container } = render(<ChallengeScheduleSection />);
    expect(container.querySelector('.sec-head h2')?.textContent).toBe(
      CHALLENGE_SCHEDULE.titleLines.join(''),
    );
    expect(container.querySelector('.sec-head p')?.textContent).toBe(
      CHALLENGE_SCHEDULE.subtitleLines.join(''),
    );
  });

  it('이미지는 간트 패널 한 장뿐이다', () => {
    render(<ChallengeScheduleSection />);
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toHaveAttribute(
      'src',
      '/images/membership/gantt-panel.webp',
    );
    expect(imgs[0]).toHaveAttribute('width', '2000');
    expect(imgs[0]).toHaveAttribute('height', '825');
  });

  it('안내 박스는 텍스트로 그리고 기한은 endDate 에서 온다', () => {
    // 통이미지였을 때는 문구도 기한도 이미지 안에 박혀 있었다.
    const { container } = render(<ChallengeScheduleSection />);
    expect(container.querySelector('.chsched-notice-lead')?.textContent).toBe(
      `${CHALLENGE_SCHEDULE.noticeLead} 11월 30일${CHALLENGE_SCHEDULE.noticeHighlightSuffix}`,
    );
    expect(
      screen.getByText(CHALLENGE_SCHEDULE.noticeDescription),
    ).toBeInTheDocument();
    expect(
      screen.getByText(CHALLENGE_SCHEDULE.periodLabel),
    ).toBeInTheDocument();
    expect(screen.getByText('~ 11/30')).toBeInTheDocument();
  });

  it('간트 바로 아래에 일정 조율 각주를 텍스트로 그린다', () => {
    // 간트에 박힌 날짜는 확정이 아니다. 지난 시즌 렛츠런 운영 일정 변경으로 CS 가 들어왔고
    // 9월 면접 챌린지 일정 조율이 예정돼 있어, 조율 가능성을 화면에서 먼저 밝힌다.
    const { container } = render(<ChallengeScheduleSection />);
    const disclaimer = container.querySelector('.chsched-disclaimer');
    expect(disclaimer?.textContent).toBe(CHALLENGE_SCHEDULE.scheduleDisclaimer);
    // 간트와 안내 박스 사이에 있어야 각주로 읽힌다.
    expect(
      disclaimer?.previousElementSibling?.classList.contains('gantt-wrap'),
    ).toBe(true);
    expect(
      disclaimer?.nextElementSibling?.classList.contains('chsched-notice'),
    ).toBe(true);
  });

  it('CLS 방지를 위해 이미지에 width·height 를 직접 지정한다', () => {
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
    const [gantt] = screen.getAllByRole('img');
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
