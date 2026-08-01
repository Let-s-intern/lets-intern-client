/**
 * 1대1 라이브 멘토링 멘토 스키마 계약 단언.
 *
 * 기준은 서버 `origin/dev` `cd2a7bd9` 의 DTO 다. 목이 아니라 실제 응답 형태를 고정한다.
 */
import { describe, expect, it } from 'vitest';

import {
  liveMentoringCloseReasonSchema,
  liveMentoringOpeningStatusSchema,
  liveMentoringSettingsSchema,
  liveMentoringSettingsUpdateSchema,
  liveMentoringStatusSchema,
} from '../liveMentoringSchema';

/** 서버 `GetLiveMentoringSettingsResponseDto` 그대로의 응답. */
function makeSettings(overrides: Record<string, unknown> = {}) {
  return {
    liveMentoringId: 12,
    nickname: '자소서장인',
    profileImage: null,
    introduction: '소개',
    careers: [
      {
        id: 1,
        company: '네이버',
        field: '기획',
        job: '기획',
        position: '기획',
        department: null,
        employmentType: '정규직',
        startDate: '2019-01',
        endDate: null,
        isAddedByAdmin: false,
        isRepresentative: true,
      },
    ],
    title: '자소서 실전 첨삭 멘토링',
    status: 'DRAFT',
    categories: ['PERSONAL_STATEMENT'],
    ...overrides,
  };
}

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

describe('liveMentoringSettingsSchema', () => {
  it('상품 정보만 담긴 응답을 파싱한다', () => {
    const parsed = liveMentoringSettingsSchema.parse(makeSettings());
    expect(parsed.liveMentoringId).toBe(12);
    expect(parsed.status).toBe('DRAFT');
    expect(parsed.categories).toEqual(['PERSONAL_STATEMENT']);
  });

  it('상품 미저장 상태(liveMentoringId·title null, categories 빈 배열)를 파싱한다', () => {
    const parsed = liveMentoringSettingsSchema.parse(
      makeSettings({ liveMentoringId: null, title: null, categories: [] }),
    );
    expect(parsed.liveMentoringId).toBeNull();
    expect(parsed.title).toBeNull();
  });

  it('구필드(isOpen·durations·기간)가 섞여 와도 파싱되고 결과에서 버려진다', () => {
    const parsed = liveMentoringSettingsSchema.parse(
      makeSettings({
        isOpen: true,
        durations: [30, 60],
        feedbackStartDate: '2026-07-14',
        feedbackEndDate: '2026-07-28',
      }),
    );
    expect(parsed).not.toHaveProperty('isOpen');
    expect(parsed).not.toHaveProperty('durations');
    expect(parsed).not.toHaveProperty('feedbackStartDate');
    expect(parsed).not.toHaveProperty('feedbackEndDate');
  });

  it.each(['liveMentoringId', 'status'])(
    '신필드 %s 가 없으면 파싱 실패',
    (key) => {
      const settings = makeSettings();
      delete (settings as Record<string, unknown>)[key];
      expect(() => liveMentoringSettingsSchema.parse(settings)).toThrow();
    },
  );

  it('status 가 enum 밖이면 파싱 실패', () => {
    expect(() =>
      liveMentoringSettingsSchema.parse(makeSettings({ status: 'OPEN' })),
    ).toThrow();
  });

  it('careers 11필드는 그대로 유지된다', () => {
    const parsed = liveMentoringSettingsSchema.parse(makeSettings());
    expect(Object.keys(parsed.careers[0]).sort()).toEqual(
      [
        'company',
        'department',
        'employmentType',
        'endDate',
        'field',
        'id',
        'isAddedByAdmin',
        'isRepresentative',
        'job',
        'position',
        'startDate',
      ].sort(),
    );
  });
});

describe('liveMentoringSettingsUpdateSchema', () => {
  it('{title, categories} 2개만 남기고 나머지는 버린다', () => {
    const parsed = liveMentoringSettingsUpdateSchema.parse({
      title: '자소서 실전 첨삭 멘토링',
      categories: ['RESUME'],
      isOpen: true,
      durations: [60],
      feedbackStartDate: '2026-07-14',
      feedbackEndDate: '2026-07-28',
    });
    expect(Object.keys(parsed).sort()).toEqual(['categories', 'title']);
  });

  it('title 이 없으면 파싱 실패', () => {
    expect(() =>
      liveMentoringSettingsUpdateSchema.parse({ categories: ['RESUME'] }),
    ).toThrow();
  });
});
