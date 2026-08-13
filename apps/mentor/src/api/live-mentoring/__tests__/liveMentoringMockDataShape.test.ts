import {
  LIVE_MENTORING_SETTINGS,
  LIVE_MENTORING_SLOTS_BY_MENTOR,
  LIVE_MENTORING_TEMPLATE,
  OPENING_HISTORY,
} from '@letscareer/mocks';
import { describe, expect, it } from 'vitest';

import {
  liveMentoringSettingsSchema,
  liveMentoringSlotSchema,
  liveMentoringTemplateSchema,
  openingHistoryItemSchema,
} from '../liveMentoringSchema';

/**
 * 공유 목 데이터(`@letscareer/mocks`)가 자가승인 계약(`DRAFT`/`APPROVED`/`INACTIVE`)으로
 * 정리된 뒤에도 프론트 zod 스키마를 그대로 통과하는지 확인한다.
 * `PENDING_REVIEW`/`REJECTED`가 목 데이터에 남아 있으면 여기서 즉시 실패해야 한다.
 */
describe('공유 목 데이터 형상 — 프론트 zod 스키마 정합', () => {
  it('LIVE_MENTORING_SETTINGS 가 liveMentoringSettingsSchema 를 통과한다', () => {
    const parsed = liveMentoringSettingsSchema.parse(LIVE_MENTORING_SETTINGS);
    expect(parsed.status).toBe('DRAFT');
  });

  it('LIVE_MENTORING_TEMPLATE 이 liveMentoringTemplateSchema 를 통과한다', () => {
    expect(() =>
      liveMentoringTemplateSchema.parse(LIVE_MENTORING_TEMPLATE),
    ).not.toThrow();
  });

  it('OPENING_HISTORY 의 각 항목이 openingHistoryItemSchema 를 통과한다', () => {
    expect(OPENING_HISTORY.length).toBeGreaterThan(0);
    for (const opening of OPENING_HISTORY) {
      expect(() => openingHistoryItemSchema.parse(opening)).not.toThrow();
    }
  });

  it('슬롯 시드가 liveMentoringSlotSchema 를 통과한다', () => {
    const slotLists = Object.values(LIVE_MENTORING_SLOTS_BY_MENTOR);
    expect(slotLists.length).toBeGreaterThan(0);
    for (const slots of slotLists) {
      for (const slot of slots) {
        expect(() => liveMentoringSlotSchema.parse(slot)).not.toThrow();
      }
    }
  });

  it('슬롯 시드는 30분 길이이고 OPEN·RESERVED·과거 케이스를 모두 담는다', () => {
    const slots = LIVE_MENTORING_SLOTS_BY_MENTOR[1];
    const now = new Date().toISOString().slice(0, 19);

    for (const slot of slots) {
      const minutes =
        (new Date(slot.endDate).getTime() -
          new Date(slot.startDate).getTime()) /
        60000;
      expect(minutes).toBe(30);
    }
    // 잠금(409) 케이스를 재현하려면 예약된 슬롯이 섞여 있어야 한다.
    expect(slots.some((slot) => slot.status === 'RESERVED')).toBe(true);
    expect(slots.some((slot) => slot.status === 'OPEN')).toBe(true);
    // 공개 조회가 "미래만" 필터링하는지 확인할 과거 슬롯도 있어야 한다.
    expect(slots.some((slot) => slot.startDate < now)).toBe(true);
    expect(slots.some((slot) => slot.startDate > now)).toBe(true);
  });

  it('슬롯 id 는 멘토별로 겹치지 않는다', () => {
    const ids = Object.values(LIVE_MENTORING_SLOTS_BY_MENTOR)
      .flat()
      .map((slot) => slot.slotId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
