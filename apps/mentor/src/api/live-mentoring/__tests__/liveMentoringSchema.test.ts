/**
 * 1대1 라이브 멘토링 멘토 스키마 계약 단언.
 *
 * 기준은 서버 `origin/dev` `cd2a7bd9` 의 DTO 다. 목이 아니라 실제 응답 형태를 고정한다.
 */
import { describe, expect, it } from 'vitest';

import {
  liveMentoringCloseReasonSchema,
  liveMentoringOpeningStatusSchema,
  liveMentoringStatusSchema,
} from '../liveMentoringSchema';

describe('liveMentoringStatusSchema', () => {
  it.each(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'INACTIVE'])(
    '%s 를 파싱한다',
    (value) => {
      expect(liveMentoringStatusSchema.parse(value)).toBe(value);
    },
  );

  it('enum 밖의 값은 파싱 실패', () => {
    expect(() => liveMentoringStatusSchema.parse('OPEN')).toThrow();
  });

  it('소문자는 파싱 실패', () => {
    expect(() => liveMentoringStatusSchema.parse('draft')).toThrow();
  });
});

describe('liveMentoringOpeningStatusSchema', () => {
  it.each(['OPEN', 'CLOSED'])('%s 를 파싱한다', (value) => {
    expect(liveMentoringOpeningStatusSchema.parse(value)).toBe(value);
  });

  it('상품 상태 값(DRAFT)은 개설 상태로 파싱되지 않는다', () => {
    expect(() => liveMentoringOpeningStatusSchema.parse('DRAFT')).toThrow();
  });

  it('과거 목에 있던 PAUSED 는 파싱 실패', () => {
    expect(() => liveMentoringOpeningStatusSchema.parse('PAUSED')).toThrow();
  });
});

describe('liveMentoringCloseReasonSchema', () => {
  it.each(['PERIOD_EXPIRED', 'ADMIN_FORCED'])('%s 를 파싱한다', (value) => {
    expect(liveMentoringCloseReasonSchema.parse(value)).toBe(value);
  });

  it('멘토 자가 종료 사유는 서버에 없으므로 파싱 실패', () => {
    expect(() =>
      liveMentoringCloseReasonSchema.parse('MENTOR_CLOSED'),
    ).toThrow();
  });
});
