/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

import type { LiveMentoringSlot } from '@/api/live-mentoring/liveMentoringSchema';
import type { SelectedApplySlot } from '../types';
import { useSlotSelection } from './useSlotSelection';

const DATE = '2026-09-14';

const slot = (
  slotId: number,
  time: string,
  endTime: string,
  status: LiveMentoringSlot['status'] = 'OPEN',
): LiveMentoringSlot => ({
  slotId,
  startDate: `${DATE}T${time}:00`,
  endDate: `${DATE}T${endTime}:00`,
  status,
});

/** 09:30~11:00 이 30분씩 세 칸 연속, 그리고 뒤가 끊긴 14:00 한 칸. */
const SLOTS = [
  slot(144, '09:30', '10:00'),
  slot(145, '10:00', '10:30'),
  slot(146, '10:30', '11:00'),
  slot(160, '14:00', '14:30'),
];

function setup(
  duration: 30 | 60 | null,
  slots: LiveMentoringSlot[] = SLOTS,
  selectedSlots: SelectedApplySlot[] = [],
) {
  const onSelectSlots = jest.fn();
  const { result } = renderHook(() =>
    useSlotSelection({
      slots,
      date: DATE,
      duration,
      selectedSlots,
      onSelectSlots,
    }),
  );
  const times = () => result.current.options.map((option) => option.time);
  const labels = () => result.current.options.map((option) => option.label);
  const hasTime = (time: string) => times().includes(time);
  return { result, onSelectSlots, times, labels, hasTime };
}

describe('useSlotSelection — 30분 플랜', () => {
  it('슬롯 1개만 잡는다', () => {
    const { result, onSelectSlots } = setup(30);

    result.current.onSelect('10:00');

    expect(onSelectSlots).toHaveBeenCalledWith([
      {
        slotId: 145,
        date: DATE,
        time: '10:00',
        startDate: `${DATE}T10:00:00`,
        endDate: `${DATE}T10:30:00`,
      },
    ]);
  });

  it('뒤가 끊긴 칸도 고를 수 있다', () => {
    const { hasTime } = setup(30);
    expect(hasTime('14:00')).toBe(true);
  });

  it('플랜을 아직 안 골랐으면 30분과 같게 다룬다', () => {
    const { hasTime } = setup(null);
    expect(hasTime('14:00')).toBe(true);
    expect(hasTime('10:30')).toBe(true);
  });

  /* 09:00~23:00 을 30분으로 끊던 28칸 고정 격자는 없앴다 */
  it('열린 슬롯 수만큼만 버튼을 만든다', () => {
    const { times } = setup(30);
    expect(times()).toEqual(['09:30', '10:00', '10:30', '14:00']);
  });

  it('30분 단위 라벨을 그대로 쓴다', () => {
    const { labels } = setup(30);
    expect(labels()).toEqual([
      '09:30 ~ 10:00',
      '10:00 ~ 10:30',
      '10:30 ~ 11:00',
      '14:00 ~ 14:30',
    ]);
  });

  /* 라이브 멘토링 슬롯 상태는 OPEN | RESERVED 둘뿐이다(liveMentoringSchema) */
  it('RESERVED 슬롯은 목록에 넣지 않는다', () => {
    const { times } = setup(30, [
      slot(144, '09:30', '10:00'),
      slot(145, '10:00', '10:30', 'RESERVED'),
      slot(146, '10:30', '11:00'),
    ]);

    expect(times()).toEqual(['09:30', '10:30']);
  });

  /* 슬롯 배열이 오름차순이라는 보장이 계약에 없다 */
  it('슬롯이 뒤섞여 와도 시간순으로 세운다', () => {
    const { times } = setup(30, [
      slot(146, '10:30', '11:00'),
      slot(144, '09:30', '10:00'),
      slot(145, '10:00', '10:30'),
    ]);

    expect(times()).toEqual(['09:30', '10:00', '10:30']);
  });
});

