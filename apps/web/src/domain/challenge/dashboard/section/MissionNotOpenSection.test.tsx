/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useParams: () => ({ programId: '369' }),
}));

const mockMissionDetail = jest.fn();
jest.mock('@/api/challenge/challenge', () => ({
  useChallengeMissionAttendanceInfoQuery: () => mockMissionDetail(),
}));

import dayjs from '@/lib/dayjs';
import { buildSchedule } from '../../utils/__fixtures__/challengeSchedule';
import MissionNotOpenSection from './MissionNotOpenSection';

const at = (iso: string) => dayjs(`${iso}+09:00`);

const setNow = (iso: string) =>
  jest.useFakeTimers().setSystemTime(at(iso).valueOf());

beforeEach(() => {
  mockMissionDetail.mockReturnValue({
    data: { missionInfo: { description: '다음 회차 미션 설명' } },
  });
});

afterEach(() => {
  jest.useRealTimers();
});

const nextSchedule = buildSchedule({
  th: 2,
  startDate: at('2026-08-12T08:00:00'),
  endDate: at('2026-08-12T23:59:00'),
});

describe('MissionNotOpenSection', () => {
  it('다음 회차와 열리는 시각을 알린다', () => {
    setNow('2026-08-11T14:00:00');

    const { container } = render(
      <MissionNotOpenSection nextSchedule={nextSchedule} />,
    );

    expect(container.textContent).toContain('2회차');
    expect(container.textContent).toContain('내일 오전 8시에 열려요');
  });

  // 이 자리에 완주 축하가 뜨던 것이 LC-3207 이다. 2회차를 앞둔 사람에게 나갔다.
  it('완주 축하 문구를 쓰지 않는다', () => {
    setNow('2026-08-12T02:00:00');

    const { container } = render(
      <MissionNotOpenSection nextSchedule={nextSchedule} />,
    );

    expect(container.textContent).not.toContain('완료되었습니다');
    expect(container.textContent).not.toContain('완주');
    expect(container.textContent).toContain('오늘 오전 8시에 열려요');
  });

  it('한 시간 안쪽이면 분으로 센다', () => {
    setNow('2026-08-12T07:19:00');

    const { container } = render(
      <MissionNotOpenSection nextSchedule={nextSchedule} />,
    );

    expect(container.textContent).toContain('41분 뒤 열려요');
  });

  // 빈 시간대라고 화면 구조가 통째로 바뀌면 그것대로 고장으로 읽힌다.
  it('기존 미션 카드와 같은 구조를 쓰고 버튼은 잠근다', () => {
    setNow('2026-08-11T14:00:00');

    const { container } = render(
      <MissionNotOpenSection nextSchedule={nextSchedule} />,
    );

    expect(container.textContent).toContain('미션 수행하기');
    expect(container.textContent).toContain('다음 회차 미션 설명');

    const button = container.querySelector('.cursor-not-allowed');
    expect(button).not.toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });

  // OT 를 통과하지 않으면 상세 조회가 400 이라 설명이 없다.
  it('설명을 못 받아도 제목과 오픈 시각은 보여준다', () => {
    setNow('2026-08-11T14:00:00');
    mockMissionDetail.mockReturnValue({ data: undefined });

    const { container } = render(
      <MissionNotOpenSection nextSchedule={nextSchedule} />,
    );

    expect(container.textContent).toContain('2회차');
    expect(container.textContent).toContain('내일 오전 8시에 열려요');
  });

  it('시작일을 모르는 회차에도 터지지 않는다', () => {
    setNow('2026-08-11T14:00:00');

    const noStartDate = buildSchedule({
      th: 2,
      startDate: null,
      endDate: null,
    });

    const { container } = render(
      <MissionNotOpenSection nextSchedule={noStartDate} />,
    );

    expect(container.textContent).toContain('곧 열려요');
  });
});
