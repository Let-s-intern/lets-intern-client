import {
  checklistItemSchema,
  liveMentorCardSchema,
  liveMentorDetailSchema,
  liveMentorListResponseSchema,
} from './liveMentoringSchema';

function makeCard(overrides: Record<string, unknown> = {}) {
  return {
    mentorId: 1,
    nickname: '자소서장인',
    profileImage: null,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    headline: '네이버 · 기획 7년',
    mentoringPoints: '두괄식 구조 위주',
    categories: ['PERSONAL_STATEMENT'],
    durations: [50],
    price: 60000,
    rating: 4.9,
    reviewCount: 182,
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    ...overrides,
  };
}

function makeDetail(overrides: Record<string, unknown> = {}) {
  return {
    mentorId: 1,
    categories: ['RESUME'],
    durations: [30],
    price: 35000,
    rating: 4.7,
    reviewCount: 12,
    feedbackStartDate: '2026-07-11',
    feedbackEndDate: '2026-07-24',
    profile: {
      visible: true,
      mosaicEnabled: false,
      mosaicBlur: 0,
      nickname: '이력서닥터',
      profileImage: null,
      introduction: '현직 개발자입니다.',
      careers: [
        {
          company: '카카오',
          position: '백엔드',
          period: '2020-2026',
          visible: true,
        },
      ],
    },
    template: {
      category: 'RESUME',
      faq: [{ q: '질문?', a: '답변.' }],
      process: [{ step: 1, title: '사전 제출', desc: '이력서 공유' }],
      submissionSpec: { title: '이력서 파일', desc: '제출해 주세요.' },
      introduction: '현직 개발자입니다.',
      careers: [
        {
          company: '카카오',
          position: '백엔드',
          period: '2020-2026',
          visible: true,
        },
      ],
      mentoringPoints: '성과 표현 위주',
      reviews: { visible: true, selectedReviewIds: [101, 102] },
      checklist: [{ id: 1, label: '지원 직무', mode: 'SHOWN' }],
    },
    reviews: [
      {
        reviewId: 101,
        menteeName: '김**',
        score: 5,
        content: '좋았습니다.',
        createdAt: '2026-06-10',
      },
    ],
    challenges: [
      { challengeId: 11, title: '이력서 완성 챌린지', thumbnail: null },
    ],
    ...overrides,
  };
}

describe('liveMentorCardSchema', () => {
  it('유효한 카드를 파싱한다', () => {
    expect(() => liveMentorCardSchema.parse(makeCard())).not.toThrow();
  });

  it('rating이 문자열이면 파싱 실패', () => {
    expect(() =>
      liveMentorCardSchema.parse(makeCard({ rating: '4.9' })),
    ).toThrow();
  });

  it('알 수 없는 카테고리는 파싱 실패', () => {
    expect(() =>
      liveMentorCardSchema.parse(makeCard({ categories: ['COVER_LETTER'] })),
    ).toThrow();
  });

  it('진행시간이 30/50이 아니면 파싱 실패', () => {
    expect(() =>
      liveMentorCardSchema.parse(makeCard({ durations: [40] })),
    ).toThrow();
  });
});

describe('liveMentorListResponseSchema', () => {
  it('페이징 응답을 파싱한다', () => {
    const parsed = liveMentorListResponseSchema.parse({
      content: [makeCard()],
      page: 0,
      size: 9,
      totalPages: 2,
      totalElements: 14,
    });
    expect(parsed.content).toHaveLength(1);
    expect(parsed.totalPages).toBe(2);
  });

  it('content가 배열이 아니면 파싱 실패', () => {
    expect(() =>
      liveMentorListResponseSchema.parse({
        content: makeCard(),
        page: 0,
        size: 9,
        totalPages: 2,
        totalElements: 14,
      }),
    ).toThrow();
  });
});

describe('liveMentorDetailSchema', () => {
  it('프로필·템플릿·후기를 포함한 상세를 파싱한다', () => {
    const parsed = liveMentorDetailSchema.parse(makeDetail());
    expect(parsed.template.checklist[0].mode).toBe('SHOWN');
    expect(parsed.reviews[0].reviewId).toBe(101);
  });

  it('template이 빠지면 파싱 실패', () => {
    const detail = makeDetail();
    delete (detail as Record<string, unknown>).template;
    expect(() => liveMentorDetailSchema.parse(detail)).toThrow();
  });
});

describe('checklistItemSchema', () => {
  it('mode가 3-모드 밖이면 파싱 실패', () => {
    expect(() =>
      checklistItemSchema.parse({ id: 1, label: 'x', mode: 'MAYBE' }),
    ).toThrow();
  });

  it('CUSTOM 모드는 customText를 허용한다', () => {
    const parsed = checklistItemSchema.parse({
      id: 1,
      label: 'x',
      mode: 'CUSTOM',
      customText: '커스텀 안내',
    });
    expect(parsed.customText).toBe('커스텀 안내');
  });
});