describe('useSlotSelection — 60분 플랜', () => {
  /* 화면은 한 칸이지만 서버로 가는 것은 슬롯 2건 그대로다 */
  it('연속 두 칸을 라벨 하나로 합친다', () => {
    const { labels } = setup(60);
    expect(labels()).toEqual(['09:30 ~ 10:30', '10:00 ~ 11:00']);
  });

  it('선택된 버튼은 앞 칸 하나뿐이다', () => {
    const selected: SelectedApplySlot[] = [
      {
        slotId: 144,
        date: DATE,
        time: '09:30',
        startDate: `${DATE}T09:30:00`,
        endDate: `${DATE}T10:00:00`,
      },
      {
        slotId: 145,
        date: DATE,
        time: '10:00',
        startDate: `${DATE}T10:00:00`,
        endDate: `${DATE}T10:30:00`,
      },
    ];
    const { result } = setup(60, SLOTS, selected);

    expect(result.current.selectedTime).toBe('09:30');
  });

  /* (가) 시안 1-2 — 11:00 을 누르면 11:00 과 11:30 이 함께 잡힌다 */
  it('누른 칸과 바로 다음 30분 칸을 함께 잡는다', () => {
    const { result, onSelectSlots } = setup(60);

    result.current.onSelect('09:30');

    expect(onSelectSlots).toHaveBeenCalledWith([
      expect.objectContaining({ slotId: 144, time: '09:30' }),
      expect.objectContaining({ slotId: 145, time: '10:00' }),
    ]);
  });

  /* (나) 그날 마지막 칸은 다음 칸이 없어 선택 자체가 막힌다 */
  it('연속된 다음 칸이 없는 칸은 목록에서 뺀다', () => {
    const { times, result, onSelectSlots } = setup(60);

    // 10:30 은 다음(11:00) 슬롯이 아예 없다. 14:00 도 마찬가지다.
    expect(times()).toEqual(['09:30', '10:00']);

    result.current.onSelect('10:30');
    expect(onSelectSlots).not.toHaveBeenCalled();
  });

  /* (다) 중간이 RESERVED 로 막히면 그 앞 칸도 60분으로는 못 쓴다 */
  it('다음 칸이 RESERVED 면 앞 칸도 목록에서 빠진다', () => {
    const { times } = setup(60, [
      slot(144, '09:30', '10:00'),
      slot(145, '10:00', '10:30', 'RESERVED'),
      slot(146, '10:30', '11:00'),
    ]);

    // RESERVED 칸 자체도 안 나오고, 그 앞 09:30 도 60분이 성립하지 않는다
    expect(times()).toEqual([]);
  });

  /*
    연속 판정은 endDate(직전) === startDate(다음) 이다. 서버가
    validateSlotsAreConsecutive 로 같은 기준을 다시 본다 — 시각을 30분 더하는
    식으로 흉내 내면 여기서 갈라진다.
  */
  it('시각이 이어져 보여도 endDate 가 맞지 않으면 잇지 않는다', () => {
    const { hasTime } = setup(60, [
      // 10:00 에 끝나는 것처럼 보이지만 endDate 가 09:50 이다
      { ...slot(144, '09:30', '10:00'), endDate: `${DATE}T09:50:00` },
      slot(145, '10:00', '10:30'),
    ]);

    expect(hasTime('09:30')).toBe(false);
  });

  it('이미 잡힌 칸을 다시 누르면 두 칸이 함께 풀린다', () => {
    const selected: SelectedApplySlot[] = [
      {
        slotId: 144,
        date: DATE,
        time: '09:30',
        startDate: `${DATE}T09:30:00`,
        endDate: `${DATE}T10:00:00`,
      },
      {
        slotId: 145,
        date: DATE,
        time: '10:00',
        startDate: `${DATE}T10:00:00`,
        endDate: `${DATE}T10:30:00`,
      },
    ];
    const { result, onSelectSlots } = setup(60, SLOTS, selected);

    result.current.onSelect('09:30');
    expect(onSelectSlots).toHaveBeenCalledWith([]);
  });

  /*
    합치기 전에는 10:00 이 선택 시각 목록에 들어 있어 다시 누르면 선택이 풀렸다.
    이제 10:00 은 10:00~11:00 이라는 다른 버튼이므로 그쪽으로 옮겨 가야 한다.
  */
  it('뒤 칸을 시작으로 하는 버튼을 누르면 그 자리로 옮긴다', () => {
    const selected: SelectedApplySlot[] = [
      {
        slotId: 144,
        date: DATE,
        time: '09:30',
        startDate: `${DATE}T09:30:00`,
        endDate: `${DATE}T10:00:00`,
      },
      {
        slotId: 145,
        date: DATE,
        time: '10:00',
        startDate: `${DATE}T10:00:00`,
        endDate: `${DATE}T10:30:00`,
      },
    ];
    const { result, onSelectSlots } = setup(60, SLOTS, selected);

    result.current.onSelect('10:00');

    expect(onSelectSlots).toHaveBeenCalledWith([
      expect.objectContaining({ slotId: 145, time: '10:00' }),
      expect.objectContaining({ slotId: 146, time: '10:30' }),
    ]);
  });
});
