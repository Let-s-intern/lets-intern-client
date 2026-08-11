/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';

// 자식 섹션은 각자 쿼리·폼을 끌고 온다. 여기서 볼 것은 "무엇이 그려지는가" 뿐이다.
jest.mock('./MissionSubmitZeroSection', () => ({
  __esModule: true,
  default: () => <div>OT 제출 폼</div>,
}));
jest.mock('./bonus/MissionSubmitBonusSection', () => ({
  __esModule: true,
  default: () => <div>보너스 제출 폼</div>,
}));
jest.mock('../talent/MissionSubmitTalentPoolSection', () => ({
  __esModule: true,
  default: () => <div>인재풀 제출 폼</div>,
}));
jest.mock('./regular/MissionSubmitRegularSection', () => ({
  __esModule: true,
  default: () => <div>일반 제출 폼</div>,
}));

let mockTestDate: string | undefined;
jest.mock('@/domain/challenge/hooks/useChallengeNav', () => ({
  __esModule: true,
  default: () => ({
    testDate: mockTestDate,
    withTestDate: (path: string) => path,
  }),
}));

import { buildSchedule } from '@/domain/challenge/utils/__fixtures__/challengeSchedule';
import dayjs from '@/lib/dayjs';
import { useMissionStore } from '@/store/useMissionStore';
import { Dayjs } from 'dayjs';
import MissionSubmitSection from './MissionSubmitSection';

const NOW = dayjs('2026-08-11T12:00:00+09:00');

const period = {
  upcoming: {
    startDate: dayjs('2026-08-15T08:00:00+09:00'),
    endDate: dayjs('2026-08-15T23:59:00+09:00'),
  },
  inProgress: {
    startDate: dayjs('2026-08-11T08:00:00+09:00'),
    endDate: dayjs('2026-08-11T23:59:00+09:00'),
  },
  past: {
    startDate: dayjs('2026-08-09T08:00:00+09:00'),
    endDate: dayjs('2026-08-09T23:59:00+09:00'),
  },
};

const setup = (
  th: number,
  dates: { startDate: Dayjs | null; endDate: Dayjs | null },
) => {
  jest.useFakeTimers().setSystemTime(NOW.valueOf());
  useMissionStore.setState({
    selectedMissionId: 1000 + th,
    selectedMissionTh: th,
  });

  const schedule = buildSchedule({ th, ...dates });

  return render(<MissionSubmitSection mission={schedule.missionInfo} />)
    .container;
};

afterEach(() => {
  mockTestDate = undefined;
  jest.useRealTimers();
});

describe('MissionSubmitSection 제출 가능 시점', () => {
  it('시작 전 회차는 제출 폼 대신 오픈 안내를 그린다', () => {
    const container = setup(3, period.upcoming);

    expect(container.textContent).not.toContain('제출 폼');
    expect(container.textContent).toContain(
      '이 미션은 8월 15일 오전 8시부터 제출할 수 있습니다.',
    );
    expect(container.textContent).toContain(
      '미리 자료를 확인하고 준비해 주세요.',
    );
  });

  it('진행 중 회차는 제출 폼을 그린다', () => {
    expect(setup(3, period.inProgress).textContent).toContain('일반 제출 폼');
  });

  // 지각 제출은 유지 결정이다. 마감 후에도 폼이 열려 있어야 한다.
  it('마감된 회차도 제출 폼을 그린다', () => {
    expect(setup(3, period.past).textContent).toContain('일반 제출 폼');
  });
});

// 예전에는 OT·보너스·인재풀이 시작일 검사보다 앞에서 반환돼, 아직 열리지 않은
// 특수 미션에도 제출 폼이 그려졌다. 챌린지 369 의 보너스가 그랬다.
describe('MissionSubmitSection 특수 회차 시작일 게이트', () => {
  it.each([[0], [99], [100]])(
    '시작 전 %s회차는 제출 폼을 그리지 않는다',
    (th) => {
      const container = setup(th, period.upcoming);

      expect(container.textContent).not.toContain('제출 폼');
      expect(container.textContent).toContain('제출할 수 있습니다');
    },
  );

  it.each([
    [0, 'OT 제출 폼'],
    [99, '인재풀 제출 폼'],
    [100, '보너스 제출 폼'],
  ])('진행 중 %s회차는 %s 을 그린다', (th, formLabel) => {
    expect(setup(th, period.inProgress).textContent).toContain(formLabel);
  });
});

describe('MissionSubmitSection 예외 상황', () => {
  it('미션 날짜를 모르면 예전처럼 회차별 폼을 그린다', () => {
    const container = setup(3, { startDate: null, endDate: null });

    expect(container.textContent).toContain('일반 제출 폼');
  });

  it('선택된 미션이 없으면 회차별 폼을 그린다', () => {
    jest.useFakeTimers().setSystemTime(NOW.valueOf());
    useMissionStore.setState({ selectedMissionId: 1003, selectedMissionTh: 3 });

    const { container } = render(<MissionSubmitSection />);

    expect(container.textContent).toContain('일반 제출 폼');
  });

  // 어드민 미리보기는 ?testDate= 로 '지금' 을 옮긴다. 게이트도 그 날짜를 따라야 한다.
  it('testDate 가 있으면 그 날짜를 기준으로 판정한다', () => {
    // 실제 지금(8/11)은 시작 전이지만 미리보기 날짜(8/16)로는 이미 마감된 회차다.
    mockTestDate = '2026-08-16';
    const container = setup(3, period.upcoming);

    expect(container.textContent).toContain('일반 제출 폼');
  });
});
