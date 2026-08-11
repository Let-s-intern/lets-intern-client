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

import { Schedule } from '@/schema';
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

/** 특정 회차에만 출석 기록을 붙인 스케줄 목록 */
const schedulesWithAttendance = (
  th: number,
  attendance: Partial<Schedule['attendanceInfo']>,
): Schedule[] =>
  schedules.map((schedule) =>
    schedule.missionInfo.th === th
      ? {
          ...schedule,
          attendanceInfo: { ...schedule.attendanceInfo, ...attendance },
        }
      : schedule,
  );

const setup = (
  now: { valueOf: () => number },
  todayTh: number | null,
  overrideSchedules?: Schedule[],
) => {
  jest.useFakeTimers().setSystemTime(now.valueOf());
  const wrapperEl = document.createElement('div');
  mockSwiper.wrapperEl = wrapperEl;

  const { container } = render(
    <MissionCalendarSection
      schedules={overrideSchedules ?? schedules}
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

  // 예전에는 todayTh(회차 번호)를 카드 인덱스처럼 썼다. 그 계산은 0회차가 있는 편성에서만
  // 맞고, 0회차가 없으면 인덱스가 th - 1 이라 점이 한 칸씩 앞섰다.
  // 1회차가 진행 중인데 점이 2회차 위에 놓이던 것이 그 때문이다.
  it('진행 중인 회차의 카드 자리를 가리킨다 (0회차 없는 편성)', () => {
    // 1~23회차 + 보너스. 3회차 진행 중이면 카드 인덱스는 2 다.
    const { progressPercent } = setup(noonOfMission(3), 3);

    const CARD_CENTER_FRACTION = 74.8 / (2 * 82);
    expect(progressPercent()).toBeCloseTo(
      ((2 + CARD_CENTER_FRACTION) / schedules.length) * 100,
      5,
    );
  });

  it('예전처럼 한 칸 앞선 자리를 가리키지 않는다', () => {
    const { progressPercent } = setup(noonOfMission(3), 3);

    const CARD_CENTER_FRACTION = 74.8 / (2 * 82);
    const oneCardAhead =
      ((3 + CARD_CENTER_FRACTION) / schedules.length) * 100;

    expect(progressPercent()).not.toBeCloseTo(oneCardAhead, 5);
  });

  // 예전에는 result === 'PASS' 를 봤다. 그건 어드민이 확인 완료 처리한 뒤에야 붙는 값이라,
  // 유저가 제출을 마쳐도 '확인중'(WAITING) 동안 진행바가 꿈쩍하지 않았다.
  it('제출하면 확인 전이어도 앞으로 나아간다', () => {
    const before = setup(noonOfMission(3), 3).progressPercent();

    const submittedWaiting = schedulesWithAttendance(3, {
      submitted: true,
      id: 1,
      status: 'PRESENT',
      result: 'WAITING',
    });
    const after = setup(noonOfMission(3), 3, submittedWaiting).progressPercent();

    expect(after).toBeGreaterThan(before);
  });

  // 어드민이 만든 결석 행은 제출이 아니다.
  it('결석 처리된 회차는 제출로 치지 않는다', () => {
    const before = setup(noonOfMission(3), 3).progressPercent();

    const markedAbsent = schedulesWithAttendance(3, {
      submitted: true,
      id: 1,
      status: 'ABSENT',
      result: null,
    });
    const after = setup(noonOfMission(3), 3, markedAbsent).progressPercent();

    expect(after).toBeCloseTo(before, 5);
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
