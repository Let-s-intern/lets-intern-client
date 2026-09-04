import {
  confirmLiveMentoringPaymentRequestSchema,
  confirmLiveMentoringPaymentResponseSchema,
  createLiveMentoringApplicationRequestSchema,
  createLiveMentoringApplicationResponseSchema,
  liveMentorDetailSchema,
  liveMentoringEntrySchema,
  liveMentoringOpeningListSchema,
  liveMentoringOpeningSchema,
  liveMentoringSlotListSchema,
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
    ...overrides,
  };
}

function makeDetail(overrides: Record<string, unknown> = {}) {
  return {
    title: '자소서장인 멘토의 1:1 멘토링',
    mentorId: 1,
    // 신청 생성 경로(`/openings/{openingId}/applications`)에 들어가는 값.
    openingId: 500,
    categories: ['RESUME'],
    durations: [30],
    durationPrices: [{ durationPriceId: 5, duration: 60, price: 60000 }],
    price: 35000,
    rating: 4.7,
    reviewCount: 12,
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
            id: 11,
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

  // LC-3206 — 모집 기간 필드가 응답에서 사라졌다. 남겨 두면 배포 즉시 상세가 통째로 죽는다.
  it('모집 기간 필드가 없어도 파싱되고, 섞여 와도 버린다', () => {
    const parsed = liveMentorDetailSchema.parse(
      makeDetail({
        feedbackStartDate: '2026-07-11',
        feedbackEndDate: '2026-07-24',
      }),
    );
    expect(parsed).not.toHaveProperty('feedbackStartDate');
    expect(parsed).not.toHaveProperty('feedbackEndDate');
  });
});

describe('liveMentoringSlotListSchema', () => {
  it('공개 슬롯 조회 응답을 파싱한다', () => {
    const parsed = liveMentoringSlotListSchema.parse({
      liveMentoringSlotList: [
        {
          slotId: 101,
          startDate: '2026-09-01T10:00:00',
          endDate: '2026-09-01T10:30:00',
          status: 'OPEN',
        },
      ],
    });
    expect(parsed.liveMentoringSlotList[0].slotId).toBe(101);
  });

  it('활성 개설이 없으면 빈 배열이 온다', () => {
    const parsed = liveMentoringSlotListSchema.parse({
      liveMentoringSlotList: [],
    });
    expect(parsed.liveMentoringSlotList).toEqual([]);
  });

  it('알 수 없는 status 는 파싱 실패', () => {
    expect(() =>
      liveMentoringSlotListSchema.parse({
        liveMentoringSlotList: [
          {
            slotId: 101,
            startDate: '2026-09-01T10:00:00',
            endDate: '2026-09-01T10:30:00',
            status: 'CLOSED',
          },
        ],
      }),
    ).toThrow();
  });
});

/** 서버 `CreateLiveMentoringApplicationRequestDto` 를 통과하는 최소 페이로드. */
function makeCreateRequest(overrides: Record<string, unknown> = {}) {
  return {
    durationPriceId: 1,
    slotIds: [142],
    mentoringCategory: 'PERSONAL_STATEMENT',
    reservationChangeAgreed: true,
    contactEmail: 'local-admin@letscareer.test',
    question: {
      deferred: true,
      attachmentType: 'NONE',
      mentorShareAgreed: false,
    },
    ...overrides,
  };
}

