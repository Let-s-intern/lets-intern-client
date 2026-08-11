import {
  LIVE_MENTORING_SETTINGS,
  LIVE_MENTORING_TEMPLATE,
  OPENING_HISTORY,
} from '@letscareer/mocks';
import { describe, expect, it } from 'vitest';

import {
  liveMentoringSettingsSchema,
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
});
