import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';

import ProgramSchedule from '../ProgramSchedule';

// 챌린지 생성 화면이 넘기는 기본 시각: 시작 11:00, 종료와 모집 마감 23:59
const defaultValue = {
  startDate: dayjs('2026-11-24T11:00'),
  endDate: dayjs('2026-11-24T23:59'),
  beginning: dayjs('2026-11-24T09:30'),
  deadline: dayjs('2026-11-24T23:59'),
};

const renderSchedule = () => {
  const setInput = vi.fn();
  const onDeadlineChange = vi.fn();
  render(
    <ProgramSchedule
      defaultValue={defaultValue}
      setInput={setInput}
      onDeadlineChange={onDeadlineChange}
    />,
  );
  return { setInput, onDeadlineChange };
};

// 달력 버튼은 시작, 종료, 모집 시작, 모집 마감 순서다
const CALENDAR_BUTTON_INDEX = { startDate: 0, endDate: 1, deadline: 3 };

const pickDay = (field: keyof typeof CALENDAR_BUTTON_INDEX, day: string) => {
  fireEvent.click(
    screen.getAllByRole('button', { name: /Choose date/ })[
      CALENDAR_BUTTON_INDEX[field]
    ],
  );
  fireEvent.click(screen.getByRole('gridcell', { name: day }));
};

// setInput 에 마지막으로 넘어온 업데이터를 빈 입력에 적용해 저장될 값을 얻는다
const savedValue = (setInput: ReturnType<typeof vi.fn>) => {
  const updater = setInput.mock.calls.at(-1)?.[0] as (
    prev: Record<string, unknown>,
  ) => Record<string, unknown>;
  return updater({});
};

describe('ProgramSchedule 달력에서 날짜 선택', () => {
  it('시작 일자는 날짜만 바뀌고 11:00 을 유지한다', () => {
    const { setInput } = renderSchedule();

    pickDay('startDate', '15');

    expect(savedValue(setInput)).toEqual({ startDate: '2026-11-15T11:00' });
  });

  it('종료 일자는 날짜만 바뀌고 23:59 를 유지한다', () => {
    const { setInput } = renderSchedule();

    pickDay('endDate', '15');

    expect(savedValue(setInput)).toEqual({ endDate: '2026-11-15T23:59' });
  });

  it('모집 마감 일자는 날짜만 바뀌고 23:59 를 유지하며 가격 마감일에도 같은 값을 알린다', () => {
    const { setInput, onDeadlineChange } = renderSchedule();

    pickDay('deadline', '15');

    expect(savedValue(setInput)).toEqual({ deadline: '2026-11-15T23:59' });
    expect(
      onDeadlineChange.mock.calls.at(-1)?.[0].format('YYYY-MM-DDTHH:mm'),
    ).toBe('2026-11-15T23:59');
  });
});
