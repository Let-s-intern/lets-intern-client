import { addMinutes, format, parseISO } from 'date-fns';

import type { FeedbackSlot } from '@/api/feedback/feedbackSchema';
import type { MentorOpenSlot } from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';

/**
 * 서버 슬롯(`LocalDateTime`)과 일정 그리드 셀(`{ date, time }`) 사이의 변환.
 *
 * 슬롯은 `feedback_slot` 한 벌뿐이고 용도 구분이 없다. 챌린지 라이브 피드백 슬롯과
 * 1대1 멘토링 슬롯은 같은 목록의 일부이므로, 한쪽을 다른 쪽의 점유로 그리지 않는다.
 */

/** 슬롯 길이는 30분 고정(서버 검증 조건). */
const SLOT_MINUTES = 30;

/** 서버가 받는 `LocalDateTime` 문자열. 타임존 표기가 붙으면 안 된다. */
const LOCAL_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ss";

/** `"2026-09-01T10:00:00"` → `{ date: '2026-09-01', time: '10:00' }` */
const toGridCell = (startDate: string): MentorOpenSlot => {
  const start = parseISO(startDate);
  return { date: format(start, 'yyyy-MM-dd'), time: format(start, 'HH:mm') };
};

/** `{ date, time }` → `{ startDate, endDate }`. 종료 시각은 시작 +30분. */
export const toSlotRange = (
  cell: MentorOpenSlot,
): { startDate: string; endDate: string } => {
  const start = parseISO(`${cell.date}T${cell.time}:00`);
  return {
    startDate: format(start, LOCAL_DATE_TIME),
    endDate: format(addMinutes(start, SLOT_MINUTES), LOCAL_DATE_TIME),
  };
};

/**
 * 그리드에 미리 선택된 상태로 올릴 슬롯 — `OPEN` 만.
 * `RESERVED` 는 선택이 아니라 잠금으로 그려지므로 여기 넣지 않는다.
 */
export const toGridSlots = (slots: FeedbackSlot[]): MentorOpenSlot[] =>
  slots
    .filter((slot) => slot.status === 'OPEN')
    .map((slot) => toGridCell(slot.startDate));

/** 예약된 슬롯 — 회색 "예약 완료" 셀로 그려지고 클릭이 막힌다. */
export const toReservedSlots = (slots: FeedbackSlot[]): MentorOpenSlot[] =>
  slots
    .filter((slot) => slot.status === 'RESERVED')
    .map((slot) => toGridCell(slot.startDate));
