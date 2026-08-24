import { fireEvent, render, screen } from '@testing-library/react';

import ScheduleSelectSection from '../section/ScheduleSelectSection';
import MonthCalendar from './MonthCalendar';

/*
  캘린더 단독 렌더 — 비활성 판정만 본다.
  슬롯에서 범위를 뽑는 부분은 ScheduleSelectSection 쪽에서 함께 확인한다.
*/
describe('MonthCalendar', () => {
  const baseProps = {
    year: 2026,
    month: 8, // 9월
    selectedDate: '2026-09-13',
    canGoPrev: false,
    canGoNext: false,
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onDateSelect: jest.fn(),
  };

  it('슬롯이 있는 날만 누를 수 있고 나머지는 비활성이다', () => {
    render(
      <MonthCalendar
        {...baseProps}
        monthAvailability={{ '2026-09-13': true, '2026-09-14': true }}
      />,
    );

    expect(screen.getByRole('button', { name: '13' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '14' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '15' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '1' })).toBeDisabled();
  });

  it('가능한 날을 누르면 그 날짜로 onDateSelect 를 부른다', () => {
    const onDateSelect = jest.fn();
    render(
      <MonthCalendar
        {...baseProps}
        monthAvailability={{ '2026-09-14': true }}
        onDateSelect={onDateSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '14' }));

    expect(onDateSelect).toHaveBeenCalledWith('2026-09-14');
  });

  it('범위 밖으로는 달을 넘길 수 없다', () => {
    render(<MonthCalendar {...baseProps} monthAvailability={{}} />);

    expect(screen.getByRole('button', { name: '이전 달' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled();
  });
});

const SLOTS = [
  {
    slotId: 142,
    startDate: '2026-09-13T10:00:00',
    endDate: '2026-09-13T10:30:00',
    status: 'OPEN' as const,
  },
  {
    slotId: 143,
    startDate: '2026-09-13T10:30:00',
    endDate: '2026-09-13T11:00:00',
    status: 'OPEN' as const,
  },
  {
    slotId: 144,
    startDate: '2026-09-14T09:30:00',
    endDate: '2026-09-14T10:00:00',
    status: 'OPEN' as const,
  },
];

describe('ScheduleSelectSection', () => {
  it('슬롯 목록에서 범위를 뽑아 가장 이른 날로 연다', () => {
    render(
      <ScheduleSelectSection
        slots={SLOTS}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={jest.fn()}
      />,
    );

    expect(screen.getByText('2026년 9월')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '13' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '14' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '15' })).toBeDisabled();
  });

  it('그날 슬롯이 있는 시각만 고를 수 있다', () => {
    render(
      <ScheduleSelectSection
        slots={SLOTS}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: '10:00 ~ 10:30' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '10:30 ~ 11:00' })).toBeEnabled();
    // 9월 13일에는 09:30 슬롯이 없다 — 격자 자리는 지키되 비활성이다
    expect(
      screen.getByRole('button', { name: '09:30 ~ 10:00' }),
    ).toBeDisabled();
  });

  it('날짜를 바꾸면 그날의 시간 그리드로 갈아끼운다', () => {
    render(
      <ScheduleSelectSection
        slots={SLOTS}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '14' }));

    expect(screen.getByRole('button', { name: '09:30 ~ 10:00' })).toBeEnabled();
    expect(
      screen.getByRole('button', { name: '10:00 ~ 10:30' }),
    ).toBeDisabled();
  });

  it('시간을 누르면 그 슬롯 하나를 올려 보낸다', () => {
    const onSelectSlots = jest.fn();
    render(
      <ScheduleSelectSection
        slots={SLOTS}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={onSelectSlots}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '10:00 ~ 10:30' }));

    expect(onSelectSlots).toHaveBeenCalledWith([
      {
        slotId: 142,
        date: '2026-09-13',
        time: '10:00',
        startDate: '2026-09-13T10:00:00',
        endDate: '2026-09-13T10:30:00',
      },
    ]);
  });

  it('슬롯이 하나도 없으면 캘린더 대신 안내 문구를 보여준다', () => {
    render(
      <ScheduleSelectSection
        slots={[]}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={jest.fn()}
      />,
    );

    expect(
      screen.getByText('현재 예약 가능한 일정이 없습니다.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '이전 달' })).toBeNull();
  });
});

/*
  슬롯 조회는 시트가 열린 뒤에 도착한다. 첫 렌더는 빈 배열이므로, 그때 잡힌 날짜가
  그대로 굳으면 슬롯이 와도 빈 달이 남는다. 시계를 슬롯보다 앞선 날로 고정해
  '오늘로 열렸는지'와 '첫 예약 가능일로 열렸는지'가 구분되게 한다.
*/
describe('ScheduleSelectSection 늦게 도착하는 슬롯', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-08-25T09:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('빈 배열로 열린 뒤 슬롯이 오면 첫 예약 가능일로 옮긴다', () => {
    const { rerender } = render(
      <ScheduleSelectSection
        slots={[]}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={jest.fn()}
      />,
    );

    expect(
      screen.getByText('현재 예약 가능한 일정이 없습니다.'),
    ).toBeInTheDocument();

    rerender(
      <ScheduleSelectSection
        slots={SLOTS}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={jest.fn()}
      />,
    );

    expect(screen.getByText('2026년 9월')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10:00 ~ 10:30' })).toBeEnabled();
  });

  it('사용자가 고른 날짜는 더 이른 슬롯이 와도 덮어쓰지 않는다', () => {
    const { rerender } = render(
      <ScheduleSelectSection
        slots={SLOTS}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '14' }));

    const earlier = {
      slotId: 130,
      startDate: '2026-08-31T13:00:00',
      endDate: '2026-08-31T13:30:00',
      status: 'OPEN' as const,
    };
    rerender(
      <ScheduleSelectSection
        slots={[earlier, ...SLOTS]}
        duration={30}
        selectedSlots={[]}
        onSelectSlots={jest.fn()}
      />,
    );

    expect(screen.getByText('2026년 9월')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '09:30 ~ 10:00' })).toBeEnabled();
  });
});
