import { render, screen } from '@testing-library/react';
import ChallengeScheduleSection from './ChallengeScheduleSection';
import { CHALLENGE_SCHEDULE, GANTT_SIZE } from '../data/challengeSchedule';

// 이용 기간은 연동 챌린지의 endDate 에서 온다. 훅을 목으로 대체해 그 경로를 검증한다.
// (정오 기준 날짜를 써서 실행 환경 타임존이 달라도 날짜가 밀리지 않게 한다)
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => ({
    endDate: new Date('2026-11-30T12:00:00+09:00'),
  }),
}));

describe('ChallengeScheduleSection', () => {
  it('헤드라인과 서브카피를 렌더한다', () => {
    render(<ChallengeScheduleSection />);
    expect(screen.getByText(CHALLENGE_SCHEDULE.title)).toBeInTheDocument();
    expect(screen.getByText(CHALLENGE_SCHEDULE.subtitle)).toBeInTheDocument();
  });

  it('간트 이미지는 비어 있지 않은 alt 와 width·height 를 가진다', () => {
    render(<ChallengeScheduleSection />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('alt')?.length ?? 0).toBeGreaterThan(30);
    expect(img).toHaveAttribute('width', String(GANTT_SIZE.width));
    expect(img).toHaveAttribute('height', String(GANTT_SIZE.height));
  });

  it('간트 이미지 src 는 webp 다', () => {
    render(<ChallengeScheduleSection />);
    expect(screen.getByRole('img').getAttribute('src')).toMatch(/\.webp$/);
  });

  it('안내 박스의 이용 기간은 endDate 를 포맷한 값이다', () => {
    const { container } = render(<ChallengeScheduleSection />);
    expect(container.querySelector('.chsched-notice-lead')?.textContent).toBe(
      `${CHALLENGE_SCHEDULE.noticeLead} 11월 30일${CHALLENGE_SCHEDULE.noticeHighlightSuffix}`,
    );
    expect(
      screen.getByText(CHALLENGE_SCHEDULE.periodLabel),
    ).toBeInTheDocument();
    expect(screen.getByText('~ 11/30')).toBeInTheDocument();
  });

  it('가로 스크롤은 간트 컨테이너 안에서만 일어난다(스크롤 힌트 포함)', () => {
    const { container } = render(<ChallengeScheduleSection />);
    const scroll = container.querySelector('.gantt-scroll');
    expect(scroll).not.toBeNull();
    expect(scroll?.contains(screen.getByRole('img'))).toBe(true);
    expect(container.querySelector('.gantt-fade')).not.toBeNull();
  });
});
