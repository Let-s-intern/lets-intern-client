/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { useEffect } from 'react';

jest.mock('@/api/challenge/challenge', () => ({
  useChallengeMissionAttendanceInfoQuery: () => ({ error: null }),
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ applicationId: '1', programId: '369' }),
  usePathname: () => '/challenge/1/369',
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/domain/challenge/api/missionAccessLog', () => ({
  logMissionAccess: jest.fn(),
}));

jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => ({ currentChallenge: null }),
}));

// Swiper 는 ESM 이라 jest 에서 그대로 못 쓴다. 진행바는 swiper.wrapperEl 로
// portal 되므로 onSwiper 를 흉내 내야 확인할 수 있다.
jest.mock('swiper/css', () => ({}), { virtual: true });
jest.mock('swiper/react', () => ({
  Swiper: ({
    children,
    onSwiper,
  }: {
    children: React.ReactNode;
    onSwiper?: (swiper: unknown) => void;
  }) => {
    useEffect(() => onSwiper?.(mockSwiper), [onSwiper]);
    return <div data-testid="swiper">{children}</div>;
  },
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import {
  buildChallengeSchedules,
  dawnAfterMission,
  noonOfMission,
} from '../../../utils/__fixtures__/challengeSchedule';
import MissionCalendarSection from './MissionCalendarSection';

const mockSwiper = {
  isLocked: true,
  isBeginning: true,
  isEnd: false,
  activeIndex: 0,
  slides: [],
  slidesGrid: [0],
  slidesSizesGrid: [82],
  // setup 마다 새 엘리먼트를 물린다. 진행바는 여기로 portal 된다.
  wrapperEl: document.createElement('div'),
  slidesPerViewDynamic: () => 5,
  slideTo: jest.fn(),
};

const schedules = buildChallengeSchedules();

const setup = (now: { valueOf: () => number }, todayTh: number | null) => {
  jest.useFakeTimers().setSystemTime(now.valueOf());
  const wrapperEl = document.createElement('div');
  mockSwiper.wrapperEl = wrapperEl;

  const { container } = render(
    <MissionCalendarSection
      schedules={schedules}
      todayTh={todayTh}
      isDone={false}
    />,
  );

  /** 진행바 안쪽 막대의 width(`${progress}%`)에서 읽은 진행률 */
  const progressPercent = () =>
    Number.parseFloat(
      wrapperEl.querySelector<HTMLElement>('.bg-primary')?.style.width ?? '',
    );

  return { container, progressPercent };
};

afterEach(() => {
  jest.useRealTimers();
});

describe('MissionCalendarSection 상단 배너', () => {
  it('오늘 회차가 있으면 그 회차를 알린다', () => {
    const { container } = setup(noonOfMission(3), 3);

    expect(container.textContent).toContain('3회차');
    expect(container.textContent).toContain('미션날입니다!');
  });

  // "오늘은 N회차 미션날입니다" 는 오늘 회차가 있을 때만 성립한다.
  it('진행 중인 미션이 없는 시간대에는 배너를 숨긴다', () => {
    const { container } = setup(dawnAfterMission(3), null);

    expect(container.textContent).not.toContain('미션날입니다!');
  });

  it('마지막 미션까지 마감됐으면 배너를 숨긴다', () => {
    const { container } = setup(dawnAfterMission(30), null);

    expect(container.textContent).not.toContain('미션날입니다!');
  });
});

describe('MissionCalendarSection 진행바', () => {
  // 예전에는 todayTh 가 101 로 부풀어 Math.min(..., 100) 에 걸려 늘 가득 찼다.
  it('진행 중인 미션이 없는 시간대에도 100% 가 아니다', () => {
    const { progressPercent } = setup(dawnAfterMission(3), null);

    expect(progressPercent()).toBeGreaterThan(0);
    expect(progressPercent()).toBeLessThan(100);
  });

  it('정상 시간대의 위치는 예전 계산과 같다', () => {
    // 3회차 진행 중, 0회차가 없는 편성. 예전 계산은 (todayTh + 0.456) / 24 였다.
    const { progressPercent } = setup(noonOfMission(3), 3);

    const CARD_CENTER_FRACTION = 74.8 / (2 * 82);
    expect(progressPercent()).toBeCloseTo(
      ((3 + CARD_CENTER_FRACTION) / schedules.length) * 100,
      5,
    );
  });

  it('회차가 지날수록 늘어난다', () => {
    const early = setup(noonOfMission(3), 3).progressPercent();
    const later = setup(noonOfMission(15), 15).progressPercent();

    expect(later).toBeGreaterThan(early);
  });

  it('챌린지 시작 전에는 첫 칸에 머문다', () => {
    const { progressPercent } = setup(
      { valueOf: () => new Date('2026-07-01T12:00:00+09:00').getTime() },
      null,
    );

    expect(progressPercent()).toBeLessThan(10);
  });
});
