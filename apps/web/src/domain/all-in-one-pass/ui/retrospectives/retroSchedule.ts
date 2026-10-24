// 회고 상태/일정은 BE 값(visible/writable/submitted, visibleAt/submissionDeadline) 그대로.
import dayjs from '@/lib/dayjs';
import type { PassRetrospectiveRound } from '../../types';

type Dayjs = ReturnType<typeof dayjs>;

export type RetroStatus = 'UPCOMING' | 'OPEN' | 'DONE' | 'CLOSED';

export interface RetroSchedule {
  openAt: Dayjs | null;
  dueAt: Dayjs | null; // null = 상시(마무리)
}

// 마감 없음 = 상시 = 마무리 회고
export const isWrapUpRound = (round: PassRetrospectiveRound): boolean =>
  round.submissionDeadline === null;

export const getRetroSchedule = (
  round: PassRetrospectiveRound,
): RetroSchedule => ({
  openAt: round.visibleAt ? dayjs(round.visibleAt) : null,
  dueAt: round.submissionDeadline ? dayjs(round.submissionDeadline) : null,
});

export const getRetroStatus = (round: PassRetrospectiveRound): RetroStatus => {
  if (!round.visible) return 'UPCOMING';
  if (round.submitted) return 'DONE';
  if (round.writable) return 'OPEN';
  return 'CLOSED';
};
