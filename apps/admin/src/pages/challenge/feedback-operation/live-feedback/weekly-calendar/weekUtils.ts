import dayjs from '@/lib/dayjs';

/**
 * 주간 그리드 시간 계산 유틸.
 *
 * - 주는 월요일 시작 7일.
 * - 시간축은 30분 슬롯 단위.
 */

/** 그리드 시작 시각(시). */
export const GRID_START_HOUR = 9;
/** 그리드 끝 시각(시, 미포함). */
export const GRID_END_HOUR = 22;
/** 슬롯 길이(분). */
export const SLOT_MINUTES = 30;

/** 하루 슬롯 개수. */
export const SLOTS_PER_DAY =
  ((GRID_END_HOUR - GRID_START_HOUR) * 60) / SLOT_MINUTES;

export interface WeekRange {
  /** 월요일 00:00 (LocalDateTime ISO) */
  startDate: string;
  /** 다음 주 월요일 00:00 직전(일요일 23:59:59) */
  endDate: string;
}

/** 기준 일자가 속한 주의 월요일(자정). isoWeek 플러그인 없이 계산한다. */
export function getMonday(base: string | Date): string {
  const d = dayjs(base);
  // dayjs().day(): 0=일 ... 6=토. 월요일까지 되돌릴 일 수.
  const diffToMonday = (d.day() + 6) % 7;
  return d.subtract(diffToMonday, 'day').format('YYYY-MM-DDT00:00:00');
}

/** 기준 일자가 속한 주(월~일)의 범위를 반환한다. */
export function getWeekRange(base: string | Date): WeekRange {
  const monday = dayjs(getMonday(base));
  return {
    startDate: monday.format('YYYY-MM-DDT00:00:00'),
    endDate: monday.add(6, 'day').format('YYYY-MM-DDT23:59:59'),
  };
}

/** 주의 7일(월~일) 일자 배열(ISO 자정). */
export function getWeekDays(weekStart: string): string[] {
  const monday = dayjs(weekStart);
  return Array.from({ length: 7 }, (_, i) =>
    monday.add(i, 'day').format('YYYY-MM-DDT00:00:00'),
  );
}

/** 주를 일정 수만큼 이동한 새 기준 일자(월요일)를 반환한다. */
export function shiftWeek(weekStart: string, weeks: number): string {
  return dayjs(weekStart).add(weeks, 'week').format('YYYY-MM-DDT00:00:00');
}

/** 시간축에 표시할 30분 단위 라벨 목록(예: 09:00, 09:30 ...). */
export function getTimeLabels(): string[] {
  const labels: string[] = [];
  for (let slot = 0; slot < SLOTS_PER_DAY; slot += 1) {
    const minutes = GRID_START_HOUR * 60 + slot * SLOT_MINUTES;
    const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    labels.push(`${hh}:${mm}`);
  }
  return labels;
}

export interface SlotPosition {
  /** 해당 일자의 0-based 요일 인덱스(월=0). 주 범위 밖이면 -1. */
  dayIndex: number;
  /** 시작 슬롯 인덱스(0-based). 그리드 범위 밖이면 음수/초과 가능. */
  slotIndex: number;
  /** 차지하는 슬롯 수(최소 1). */
  slotSpan: number;
}

/**
 * start~end 구간을 주간 그리드 좌표로 변환한다.
 * weekStart 와 다른 주이면 dayIndex 는 0~6 범위를 벗어난다(호출부에서 거른다).
 */
export function getSlotPosition(
  startDate: string,
  endDate: string,
  weekStart: string,
): SlotPosition {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const monday = dayjs(weekStart).startOf('day');

  const dayIndex = start.startOf('day').diff(monday, 'day');

  const startMinutes =
    start.hour() * 60 + start.minute() - GRID_START_HOUR * 60;
  const slotIndex = Math.floor(startMinutes / SLOT_MINUTES);

  const durationMinutes = Math.max(end.diff(start, 'minute'), SLOT_MINUTES);
  // 30분에 딱 안 떨어지는 길이는 올림(그리드에서 잘리지 않도록)
  const slotSpan = Math.max(Math.ceil(durationMinutes / SLOT_MINUTES), 1);

  return { dayIndex, slotIndex, slotSpan };
}

/** 주 라벨(예: 2026.06.01 - 06.07). */
export function formatWeekLabel(weekStart: string): string {
  const monday = dayjs(weekStart);
  const sunday = monday.add(6, 'day');
  return `${monday.format('YYYY.MM.DD')} - ${sunday.format('MM.DD')}`;
}

/** 요일 헤더 라벨(예: 6/1 월). */
export function formatDayHeader(day: string): string {
  return dayjs(day).format('M/D ddd');
}
