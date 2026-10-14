// 캘린더 공용 헬퍼 — 상수·날짜/요일·우선순위·상태 파생·색상
import dayjs from '@/lib/dayjs';
import type {
  NormalizedCalendarEvent,
  PassCalendarEvent,
  PassParticipationStatus,
} from '../../../types';

export type Day = ReturnType<typeof dayjs>;

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
/** 한 칸 최대 행(막대·당일 포함). 7개 이하면 전부, 초과하면 6개 + 배지(+N) */
export const MAX_ROWS = 7;
/** 오버플로 시 표시할 아이템 수. 나머지는 마지막 행에 +N 배지 */
export const VISIBLE_ITEMS = 6;
export const NUM_H = 62; // 날짜 숫자 영역 높이
/** 막대 영역 고정 높이(7행 = 7*18 + 6*6 간격). 막대 수와 무관하게 항상 확보 */
export const BAR_AREA_H = 162;
/** 날짜 타일 전체 높이 = 숫자 영역 + 막대 영역 */
export const CELL_HEIGHT = 248;

/** 모바일 월간: 한 칸 최대 4행(3개 + 배지). 초과 시 3개 + +N */
export const MONTH_MAX_ROWS = 4;
export const MONTH_VISIBLE_ITEMS = 3;

export const FILTER_LABEL: Record<PassParticipationStatus, string> = {
  BEFORE: '참여 전',
  IN_PROGRESS: '참여 중',
  DONE: '참여 완료',
};

/**
 * 챌린지 참여 상태 파생(FE). BE는 challengeApplicationId(팩트)만 주고, 중/완료는 시점 의존이라
 * 여기서 계산한다.
 * - challengeApplicationId == null → BEFORE(참여 전)
 * - 오늘이 종료일(일 단위)을 지남 → DONE(참여 완료)
 * - 그 외 → IN_PROGRESS(참여 중)
 */
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

/** 이벤트 목록 정규화 — 챌린지 status를 파생값으로 채움(게릴라세션·마일스톤은 그대로) */
export const normalizeEvents = (
  events: PassCalendarEvent[],
  today: Day,
): NormalizedCalendarEvent[] =>
  events.map((e) => ({
    ...e,
    status: e.type === 'CHALLENGE' ? challengeStatus(e, today) : null,
  }));

export const eventStart = (e: PassCalendarEvent) =>
  dayjs(e.startDate).startOf('day');
export const eventEnd = (e: PassCalendarEvent) =>
  dayjs(e.endDate ?? e.startDate).startOf('day');

/** 월요일 시작 주의 첫날 */
export const weekStartOf = (d: Day) =>
  d.subtract((d.day() + 6) % 7, 'day').startOf('day');
/** 요일 → grid column (월=1 … 일=7) */
export const colOf = (d: Day) => ((d.day() + 6) % 7) + 1;

/**
 * 노출 우선순위: 참여중 챌린지 > 게릴라세션 > 마일스톤/기타 > 참여가능 챌린지 > 참여이력 챌린지.
 * 동일 순위면 진행기간 짧은 순 → 시작 빠른 순.
 */
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

/** 여러 날 걸치는 일정(막대). 같은 날에 끝나면 당일 일정(칩) */
export const isBarEvent = (e: PassCalendarEvent) =>
  eventEnd(e).isAfter(eventStart(e));

/** 일정이 해당 날짜에 걸치는지 */
export const overlapsDay = (e: PassCalendarEvent, d: Day) =>
  !eventStart(e).isAfter(d) && !eventEnd(e).isBefore(d);

/** 노출 우선순위 정렬: priority → 진행기간 짧은 순 → 시작 빠른 순 */
export const compareEvents = (
  a: NormalizedCalendarEvent,
  b: NormalizedCalendarEvent,
) =>
  priority(a) - priority(b) ||
  durationMs(a) - durationMs(b) ||
  eventStart(a).valueOf() - eventStart(b).valueOf();

/**
 * 일정별 색상 (디자인 지정 hex).
 * - 참여중 챌린지 E3E5FB / 참여가능 챌린지 EFEFEF
 * - 게릴라세션 / 유형1 / 유형2
 */
export const CALENDAR_COLORS = {
  challengeInProgress: '#E3E5FB',
  challengeBefore: '#EFEFEF',
  guerrilla: '#DAFF7C',
  type1: '#BBEDD8',
  type2: '#E0BAF7',
} as const;

/** 일정 → 배경색 */
export const eventColor = (event: NormalizedCalendarEvent): string => {
  if (event.type === 'CHALLENGE') {
    return event.status === 'IN_PROGRESS'
      ? CALENDAR_COLORS.challengeInProgress
      : CALENDAR_COLORS.challengeBefore;
  }
  if (event.type === 'GUERRILLA') return CALENDAR_COLORS.guerrilla;
  // MILESTONE 등 — 유형1 기본
  return CALENDAR_COLORS.type1;
};
