import {
  createOneTimeFormApplicationRequestSchema,
  createOneTimeFormApplicationResponseSchema,
  myOneTimeFormApplicationSchema,
  oneTimeFormAnswersSchema,
  oneTimeFormSchema,
  oneTimeFormUploadUrlSchema,
} from './oneTimeFormSchema';

// 값은 계약(.claude/tasks/memos/일회성-폼-결제-API계약.md) 8절 예시와 13.3절 시드에서 그대로 가져왔다.

const u1Form7 = {
  form: {
    formId: 7,
    slug: 'portfolio-1115',
    title: '현직자와 함께하는 포트폴리오 집중 클래스',
    categoryText: '일회성 클래스',
    scheduleText: '11.15(토) 14:00',
    thumbnailUrl:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/one-time-form/thumbnail/a8Kd02LmQz_portfolio.png',
    isPaid: true,
    basePrice: 29000,
    paymentProductName: '포트폴리오 집중 클래스',
    startDate: '2026-11-01T00:00:00',
    endDate: '2026-11-10T23:59:59',
    cancelDeadline: '2026-11-10T23:59:59',
    applyStatus: 'OPEN',
    completionMessage:
      '수업 하루 전에 입력하신 이메일로 참여 링크를 보내드려요. 문의는 채널톡으로 남겨 주세요.',
  },
  optionGroups: [
    {
      optionGroupId: 31,
      title: '참여 방식을 골라 주세요',
      description: '현장 참여는 강남역 인근 강의실에서 진행해요.',
      selectType: 'SINGLE',
      isRequired: true,
      sortOrder: 0,
      options: [
        {
          optionId: 311,
          name: '온라인 라이브',
          description: 'Zoom 링크로 참여',
          additionalPrice: 0,
          badge: null,
          sortOrder: 0,
        },
        {
          optionId: 312,
          name: '오프라인 현장 참여',
          description: '현장 네트워킹 포함',
          additionalPrice: 10000,
          badge: '추천',
          sortOrder: 1,
        },
      ],
    },
    {
      optionGroupId: 32,
      title: '함께 신청하면 좋아요',
      description: '선택 사항이에요. 여러 개 고를 수 있어요.',
      selectType: 'MULTIPLE',
      isRequired: false,
      sortOrder: 1,
      options: [
        {
          optionId: 321,
          name: '포트폴리오 1:1 첨삭',
          description: '클래스 후 7일 안에 서면 피드백',
          additionalPrice: 20000,
          badge: null,
          sortOrder: 0,
        },
        {
          optionId: 322,
          name: '녹화본 다시보기',
          description: '30일 동안 시청',
          additionalPrice: 5000,
          badge: null,
          sortOrder: 1,
        },
      ],
    },
  ],
  questions: [
    {
      questionId: 101,
      type: 'RADIO',
      title: '희망 직무',
      description: null,
      isRequired: true,
      choices: ['프론트엔드', '백엔드', '데이터'],
      sortOrder: 0,
    },
    {
      questionId: 102,
      type: 'DROPDOWN',
      title: '현재 상태',
      description: null,
      isRequired: true,
      choices: ['대학 재학 중', '졸업 후 취업 준비', '재직 중'],
      sortOrder: 1,
    },
    {
      questionId: 103,
      type: 'CHECKBOX',
      title: '참여 가능한 요일',
      description: '여러 개 고를 수 있어요.',
      isRequired: false,
      choices: ['월', '화', '수', '목', '금', '주말'],
      sortOrder: 2,
    },
    {
      questionId: 104,
      type: 'CHECKBOX',
      title: '관심 분야',
      description: null,
      isRequired: true,
      choices: ['서류 첨삭', '면접 준비'],
      sortOrder: 3,
    },
    {
      questionId: 105,
      type: 'DATE',
      title: '졸업(예정)일',
      description: null,
      isRequired: false,
      choices: null,
      sortOrder: 4,
    },
    {
      questionId: 106,
      type: 'NUMBER',
      title: '관련 경력',
      description: '개월',
      isRequired: false,
      choices: null,
      sortOrder: 5,
    },
    {
      questionId: 107,
      type: 'URL',
      title: '포트폴리오 링크',
      description: null,
      isRequired: false,
      choices: null,
      sortOrder: 6,
    },
    {
      questionId: 108,
      type: 'LONG_TEXT',
      title: '신청 동기',
      description: null,
      isRequired: true,
      choices: null,
      sortOrder: 7,
    },
    {
      questionId: 109,
      type: 'IMAGE',
      title: '프로필 사진',
      description: 'jpg, png, webp · 10MB 이하',
      isRequired: false,
      choices: null,
      sortOrder: 8,
    },
    {
      questionId: 110,
      type: 'FILE',
      title: '이력서',
      description: 'pdf, docx, pptx, hwp, zip · 20MB 이하',
      isRequired: true,
      choices: null,
      sortOrder: 9,
    },
  ],
};

