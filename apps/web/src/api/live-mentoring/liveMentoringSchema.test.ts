import {
  liveMentorDetailSchema,
  liveMentoringOpeningListSchema,
  liveMentoringOpeningSchema,
} from './liveMentoringSchema';

function makeOpening(overrides: Record<string, unknown> = {}) {
  return {
    liveMentoringId: 100,
    openingId: 500,
    mentorId: 1,
    mentorNickname: '자소서장인',
    mentorProfileImage: null,
    mentorIntroduction: '두괄식 구조 위주',
    representativeCareer: {
      id: 7,
      company: '네이버',
      field: 'IT',
      job: '서비스 기획',
      position: '리드',
      department: '기획팀',
      startDate: '2020-01',
      endDate: null,
    },
    title: '자소서장인 멘토의 1대1 라이브 멘토링',
    categories: ['PERSONAL_STATEMENT'],
    durations: [60],
    minimumPrice: 60000,
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    ...overrides,
  };
}

function makeDetail(overrides: Record<string, unknown> = {}) {
  return {
    title: '자소서장인 멘토의 1:1 멘토링',
    mentorId: 1,
    categories: ['RESUME'],
    durations: [30],
    durationPrices: [{ duration: 60, price: 60000 }],
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
      categories: ['RESUME'],
      hero: { bullets: ['이력서 피드백 및 첨삭'] },
      intro: {
        passedCount: 120,
        profileImage: null,
        affiliation: '카카오 | 백엔드',
        careerLines: ['카카오 | 백엔드 (2020-2026)'],
        oneLiner: '현직 개발자입니다.',
      },
      mentoringTypes: {
        title: '이런 도움을 받을 수 있어요',
        subtitle: '고민에 맞는 유형을 골라보세요.',
        items: [
          {
            typeName: '이력서 피드백',
            title: '이력서를 정리하고 싶다면',
            description: '경험과 역량이 잘 보이도록 점검해요.',
            tags: ['경험 정리', '역량 강조'],
          },
        ],
      },
      strategy: {
        visible: true,
        title: '취업 성공 전략',
        subtitle: '멘토링을 통해 알려드립니다.',
        points: [
          { image: null, title: '핵심 키워드', description: '설명입니다.' },
        ],
      },
      video: {
        visible: true,
        title: '이렇게 도와드려요',
        subtitle: '영상으로 미리 확인하세요',
        videoUrl: 'https://www.youtube.com/embed/xyz',
        caption: '서류 완성도 UP!',
      },
      results: {
        visible: true,
        title: '함께 완성해요',
        subtitle: '결과 사례',
        cases: [
          {
            beforeImage: null,
            afterImage: null,
            beforeCaption: '추상적인 지원동기',
            afterCaption: '경험 연결',
          },
        ],
      },
      reviews: { visible: true, selectedReviewIds: [101, 102] },
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

describe('liveMentoringOpeningSchema', () => {
  it('유효한 개설을 파싱한다', () => {
    expect(() => liveMentoringOpeningSchema.parse(makeOpening())).not.toThrow();
  });

  it('대표 경력 미지정(null)을 허용한다', () => {
    const parsed = liveMentoringOpeningSchema.parse(
      makeOpening({ representativeCareer: null }),
    );
    expect(parsed.representativeCareer).toBeNull();
  });

  it('대표 경력의 개별 필드가 null이어도 파싱한다', () => {
    const parsed = liveMentoringOpeningSchema.parse(
      makeOpening({
        representativeCareer: {
          id: 7,
          company: null,
          field: null,
          job: null,
          position: null,
          department: null,
          startDate: null,
          endDate: null,
        },
      }),
    );
    expect(parsed.representativeCareer?.company).toBeNull();
  });

  it('닉네임·소개·타이틀이 null이어도 파싱한다', () => {
    expect(() =>
      liveMentoringOpeningSchema.parse(
        makeOpening({
          mentorNickname: null,
          mentorIntroduction: null,
          title: null,
        }),
      ),
    ).not.toThrow();
  });

  it('알 수 없는 카테고리는 파싱 실패', () => {
    expect(() =>
      liveMentoringOpeningSchema.parse(
        makeOpening({ categories: ['COVER_LETTER'] }),
      ),
    ).toThrow();
  });

  it('진행시간이 30/60이 아니면 파싱 실패', () => {
    expect(() =>
      liveMentoringOpeningSchema.parse(makeOpening({ durations: [50] })),
    ).toThrow();
  });

  // 서버가 단일 `id` 를 상품·개설 두 식별자로 쪼갠 뒤로, 옛 응답은 더 이상 유효하지 않다.
  it('옛 단일 id 응답은 파싱 실패한다', () => {
    const legacy = makeOpening() as Record<string, unknown>;
    delete legacy.liveMentoringId;
    delete legacy.openingId;
    legacy.id = 100;
    expect(() => liveMentoringOpeningSchema.parse(legacy)).toThrow();
  });
});

describe('liveMentoringOpeningListSchema', () => {
  it('openingList + pageInfo 응답을 파싱한다', () => {
    const parsed = liveMentoringOpeningListSchema.parse({
      openingList: [makeOpening()],
      pageInfo: {
        pageNum: 1,
        pageSize: 9,
        totalElements: 14,
        totalPages: 2,
      },
    });
    expect(parsed.openingList).toHaveLength(1);
    expect(parsed.pageInfo.totalPages).toBe(2);
  });

  it('openingList가 배열이 아니면 파싱 실패', () => {
    expect(() =>
      liveMentoringOpeningListSchema.parse({
        openingList: makeOpening(),
        pageInfo: {
          pageNum: 1,
          pageSize: 9,
          totalElements: 14,
          totalPages: 2,
        },
      }),
    ).toThrow();
  });
});

describe('liveMentorDetailSchema', () => {
  it('프로필·템플릿·후기를 포함한 상세를 파싱한다', () => {
    const parsed = liveMentorDetailSchema.parse(makeDetail());
    expect(parsed.template.intro.passedCount).toBe(120);
    expect(parsed.template.strategy.points).toHaveLength(1);
    expect(parsed.reviews[0].reviewId).toBe(101);
  });

  it('후기가 없어 평점이 null 이어도 파싱한다', () => {
    const parsed = liveMentorDetailSchema.parse(
      makeDetail({ rating: null, reviewCount: 0 }),
    );
    expect(parsed.rating).toBeNull();
  });

  it('프로필 닉네임·소개가 null 이어도 파싱한다', () => {
    const detail = makeDetail() as Record<string, unknown>;
    const profile = detail.profile as Record<string, unknown>;
    expect(() =>
      liveMentorDetailSchema.parse({
        ...detail,
        profile: { ...profile, nickname: null, introduction: null },
      }),
    ).not.toThrow();
  });

  it('template이 빠지면 파싱 실패', () => {
    const detail = makeDetail();
    delete (detail as Record<string, unknown>).template;
    expect(() => liveMentorDetailSchema.parse(detail)).toThrow();
  });
});
