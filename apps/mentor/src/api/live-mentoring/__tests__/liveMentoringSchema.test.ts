/**
 * 1대1 라이브 멘토링 멘토 스키마 계약 단언.
 *
 * 기준은 서버 `origin/dev` `cd2a7bd9` 의 DTO 다. 목이 아니라 실제 응답 형태를 고정한다.
 */
import { describe, expect, it } from 'vitest';

import {
  createOpeningRequestSchema,
  liveMentoringCloseReasonSchema,
  liveMentoringOpeningStatusSchema,
  liveMentoringSettingsSchema,
  liveMentoringSettingsUpdateSchema,
  liveMentoringStatusSchema,
  liveMentoringTemplateSchema,
  openingHistoryResponseSchema,
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

/** 서버 `GetLiveMentoringDetailPageResponseDto` 그대로의 응답. */
function makeTemplate(overrides: Record<string, unknown> = {}) {
  return {
    mentoring: {
      liveMentoringId: 12,
      title: '자소서 실전 첨삭 멘토링',
      status: 'DRAFT',
      editable: true,
      category: 'RESUME',
    },
    currentOpening: null,
    category: 'RESUME',
    hero: { bullets: ['이력서 피드백 및 첨삭'] },
    intro: {
      passedCount: 120,
      profileImage: null,
      affiliation: '카카오 | 백엔드',
      careerLines: ['카카오 | 백엔드'],
      oneLiner: '소개',
    },
    mentoringTypes: {
      title: '이런 도움을 받을 수 있어요',
      subtitle: '고민에 맞는 유형을 골라보세요.',
      items: [
        {
          typeName: '이력서 피드백',
          title: '이력서를 정리하고 싶다면',
          description: '경험과 역량이 잘 보이도록 점검해요.',
          tags: ['경험 정리'],
        },
      ],
    },
    strategy: {
      visible: true,
      title: '취업 성공 전략',
      subtitle: '알려드립니다.',
      points: [{ image: null, title: '핵심 키워드', description: '설명' }],
    },
    video: {
      visible: true,
      title: '이렇게 도와드려요',
      subtitle: '미리 확인하세요',
      videoUrl: 'https://www.youtube.com/embed/xyz',
      caption: '완성도 UP!',
    },
    results: {
      visible: true,
      title: '함께 완성해요',
      subtitle: '결과 사례',
      cases: [
        {
          beforeImage: null,
          afterImage: null,
          beforeCaption: '전',
          afterCaption: '후',
        },
      ],
    },
    reviews: { visible: true, selectedReviewIds: [1] },
    ...overrides,
  };
}

describe('liveMentoringTemplateSchema', () => {
  it('개설이 없는 응답(currentOpening: null)을 파싱한다', () => {
    const parsed = liveMentoringTemplateSchema.parse(makeTemplate());
    expect(parsed.currentOpening).toBeNull();
    expect(parsed.mentoring.editable).toBe(true);
    expect(parsed.mentoring.status).toBe('DRAFT');
  });

  it('활성 개설이 있는 응답을 파싱한다', () => {
    const parsed = liveMentoringTemplateSchema.parse(
      makeTemplate({
        mentoring: {
          liveMentoringId: 12,
          title: '자소서 실전 첨삭 멘토링',
          status: 'APPROVED',
          editable: false,
          category: 'RESUME',
        },
        currentOpening: {
          openingId: 77,
          status: 'OPEN',
          durationPrices: [
            { duration: 30, price: 35000 },
            { duration: 60, price: 60000 },
          ],
          feedbackStartDate: '2026-08-01',
          feedbackEndDate: '2026-08-14',
        },
      }),
    );
    expect(parsed.currentOpening?.openingId).toBe(77);
    expect(parsed.currentOpening?.durationPrices).toHaveLength(2);
    expect(parsed.mentoring.editable).toBe(false);
  });

  it('서버가 함께 내려주는 잉여 필드가 있어도 파싱되고 결과에서 버려진다', () => {
    const parsed = liveMentoringTemplateSchema.parse(
      makeTemplate({
        faq: [],
        process: [],
        reviewItems: [],
        intro: {
          passedCount: null,
          nickname: '자소서장인',
          profileImage: null,
          affiliation: '',
          careerLines: [],
          careers: [{ id: 1, company: '네이버' }],
          oneLiner: '소개',
        },
      }),
    );
    expect(parsed).not.toHaveProperty('faq');
    expect(parsed).not.toHaveProperty('process');
    expect(parsed).not.toHaveProperty('reviewItems');
    expect(parsed.intro).not.toHaveProperty('nickname');
    expect(parsed.intro).not.toHaveProperty('careers');
  });

  it('mentoring 블록이 없으면 파싱 실패', () => {
    const template = makeTemplate();
    delete (template as Record<string, unknown>).mentoring;
    expect(() => liveMentoringTemplateSchema.parse(template)).toThrow();
  });

  it('currentOpening 키 자체가 없으면 파싱 실패 (null 과 구분한다)', () => {
    const template = makeTemplate();
    delete (template as Record<string, unknown>).currentOpening;
    expect(() => liveMentoringTemplateSchema.parse(template)).toThrow();
  });
});

/** 서버 `GetLiveMentoringOpeningHistoryResponseDto.OpeningHistoryItemResponse` 그대로. */
function makeOpening(overrides: Record<string, unknown> = {}) {
  return {
    openingId: 77,
    status: 'OPEN',
    durationPrices: [
      { duration: 30, price: 35000 },
      { duration: 60, price: 60000 },
    ],
    feedbackStartDate: '2026-08-01',
    feedbackEndDate: '2026-08-14',
    openedAt: '2026-08-01T09:00:00',
    closedAt: null,
    closeReason: null,
    ...overrides,
  };
}

describe('openingHistoryResponseSchema', () => {
  it('상품이 없을 때(liveMentoringId: null, openings: []) 파싱한다', () => {
    const parsed = openingHistoryResponseSchema.parse({
      liveMentoringId: null,
      openings: [],
    });
    expect(parsed.liveMentoringId).toBeNull();
    expect(parsed.openings).toEqual([]);
  });

  it('진행 중 개설(closedAt·closeReason null)을 파싱한다', () => {
    const parsed = openingHistoryResponseSchema.parse({
      liveMentoringId: 12,
      openings: [makeOpening()],
    });
    expect(parsed.openings[0].status).toBe('OPEN');
    expect(parsed.openings[0].closeReason).toBeNull();
    expect(parsed.openings[0].durationPrices[0]).toEqual({
      duration: 30,
      price: 35000,
    });
  });

  it('종료된 개설의 종료 사유를 파싱한다', () => {
    const parsed = openingHistoryResponseSchema.parse({
      liveMentoringId: 12,
      openings: [
        makeOpening({
          status: 'CLOSED',
          closedAt: '2026-08-15T00:05:00',
          closeReason: 'PERIOD_EXPIRED',
        }),
      ],
    });
    expect(parsed.openings[0].closeReason).toBe('PERIOD_EXPIRED');
  });

  it('구계약(openStatusList) 응답은 파싱되지 않는다', () => {
    expect(() =>
      openingHistoryResponseSchema.parse({ openStatusList: [] }),
    ).toThrow();
  });

  it('알 수 없는 종료 사유는 파싱 실패', () => {
    expect(() =>
      openingHistoryResponseSchema.parse({
        liveMentoringId: 12,
        openings: [makeOpening({ closeReason: 'MENTOR_CLOSED' })],
      }),
    ).toThrow();
  });
});

describe('createOpeningRequestSchema', () => {
  it('개설 요청 5개 필드를 파싱하고 가격은 담지 않는다', () => {
    const parsed = createOpeningRequestSchema.parse({
      title: '자소서 실전 첨삭 멘토링',
      categories: ['RESUME'],
      durations: [30, 60],
      feedbackStartDate: '2026-08-01',
      feedbackEndDate: '2026-08-14',
      price: 35000,
    });
    expect(Object.keys(parsed).sort()).toEqual([
      'categories',
      'durations',
      'feedbackEndDate',
      'feedbackStartDate',
      'title',
    ]);
  });

  it('진행시간이 30/60이 아니면 파싱 실패', () => {
    expect(() =>
      createOpeningRequestSchema.parse({
        title: '자소서 실전 첨삭 멘토링',
        categories: ['RESUME'],
        durations: [45],
        feedbackStartDate: '2026-08-01',
        feedbackEndDate: '2026-08-14',
      }),
    ).toThrow();
  });
});