// 시드 폼 8: 무료, 썸네일 null, 옵션 없음
const u1Form8 = {
  form: {
    ...u1Form7.form,
    formId: 8,
    slug: 'seminar-1130',
    title: '11월 무료 세미나 사전 질문',
    categoryText: '사전 설문',
    scheduleText: '11.30(일)까지',
    thumbnailUrl: null,
    isPaid: false,
    basePrice: 0,
    endDate: '2026-11-30T23:59:59',
    cancelDeadline: '2026-11-30T23:59:59',
  },
  optionGroups: [],
  questions: [
    {
      questionId: 201,
      type: 'LONG_TEXT',
      title: '세미나에서 듣고 싶은 내용',
      description: null,
      isRequired: true,
      choices: null,
      sortOrder: 0,
    },
  ],
};

// 시드 폼 9: 유료 0원, 썸네일 null, 질문 없음
const u1Form9 = {
  form: {
    ...u1Form7.form,
    formId: 9,
    slug: 'zero-test',
    title: '0원 결제 테스트 폼',
    categoryText: '테스트',
    scheduleText: '내부 QA용',
    thumbnailUrl: null,
    basePrice: 0,
    startDate: '2026-10-01T00:00:00',
    endDate: '2026-12-31T23:59:59',
    cancelDeadline: '2026-12-31T23:59:59',
  },
  optionGroups: [
    {
      optionGroupId: 91,
      title: '참여 방식',
      description: null,
      selectType: 'SINGLE',
      isRequired: true,
      sortOrder: 0,
      options: [
        {
          optionId: 911,
          name: '온라인',
          description: null,
          additionalPrice: 0,
          badge: null,
          sortOrder: 0,
        },
      ],
    },
  ],
  questions: [],
};

const u2Paid = {
  applicationId: 1042,
  createDate: '2026-11-02T13:24:00',
  isCanceled: false,
  canceledAt: null,
  isCancelable: true,
  cancelDeadline: '2026-11-10T23:59:59',
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptions: [
    {
      optionGroupId: 31,
      groupTitle: '참여 방식을 골라 주세요',
      optionId: 311,
      optionName: '온라인 라이브',
      additionalPrice: 0,
    },
    {
      optionGroupId: 32,
      groupTitle: '함께 신청하면 좋아요',
      optionId: 321,
      optionName: '포트폴리오 1:1 첨삭',
      additionalPrice: 20000,
    },
  ],
  payment: { paidAmount: 49000, refundAmount: 0, paymentMethod: '카드' },
  answerItems: [
    {
      questionId: 101,
      type: 'RADIO',
      title: '희망 직무',
      isDeleted: false,
      value: '프론트엔드',
    },
    {
      questionId: 103,
      type: 'CHECKBOX',
      title: '참여 가능한 요일',
      isDeleted: false,
      value: ['월', '수'],
    },
    {
      questionId: 110,
      type: 'FILE',
      title: '이력서',
      isDeleted: false,
      value: {
        key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
        name: '김렛커_이력서_최종.pdf',
      },
    },
  ],
};

const u3Request = {
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptionIds: [311, 321],
  answers: {
    '101': '프론트엔드',
    '102': '졸업 후 취업 준비',
    '103': ['월', '수'],
    '104': ['서류 첨삭'],
    '108': '현업 피드백을 받아 포트폴리오를 완성하고 싶어요.',
    '110': {
      key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
      name: '김렛커_이력서_최종.pdf',
    },
  },
  utmSource: 'instagram',
  utmMedium: 'paid',
  utmCampaign: 'portfolio_1115',
  utmContent: 'story_a',
  utmTerm: null,
  referrer: 'https://event-xxx.vercel.app/',
  payment: {
    paymentKey: 'tgen_20261102132355abcd',
    orderId: 'letsXk29Pq8812',
    amount: 49000,
  },
};

