import { format, parseISO } from 'date-fns';

import type { FeedbackSlot } from '@/api/feedback/feedbackSchema';
import type { MentorOpenSlot } from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';

/** 30분 단위 슬롯 길이 (ms) — BE/FE 공통 약속 */
const SLOT_DURATION_MS = 30 * 60 * 1000;

/** BE FeedbackSlot 을 그리드의 {date, time} 키 + 메타 정보로 변환 */
export interface BeSlotCell {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:mm" — 슬롯 시작 시각 */
  time: string;
  feedbackSlotId: number;
  /** OPEN / RESERVED — RESERVED 는 잠금 표시 */
  status: FeedbackSlot['status'];
}

/**
 * BE의 ISO `startDate` 를 그리드 키 `{date, time}` 으로 분해한다.
 * BE는 LocalDateTime 을 보내므로 timezone 영향 없이 parseISO 결과를 그대로 사용.
 */
export function toBeSlotCell(slot: FeedbackSlot): BeSlotCell {
  const start = parseISO(slot.startDate);
  return {
    date: format(start, 'yyyy-MM-dd'),
    time: format(start, 'HH:mm'),
    feedbackSlotId: slot.feedbackSlotId,
    status: slot.status,
  };
}

/** BE 슬롯 배열을 그리드용 cell 배열로 변환 */
export function toBeSlotCells(slots: FeedbackSlot[]): BeSlotCell[] {
  return slots.map(toBeSlotCell);
}

/**
 * 그리드 `{date, time}` 키를 BE POST body 의 `{startDate, endDate}` 페어로 변환.
 * 슬롯 길이는 30분 고정.
 */
export function toCreateSlotRequest(cell: MentorOpenSlot): {
  startDate: string;
  endDate: string;
} {
  // 'YYYY-MM-DDTHH:mm:00' 형태 ISO LocalDateTime (timezone 없음, BE LocalDateTime 호환)
  const startDate = `${cell.date}T${cell.time}:00`;
  const start = new Date(`${startDate}`);
  const end = new Date(start.getTime() + SLOT_DURATION_MS);
  const endDate = format(end, "yyyy-MM-dd'T'HH:mm:ss");
  return { startDate, endDate };
}

/**
 * 그리드 변경 사항을 BE API 호출용 creates / deletes 로 분류한다.
 *
 * - 사용자가 새로 선택한 셀(이전 BE 슬롯에 없음) → creates
 * - 사용자가 해제한 셀(이전 BE 슬롯에 있던 OPEN 셀) → deletes (feedbackSlotId)
 * - RESERVED 슬롯은 멘토가 변경할 수 없으므로 어떤 경우에도 deletes 에 포함되지 않는다.
 */
export function diffGridAgainstBeSlots(args: {
  /** 사용자가 저장 버튼을 누른 시점의 그리드 선택 (date|time) */
  selected: MentorOpenSlot[];
  /** GET 응답으로 받아온 BE 슬롯 전체 (OPEN + RESERVED) */
  beSlots: FeedbackSlot[];
}): {
  creates: Array<{ startDate: string; endDate: string }>;
  deletes: number[];
} {
  const { selected, beSlots } = args;

  const beCells = toBeSlotCells(beSlots);
  const beKeyToSlot = new Map<string, BeSlotCell>();
  for (const c of beCells) beKeyToSlot.set(`${c.date}|${c.time}`, c);

  const selectedKeys = new Set(selected.map((s) => `${s.date}|${s.time}`));

  // creates: selected 에는 있지만 BE 에 없는 셀
  const creates: Array<{ startDate: string; endDate: string }> = [];
  for (const cell of selected) {
    if (!beKeyToSlot.has(`${cell.date}|${cell.time}`)) {
      creates.push(toCreateSlotRequest(cell));
    }
  }

  // deletes: BE OPEN 슬롯 중 selected 에 없는 것만 삭제 (RESERVED 는 보존)
  const deletes: number[] = [];
  for (const beCell of beCells) {
    if (beCell.status !== 'OPEN') continue;
    if (!selectedKeys.has(`${beCell.date}|${beCell.time}`)) {
      deletes.push(beCell.feedbackSlotId);
    }
  }

  return { creates, deletes };
}
