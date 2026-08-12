import { addMinutes, format, parseISO } from 'date-fns';

import type { FeedbackSlot } from '@/api/feedback/feedbackSchema';
import type {
  LiveMentoringSlot,
  LiveMentoringSlotSaveRequest,
} from '@/api/live-mentoring/liveMentoringSchema';
import type { BlockedSlot } from '@/pages/schedule/live-availability/LiveAvailabilityContent';
import type { MentorOpenSlot } from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';

/**
 * 서버 슬롯(`LocalDateTime`)과 일정 그리드 셀(`{ date, time }`) 사이의 변환.
 *
 * 챌린지 라이브 피드백 슬롯과 1대1 멘토링 슬롯은 같은 `feedback_slot` 테이블을 쓰고
 * `UNIQUE(mentor_user_id, start_date)` 가 걸려 있다. 그래서 그리드는 두 종류를 함께
 * 그리지만, `PUT /slots` payload 에는 **1대1 슬롯만** 담아야 한다.
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
export const toGridSlots = (slots: LiveMentoringSlot[]): MentorOpenSlot[] =>
  slots
    .filter((slot) => slot.status === 'OPEN')
    .map((slot) => toGridCell(slot.startDate));

/** 예약된 슬롯 — 회색 "예약 완료" 셀로 그려지고 클릭이 막힌다. */
export const toReservedSlots = (slots: LiveMentoringSlot[]): MentorOpenSlot[] =>
  slots
    .filter((slot) => slot.status === 'RESERVED')
    .map((slot) => toGridCell(slot.startDate));

/**
 * 챌린지 라이브 피드백 슬롯 → 점유 셀.
 *
 * 유니크 제약 때문에 같은 시각을 1대1 로 다시 열 수 없다. 그리드가 이걸 감추면
 * 멘토는 저장 순간에야 원인 불명의 409 를 만난다.
 *
 * `menteeName` 은 넣지 않는다 — 이 API 는 멘티 정보를 주지 않고, 넣으면 그리드가
 * "신청 완료" 로 그린다. 예약 여부와 무관하게 1대1 로는 못 여는 시각이라 구분이 필요 없다.
 */
export const toBlockedSlots = (slots: FeedbackSlot[]): BlockedSlot[] =>
  slots.map((slot) => ({
    ...toGridCell(slot.startDate),
    challengeTitle: '라이브 피드백',
  }));

/**
 * `PUT /slots` payload — 전체 치환이라 **남길 슬롯을 전부** 담아야 한다.
 *
 * 예약된 슬롯은 사용자가 건드리지 않았어도 반드시 포함한다. 빠지면 서버가 삭제 대상으로
 * 보고 409 `LIVE_MENTORING_SLOT_LOCKED` 로 저장 전체를 되돌린다.
 *
 * 챌린지 슬롯은 담지 않는다 — 1대1 슬롯 목록이 아니고, 담으면 유니크 위반으로 409 다.
 * 그리드가 예약 셀을 선택 불가로 그리지만, 같은 시각이 양쪽에 겹쳐 들어오면 그것 자체가
 * 409 `LIVE_MENTORING_SLOT_CONFLICT` 이므로 시작 시각 기준으로 한 번 더 걸러낸다.
 */
export const toSlotSaveRequest = (args: {
  /** 그리드에서 선택된 셀 */
  selected: MentorOpenSlot[];
  /** 서버가 내려준 현재 슬롯 전체(OPEN + RESERVED) */
  serverSlots: LiveMentoringSlot[];
}): LiveMentoringSlotSaveRequest => {
  const { selected, serverSlots } = args;

  const reserved = serverSlots
    .filter((slot) => slot.status === 'RESERVED')
    .map(({ startDate, endDate }) => ({ startDate, endDate }));

  const byStartDate = new Map(reserved.map((slot) => [slot.startDate, slot]));
  for (const cell of selected) {
    const range = toSlotRange(cell);
    if (!byStartDate.has(range.startDate)) {
      byStartDate.set(range.startDate, range);
    }
  }

  return [...byStartDate.values()].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );
};