describe('oneTimeFormSchema (U1)', () => {
  it('계약 예시(폼 7)를 그대로 파싱한다', () => {
    expect(oneTimeFormSchema.parse(u1Form7)).toEqual(u1Form7);
  });

  it('시드 폼 8 — 썸네일 null, 옵션 그룹 빈 배열인 무료 폼을 파싱한다', () => {
    const parsed = oneTimeFormSchema.parse(u1Form8);
    expect(parsed.form.thumbnailUrl).toBeNull();
    expect(parsed.optionGroups).toEqual([]);
  });

  it('시드 폼 9 — 질문 없는 유료 0원 폼을 파싱한다', () => {
    const parsed = oneTimeFormSchema.parse(u1Form9);
    expect(parsed.form.basePrice).toBe(0);
    expect(parsed.questions).toEqual([]);
  });

  it('계약에 없는 질문 형식은 거절한다', () => {
    const invalid = {
      ...u1Form8,
      questions: [{ ...u1Form8.questions[0], type: 'EMAIL' }],
    };
    expect(oneTimeFormSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('myOneTimeFormApplicationSchema (U2)', () => {
  it('계약 예시(유료, 취소 가능)를 그대로 파싱한다', () => {
    expect(myOneTimeFormApplicationSchema.parse(u2Paid)).toEqual(u2Paid);
  });

  it('신청이 없으면 data: null 을 받는다', () => {
    expect(myOneTimeFormApplicationSchema.parse(null)).toBeNull();
  });

  it('무료 폼 신청은 payment: null 을 받는다', () => {
    const free = {
      ...u2Paid,
      applicationId: 1044,
      selectedOptions: [],
      payment: null,
      answerItems: [
        {
          questionId: 201,
          type: 'LONG_TEXT',
          title: '세미나에서 듣고 싶은 내용',
          isDeleted: false,
          value: '포트폴리오 첨삭 사례가 궁금해요.',
        },
      ],
    };
    expect(myOneTimeFormApplicationSchema.parse(free)?.payment).toBeNull();
  });

  it('취소된 신청과 0원 결제의 paymentMethod null 을 받는다', () => {
    const canceled = {
      ...u2Paid,
      applicationId: 1043,
      isCanceled: true,
      canceledAt: '2026-11-03T14:02:00',
      isCancelable: false,
      payment: { paidAmount: 39000, refundAmount: 39000, paymentMethod: null },
    };
    expect(myOneTimeFormApplicationSchema.parse(canceled)).toEqual(canceled);
  });
});

describe('createOneTimeFormApplicationRequestSchema (U3 요청)', () => {
  it('계약 예시(유료)를 그대로 파싱한다', () => {
    expect(createOneTimeFormApplicationRequestSchema.parse(u3Request)).toEqual(
      u3Request,
    );
  });

  it('무료 폼 형태 — payment null, 옵션 빈 배열, UTM 생략을 받는다', () => {
    const free = {
      name: '이유저',
      email: 'letscareer@example.com',
      phoneNum: '010-1234-5678',
      selectedOptionIds: [],
      answers: { '201': '포트폴리오 첨삭 사례가 궁금해요.' },
      payment: null,
    };
    expect(createOneTimeFormApplicationRequestSchema.parse(free)).toEqual(free);
  });

  it('유료 0원 형태 — paymentKey null 을 받는다', () => {
    const zero = {
      ...u3Request,
      selectedOptionIds: [911],
      answers: {},
      payment: { paymentKey: null, orderId: 'letsZERO0001', amount: 0 },
    };
    expect(createOneTimeFormApplicationRequestSchema.parse(zero)).toEqual(zero);
  });
});

describe('createOneTimeFormApplicationResponseSchema (U3 응답)', () => {
  it('계약 예시를 파싱한다', () => {
    const res = {
      applicationId: 1042,
      paidAmount: 49000,
      createDate: '2026-11-02T13:24:00',
    };
    expect(createOneTimeFormApplicationResponseSchema.parse(res)).toEqual(res);
  });

  it('무료 폼은 paidAmount: null 을 받는다', () => {
    const res = {
      applicationId: 1044,
      paidAmount: null,
      createDate: '2026-11-02T13:24:00',
    };
    expect(createOneTimeFormApplicationResponseSchema.parse(res)).toEqual(res);
  });
});

describe('oneTimeFormUploadUrlSchema (U4)', () => {
  it('계약 예시를 파싱한다', () => {
    const res = {
      uploadUrl:
        'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=600&X-Amz-Signature=...',
      key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
    };
    expect(oneTimeFormUploadUrlSchema.parse(res)).toEqual(res);
  });
});

describe('oneTimeFormAnswersSchema (답 JSON, 계약 6.1)', () => {
  it('10종 답 값을 모두 받는다', () => {
    const answers = {
      '101': '프론트엔드',
      '102': '졸업 후 취업 준비',
      '103': ['월', '수'],
      '104': ['서류 첨삭'],
      '105': '2027-02-20',
      '106': 18,
      '107': 'https://portfolio.example.com/kim',
      '108': '현업 피드백을 받아 포트폴리오를 완성하고 싶어요.',
      '109': {
        key: 'one-time-form/attachment/7/5d1e7a20-3c4b-4f8e-9b2a-6a1f0c3d8e77.png',
        name: '프로필.png',
      },
      '110': {
        key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
        name: '김렛커_이력서_최종.pdf',
      },
    };
    expect(oneTimeFormAnswersSchema.parse(answers)).toEqual(answers);
  });
});