describe('createLiveMentoringApplicationRequestSchema', () => {
  it('필수 필드만 담은 페이로드를 통과시킨다', () => {
    const parsed =
      createLiveMentoringApplicationRequestSchema.parse(makeCreateRequest());
    expect(parsed.slotIds).toEqual([142]);
    expect(parsed.question.attachmentType).toBe('NONE');
  });

  it('60분 플랜의 연속 2슬롯을 통과시킨다', () => {
    const parsed = createLiveMentoringApplicationRequestSchema.parse(
      makeCreateRequest({ slotIds: [142, 143] }),
    );
    expect(parsed.slotIds).toHaveLength(2);
  });

  /* 서버 `@Size(max = 2)`. 3개를 보내면 400 이다 — 나가기 전에 막는다. */
  it('슬롯이 3개면 실패한다', () => {
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({ slotIds: [142, 143, 144] }),
      ),
    ).toThrow();
  });

  /* 서버 `slotIds @NotEmpty`, `mentoringCategory @NotNull`. */
  it('슬롯이 비거나 멘토링 유형이 없으면 실패한다', () => {
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({ slotIds: [] }),
      ),
    ).toThrow();
    // 카테고리는 enum 이라 값이 없거나 목록 밖이면 서버가 400 을 준다.
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({ mentoringCategory: undefined }),
      ),
    ).toThrow();
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({ mentoringCategory: 'COFFEE_CHAT' }),
      ),
    ).toThrow();
  });

  /* 서버 `@NotBlank @Email @Size(max = 255)`. */
  it('이메일 형식이 아니거나 255자를 넘으면 실패한다', () => {
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({ contactEmail: 'not-an-email' }),
      ),
    ).toThrow();
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({ contactEmail: '' }),
      ),
    ).toThrow();
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({
          contactEmail: `${'a'.repeat(250)}@letscareer.test`,
        }),
      ),
    ).toThrow();
  });

  /* 서버 `@Size(max = 5000)` / `@Size(max = 2048)` / `@Size(max = 100)`. */
  it('질문 본문 5000자·URL 2048자·쿠폰 100자를 넘으면 실패한다', () => {
    const question = {
      deferred: false,
      attachmentType: 'URL',
      mentorShareAgreed: true,
    };
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({
          question: { ...question, content: 'a'.repeat(5001) },
        }),
      ),
    ).toThrow();
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({
          question: { ...question, url: `https://x.test/${'a'.repeat(2048)}` },
        }),
      ),
    ).toThrow();
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({ couponCode: 'a'.repeat(101) }),
      ),
    ).toThrow();
  });

  /* 서버 enum `LiveMentoringAttachmentType` — NONE / FILE / URL 뿐이다. */
  it('첨부 종류가 서버 enum 밖이면 실패한다', () => {
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(
        makeCreateRequest({
          question: {
            deferred: false,
            attachmentType: 'IMAGE',
            mentorShareAgreed: false,
          },
        }),
      ),
    ).toThrow();
  });

  it('동의 필드가 빠지면 실패한다', () => {
    const { reservationChangeAgreed: _omitted, ...withoutAgreement } =
      makeCreateRequest();
    expect(() =>
      createLiveMentoringApplicationRequestSchema.parse(withoutAgreement),
    ).toThrow();
  });
});

describe('createLiveMentoringApplicationResponseSchema', () => {
  const response = {
    applicationId: 11,
    product: {
      durationPriceId: 1,
      name: '어드민 1대1 라이브 멘토링',
      durationMinutes: 30,
    },
    reservation: {
      slotIds: [142],
      startAt: '2026-09-14T09:30:00',
      endAt: '2026-09-14T10:00:00',
      applicationStatus: 'PAYMENT_PENDING',
      expiresAt: '2026-08-21T12:10:00',
    },
    mentoringCategory: 'PERSONAL_STATEMENT',
    payment: {
      originalPrice: 35000,
      productDiscount: 0,
      couponDiscount: 0,
      finalAmount: 35000,
      orderId: 'lm_20260821_0001',
      currency: 'KRW',
    },
  };

  it('신청 생성 응답을 파싱한다', () => {
    const parsed = createLiveMentoringApplicationResponseSchema.parse(response);
    expect(parsed.applicationId).toBe(11);
    // Toss 에 넘길 주문번호와 10분 선점 만료 시각이 이 응답의 핵심이다
    expect(parsed.payment.orderId).toBe('lm_20260821_0001');
    expect(parsed.reservation.expiresAt).toBe('2026-08-21T12:10:00');
  });

  it('알 수 없는 신청 상태는 파싱 실패', () => {
    expect(() =>
      createLiveMentoringApplicationResponseSchema.parse({
        ...response,
        reservation: { ...response.reservation, applicationStatus: 'PENDING' },
      }),
    ).toThrow();
  });
});

