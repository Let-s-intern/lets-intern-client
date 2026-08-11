/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { buildSchedule } from '../../utils/__fixtures__/challengeSchedule';
import MissionNotOpenSection from './MissionNotOpenSection';

import dayjs from '@/lib/dayjs';

const at = (iso: string) => dayjs(`${iso}+09:00`);

const setNow = (iso: string) =>
  jest.useFakeTimers().setSystemTime(at(iso).valueOf());

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

    expect(container.textContent).toContain('다음 미션');
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
