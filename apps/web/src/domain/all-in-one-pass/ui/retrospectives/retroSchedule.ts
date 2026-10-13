// 회고 노출/작성기간/상태 파생. 날짜는 저장 안 하고 회차 visiblePeriod·period config + 패스 시작일로 계산.
import dayjs from '@/lib/dayjs';
import type {
  PassQuestionPeriodType,
  PassRetrospectiveRound,
} from '../../types';

type Dayjs = ReturnType<typeof dayjs>;

export type RetroStatus = 'UPCOMING' | 'OPEN' | 'DONE' | 'CLOSED';

export interface RetroSchedule {
  openAt: Dayjs;
  dueAt: Dayjs | null; // periodType === 'INFINITY'(마무리 상시) → null
}

const UNIT: Record<
  Exclude<PassQuestionPeriodType, 'INFINITY'>,
  'year' | 'month' | 'week' | 'day'
> = { YEAR: 'year', MONTH: 'month', WEEK: 'week', DAY: 'day' };

// type+value → base에서 더한 Dayjs. INFINITY면 더할 기간이 없으므로 base 그대로.
const addPeriod = (
  base: Dayjs,
  type: PassQuestionPeriodType,
  value: number,
): Dayjs => (type === 'INFINITY' ? base : base.add(value, UNIT[type]));

/** periodType === 'INFINITY' = 마감 없는 상시 회고(= 마무리). */
export const isWrapUpRound = (round: PassRetrospectiveRound): boolean =>
  round.periodType === 'INFINITY';

/** 노출 = 시작 + visiblePeriod, 마감 = 노출 + period 후 23:59 (INFINITY면 마감 없음). */
export const getRetroSchedule = (
  round: PassRetrospectiveRound,
  passStart: string,
): RetroSchedule => {
  const openAt = addPeriod(
    dayjs(passStart).startOf('day'),
    round.visiblePeriodType,
    round.visiblePeriodValue,
  );
  const dueAt =
    round.periodType === 'INFINITY'
      ? null
      : addPeriod(openAt, round.periodType, round.periodValue)
          .hour(23)
          .minute(59)
          .second(0);
  return { openAt, dueAt };
};

export const getRetroStatus = (
  schedule: RetroSchedule,
  isSubmitted: boolean,
  now: Dayjs,
): RetroStatus => {
  if (isSubmitted) return 'DONE';
  if (now.isBefore(schedule.openAt)) return 'UPCOMING';
  if (!schedule.dueAt || !now.isAfter(schedule.dueAt)) return 'OPEN';
  return 'CLOSED';
};

/** 작성 가능 기간 내인지(노출~마감). 제출 여부와 무관 — 챌린지 미션처럼 마감 전까지 수정 가능. */
export const isRetroWritable = (
  schedule: RetroSchedule,
  now: Dayjs,
): boolean => {
  if (now.isBefore(schedule.openAt)) return false;
  if (!schedule.dueAt) return true; // 마무리 회고 상시
  return !now.isAfter(schedule.dueAt);
};