/*
  요청의 amount 는 문자열, 응답의 amount 는 숫자다. 서버 DTO 가 그렇게 생겼다
  (`@NotBlank String amount` vs `Integer amount`). 한쪽으로 맞춰 두면 승인 요청이
  400 으로 떨어지고, 그때는 이미 Toss 결제창이 닫힌 뒤다.
*/
describe('결제 승인 스키마 — amount 타입 비대칭', () => {
  it('요청의 amount 는 문자열만 받는다', () => {
    const parsed = confirmLiveMentoringPaymentRequestSchema.parse({
      paymentKey: 'tviva20260821',
      orderId: 'lm_20260821_0001',
      amount: '35000',
    });
    expect(parsed.amount).toBe('35000');

    expect(() =>
      confirmLiveMentoringPaymentRequestSchema.parse({
        paymentKey: 'tviva20260821',
        orderId: 'lm_20260821_0001',
        amount: 35000,
      }),
    ).toThrow();
  });

  it('응답의 amount 는 숫자만 받는다', () => {
    const parsed = confirmLiveMentoringPaymentResponseSchema.parse({
      applicationId: 11,
      paymentId: 501,
      orderId: 'lm_20260821_0001',
      amount: 35000,
      applicationStatus: 'CONFIRMED',
    });
    expect(parsed.amount).toBe(35000);

    expect(() =>
      confirmLiveMentoringPaymentResponseSchema.parse({
        applicationId: 11,
        paymentId: 501,
        orderId: 'lm_20260821_0001',
        amount: '35000',
        applicationStatus: 'CONFIRMED',
      }),
    ).toThrow();
  });

  /* 서버 `@NotBlank`. 빈 문자열은 400 이다. */
  it('orderId·amount 가 빈 문자열이면 실패한다', () => {
    expect(() =>
      confirmLiveMentoringPaymentRequestSchema.parse({
        paymentKey: 'k',
        orderId: '',
        amount: '35000',
      }),
    ).toThrow();
    expect(() =>
      confirmLiveMentoringPaymentRequestSchema.parse({
        paymentKey: 'k',
        orderId: 'lm_1',
        amount: '',
      }),
    ).toThrow();
  });

  it('신청 상태 enum 4종을 모두 받는다', () => {
    for (const status of [
      'PAYMENT_PENDING',
      'EXPIRED',
      'CANCELED',
      'CONFIRMED',
    ]) {
      expect(
        confirmLiveMentoringPaymentResponseSchema.parse({
          applicationId: 11,
          paymentId: 501,
          orderId: 'lm_1',
          amount: 35000,
          applicationStatus: status,
        }).applicationStatus,
      ).toBe(status);
    }
  });
});

/** 서버 `GetLiveMentoringEntryResponseDto` 를 통과하는 최소 페이로드. */
function makeEntry(overrides: Record<string, unknown> = {}) {
  return {
    applicationId: 1,
    myRole: 'MENTEE',
    productName: '자소서 라이브 멘토링',
    durationMinutes: 30,
    reservationStartAt: '2026-09-01T10:00:00',
    reservationEndAt: '2026-09-01T10:30:00',
    mentorName: '김멘토',
    menteeName: '박멘티',
    questionDeferred: false,
    questionContent: null,
    attachmentType: 'NONE',
    attachmentUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    meetingUrl: null,
    reviewId: null,
    questionEditable: true,
    questionEditDeadline: '2026-08-31T10:00:00',
    ...overrides,
  };
}

// 종료 시 후기 모달을 다시 띄울지(§3.3.2) 는 이 필드로 판정한다 — 파싱 단계에서
// 두 케이스(있음/없음)가 모두 통과해야 한다.
describe('liveMentoringEntrySchema — reviewId', () => {
  it('후기를 아직 안 썼으면 reviewId 가 null 이다', () => {
    const parsed = liveMentoringEntrySchema.parse(makeEntry());
    expect(parsed.reviewId).toBeNull();
  });

  it('후기를 이미 썼으면 reviewId 를 그대로 파싱한다', () => {
    const parsed = liveMentoringEntrySchema.parse(makeEntry({ reviewId: 77 }));
    expect(parsed.reviewId).toBe(77);
  });

  it('reviewId 가 없으면(구버전 응답) 파싱 실패한다', () => {
    const entry = makeEntry() as Record<string, unknown>;
    delete entry.reviewId;
    expect(() => liveMentoringEntrySchema.parse(entry)).toThrow();
  });
});
