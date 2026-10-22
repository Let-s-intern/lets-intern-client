// 캘린더 공용 헬퍼 — 상수·날짜/요일·우선순위·상태 파생·색상
import dayjs from '@/lib/dayjs';
import type {
  NormalizedCalendarEvent,
  PassCalendarEvent,
  PassParticipationStatus,
} from '../../../types';

export type Day = ReturnType<typeof dayjs>;

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
/** 한 칸 최대 행(막대·당일 포함). 6개 이하면 전부, 7개↑면 6개 + 배지(+N) */
export const MAX_ROWS = 7;
export const VISIBLE_ITEMS = 6;
export const NUM_H = 62; // 날짜 숫자 영역 높이
export const BAR_AREA_H = 162;
export const CELL_HEIGHT = 248;

/** 모바일 월간: 한 칸 최대 4행(3개 + 배지). 초과 시 3개 + +N */
export const MONTH_MAX_ROWS = 4;
export const MONTH_VISIBLE_ITEMS = 3;

export const FILTER_LABEL: Record<PassParticipationStatus, string> = {
  BEFORE: '참여 전',
  IN_PROGRESS: '참여 중',
  DONE: '참여 완료',
};

const challengeStatus = (
  e: PassCalendarEvent,
  today: Day,
): PassParticipationStatus => {
  if (e.challengeApplicationId == null) return 'BEFORE';
  if (today.isAfter(dayjs(e.endDate ?? e.startDate).startOf('day'))) {
    return 'DONE';
  }
  return 'IN_PROGRESS';
};

export const normalizeEvents = (
  events: PassCalendarEvent[],
  today: Day,
): NormalizedCalendarEvent[] =>
  events.map((e) => ({
    ...e,
    status:
      e.type === 'CHALLENGE'
        ? (e.participationStatus ?? challengeStatus(e, today))
        : null,
  }));

export const eventStart = (e: PassCalendarEvent) =>
  dayjs(e.startDate).startOf('day');
export const eventEnd = (e: PassCalendarEvent) =>
  dayjs(e.endDate ?? e.startDate).startOf('day');

export const weekStartOf = (d: Day) =>
  d.subtract((d.day() + 6) % 7, 'day').startOf('day');
export const colOf = (d: Day) => ((d.day() + 6) % 7) + 1;

// 노출 우선순위: 참여중 챌린지 > 게릴라세션 > 마일스톤/기타 > 참여가능 챌린지 > 참여이력 챌린지.
const priority = (e: NormalizedCalendarEvent): number => {
  if (e.type === 'CHALLENGE') {
    if (e.status === 'IN_PROGRESS') return 0;
    if (e.status === 'BEFORE') return 3; // 참여가능
    return 4; // 참여완료(DONE)
  }
  if (e.type === 'GUERRILLA') return 1;
  return 2; // MILESTONE 등 기타 유형
};
const durationMs = (e: PassCalendarEvent) =>
  eventEnd(e).valueOf() - eventStart(e).valueOf();

export const isBarEvent = (e: PassCalendarEvent) =>
  eventEnd(e).isAfter(eventStart(e));

export const overlapsDay = (e: PassCalendarEvent, d: Day) =>
  !eventStart(e).isAfter(d) && !eventEnd(e).isBefore(d);

export const compareEvents = (
  a: NormalizedCalendarEvent,
  b: NormalizedCalendarEvent,
) =>
  priority(a) - priority(b) ||
  durationMs(a) - durationMs(b) ||
  eventStart(a).valueOf() - eventStart(b).valueOf();

export const CALENDAR_COLORS = {
  challengeInProgress: '#E3E5FB',
  challengeBefore: '#EFEFEF',
  guerrilla: '#DAFF7C',
  type1: '#BBEDD8',
  type2: '#E0BAF7',
} as const;

export const eventColor = (event: NormalizedCalendarEvent): string => {
  if (event.type === 'CHALLENGE') {
    return event.status === 'IN_PROGRESS'
      ? CALENDAR_COLORS.challengeInProgress
      : CALENDAR_COLORS.challengeBefore;
  }
  if (event.type === 'GUERRILLA') return CALENDAR_COLORS.guerrilla;
  return CALENDAR_COLORS.type1;
};
