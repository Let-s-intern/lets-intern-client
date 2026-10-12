import type { NormalizedCalendarEvent } from '../../../types';

/**
 * 일정별 색상 (디자인 지정 hex).
 * - 참여중 챌린지: 색상 구분 없이 E3E5FB
 * - 참여가능 챌린지(참여 중 X): 색상 구분 없이 회색(EFEFEF)
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
  // MILESTONE 등 어드민 등록 일정 — 유형1 기본 (유형2는 유형 구분 도입 시)
  return CALENDAR_COLORS.type1;
};
