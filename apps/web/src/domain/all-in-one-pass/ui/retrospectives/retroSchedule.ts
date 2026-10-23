// 회고 상태/일정 파생. 상태는 BE가 내려준 visible/writable/submitted를,
// 일정은 visibleAt/submissionDeadline을 그대로 쓴다(FE 날짜 계산 없음).
import dayjs from '@/lib/dayjs';
import type { PassRetrospectiveRound } from '../../types';

type Dayjs = ReturnType<typeof dayjs>;

export type RetroStatus = 'UPCOMING' | 'OPEN' | 'DONE' | 'CLOSED';

export interface RetroSchedule {
  openAt: Dayjs | null;
  dueAt: Dayjs | null; // null = 상시(마무리)
}

/** submissionDeadline 없음 = 마감 없는 상시 회고(= 마무리). */
export const isWrapUpRound = (round: PassRetrospectiveRound): boolean =>
  round.submissionDeadline === null;

export const getRetroSchedule = (
  round: PassRetrospectiveRound,
): RetroSchedule => ({
  openAt: round.visibleAt ? dayjs(round.visibleAt) : null,
  dueAt: round.submissionDeadline ? dayjs(round.submissionDeadline) : null,
});

/** BE 상태 플래그로 회차 상태 파생. */
export const getRetroStatus = (round: PassRetrospectiveRound): RetroStatus => {
  if (!round.visible) return 'UPCOMING';
  if (round.submitted) return 'DONE';
  if (round.writable) return 'OPEN';
  return 'CLOSED';
};
