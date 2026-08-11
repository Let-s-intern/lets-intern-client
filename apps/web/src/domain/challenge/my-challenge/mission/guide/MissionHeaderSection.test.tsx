/**
 * @jest-environment jsdom
 */
import dayjs from '@/lib/dayjs';
import { render } from '@testing-library/react';
import { Dayjs } from 'dayjs';
import MissionHeaderSection from './MissionHeaderSection';

const NOW = dayjs('2026-08-11T12:00:00+09:00');

const setup = ({
  th = 3,
  startDate = null as Dayjs | null,
  endDate = null as Dayjs | null,
}: {
  th?: number | null;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
} = {}) => {
  jest.useFakeTimers().setSystemTime(NOW.valueOf());

  return render(
    <MissionHeaderSection
      selectedMissionTh={th}
      missionType="직무 탐색"
      missionStartDate={startDate}
      missionEndDate={endDate}
    />,
  ).container;
};

const upcoming = {
  startDate: dayjs('2026-08-15T08:00:00+09:00'),
  endDate: dayjs('2026-08-15T23:59:00+09:00'),
};
const inProgress = {
  startDate: dayjs('2026-08-11T08:00:00+09:00'),
  endDate: dayjs('2026-08-11T23:59:00+09:00'),
};
const past = {
  startDate: dayjs('2026-08-09T08:00:00+09:00'),
  endDate: dayjs('2026-08-09T23:59:00+09:00'),
};

afterEach(() => {
  jest.useRealTimers();
});

describe('MissionHeaderSection 기간 문구', () => {
  // 전체 공개 뒤로는 미래 회차를 여는 일이 늘어난다. 언제 열리는지 말해 준다.
  it('시작 전 회차는 오픈 시각을 알린다', () => {
    const container = setup({ ...upcoming });

    expect(container.textContent).toContain('8월 15일 08:00 오픈');
    expect(container.textContent).not.toContain('마감기한');
  });

  it('진행 중 회차는 마감기한을 알린다', () => {
    const container = setup({ ...inProgress });

    expect(container.textContent).toContain('마감기한 08.11 23:59까지');
  });

  it('마감된 회차도 마감기한을 알리고 회색으로 표시한다', () => {
    const container = setup({ ...past });

    expect(container.textContent).toContain('마감기한 08.09 23:59까지');
    expect(container.querySelector('.text-neutral-60')).not.toBeNull();
  });

  it('마감 전에는 강조색으로 표시한다', () => {
    const container = setup({ ...inProgress });

    expect(container.querySelector('.text-primary-90')).not.toBeNull();
    expect(container.querySelector('.text-neutral-60')).toBeNull();
  });

  it('0회차(OT)는 기간을 말하지 않는다', () => {
    const container = setup({ th: 0, ...inProgress });

    expect(container.textContent).not.toContain('마감기한');
    expect(container.textContent).not.toContain('오픈');
  });

  it('날짜를 모르면 예외 없이 기간 없이 렌더된다', () => {
    const container = setup({ startDate: null, endDate: null });

    expect(container.textContent).toContain('3회차 미션');
    expect(container.textContent).not.toContain('마감기한');
    expect(container.textContent).not.toContain('오픈');
  });

  it('startDate 만 없으면 마감기한만 보여준다', () => {
    const container = setup({ startDate: null, endDate: inProgress.endDate });

    expect(container.textContent).toContain('마감기한 08.11 23:59까지');
  });
});

describe('MissionHeaderSection 제목', () => {
  it.each([
    [3, '3회차 미션'],
    [0, '0회차 미션'],
    [99, '인재풀 미션'],
    [100, '보너스 미션'],
  ])('%s 회차 → %s', (th, title) => {
    expect(setup({ th, ...inProgress }).textContent).toContain(title);
  });

  it('회차를 모르면 "미션" 으로 표시한다', () => {
    const container = setup({ th: null, ...inProgress });

    expect(container.textContent).toContain('미션');
    expect(container.textContent).not.toContain('null');
  });
});
