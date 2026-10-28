import { describe, expect, it } from 'vitest';

import {
  adminOneTimeFormApplicationsSchema,
  adminOneTimeFormDetailSchema,
  adminOneTimeFormListSchema,
  adminOneTimeFormOptionGroupsSchema,
  adminOneTimeFormQuestionsSchema,
  createOneTimeFormResponseSchema,
  oneTimeFormAnswersSchema,
  oneTimeFormAnswerValueSchema,
  oneTimeFormQuestionTypeSchema,
  saveOneTimeFormOptionGroupsRequestSchema,
  saveOneTimeFormQuestionsRequestSchema,
  saveOneTimeFormRequestSchema,
} from './oneTimeFormSchema';

/**
 * 계약 9절 JSON 예시를 그대로 옮겨 통과시키고, 필수 필드가 빠지면 실패하는지 본다.
 * 예시가 바뀌면 계약 문서와 이 파일을 함께 고친다.
 */

const listExample = {
  forms: [
    {
      formId: 7,
      title: '현직자와 함께하는 포트폴리오 집중 클래스',
      slug: 'portfolio-1115',
      isVisible: true,
      isPaid: true,
      basePrice: 29000,
      startDate: '2026-11-01T00:00:00',
      endDate: '2026-11-10T23:59:59',
      applicationCount: 2,
      createDate: '2026-10-20T10:00:00',
    },
  ],
};

const saveFormExample = {
  title: '현직자와 함께하는 포트폴리오 집중 클래스',
  slug: 'portfolio-1115',
  categoryText: '일회성 클래스',
  scheduleText: '11.15(토) 14:00',
  thumbnailUrl:
    'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/one-time-form/thumbnail/a8Kd02LmQz_portfolio.png',
  isVisible: true,
  startDate: '2026-11-01T00:00:00',
  endDate: '2026-11-10T23:59:59',
  cancelDeadline: '2026-11-10T23:59:59',
  isPaid: true,
  basePrice: 29000,
  paymentProductName: '포트폴리오 집중 클래스',
  completionMessage:
    '수업 하루 전에 입력하신 이메일로 참여 링크를 보내드려요. 문의는 채널톡으로 남겨 주세요.',
};

const questionExample = {
  questionId: 101,
  type: 'RADIO',
  title: '희망 직무',
  description: null,
  isRequired: true,
  choices: ['프론트엔드', '백엔드', '데이터'],
  sortOrder: 0,
};

const optionGroupExample = {
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
      isVisible: true,
      sortOrder: 0,
    },
    {
      optionId: 312,
      name: '오프라인 현장 참여',
      description: '현장 네트워킹 포함',
      additionalPrice: 10000,
      badge: '추천',
      isVisible: true,
      sortOrder: 1,
    },
  ],
};

const detailExample = {
  form: {
    formId: 7,
    title: '현직자와 함께하는 포트폴리오 집중 클래스',
    slug: 'portfolio-1115',
    categoryText: '일회성 클래스',
    scheduleText: '11.15(토) 14:00',
    thumbnailUrl:
      'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/one-time-form/thumbnail/a8Kd02LmQz_portfolio.png',
    isVisible: true,
    startDate: '2026-11-01T00:00:00',
    endDate: '2026-11-10T23:59:59',
    cancelDeadline: '2026-11-10T23:59:59',
    isPaid: true,
    basePrice: 29000,
    paymentProductName: '포트폴리오 집중 클래스',
    completionMessage:
      '수업 하루 전에 입력하신 이메일로 참여 링크를 보내드려요. 문의는 채널톡으로 남겨 주세요.',
    applicationCount: 2,
    isSlugLocked: true,
    createDate: '2026-10-20T10:00:00',
  },
  questions: [questionExample],
  optionGroups: [optionGroupExample],
};

const saveQuestionsExample = {
  questions: [
    {
      questionId: 101,
      type: 'RADIO',
      title: '희망 직무',
      description: null,
      isRequired: true,
      choices: ['프론트엔드', '백엔드', '데이터'],
    },
    {
      questionId: null,
      type: 'SHORT_TEXT',
      title: '추천인',
      description: '없으면 비워 두세요.',
      isRequired: false,
      choices: null,
    },
  ],
};

const saveOptionGroupsExample = {
  optionGroups: [
    {
      optionGroupId: 31,
      title: '참여 방식을 골라 주세요',
      description: '현장 참여는 강남역 인근 강의실에서 진행해요.',
      selectType: 'SINGLE',
      isRequired: true,
      options: [
        {
          optionId: 311,
          name: '온라인 라이브',
          description: 'Zoom 링크로 참여',
          additionalPrice: 0,
          badge: null,
          isVisible: true,
        },
        {
          optionId: null,
          name: '현장 + 뒤풀이',
          description: null,
          additionalPrice: 15000,
          badge: '신규',
          isVisible: true,
        },
      ],
    },
  ],
};

describe('계약 예시가 통과한다', () => {
  it('A1 목록', () => {
    expect(adminOneTimeFormListSchema.parse(listExample)).toEqual(listExample);
  });

  it('A2·A4 저장 본문', () => {
    expect(saveOneTimeFormRequestSchema.parse(saveFormExample)).toEqual(
      saveFormExample,
    );
  });

  it('A2 응답', () => {
    expect(createOneTimeFormResponseSchema.parse({ formId: 7 })).toEqual({
      formId: 7,
    });
  });

  it('A3 상세', () => {
    expect(adminOneTimeFormDetailSchema.parse(detailExample)).toEqual(
      detailExample,
    );
  });

  it('A6 요청과 응답', () => {
    expect(
      saveOneTimeFormQuestionsRequestSchema.parse(saveQuestionsExample),
    ).toEqual(saveQuestionsExample);
    expect(
      adminOneTimeFormQuestionsSchema.parse({ questions: [questionExample] }),
    ).toEqual({ questions: [questionExample] });
  });

  it('A7 요청과 응답', () => {
    expect(
      saveOneTimeFormOptionGroupsRequestSchema.parse(saveOptionGroupsExample),
    ).toEqual(saveOptionGroupsExample);
    expect(
      adminOneTimeFormOptionGroupsSchema.parse({
        optionGroups: [optionGroupExample],
      }),
    ).toEqual({ optionGroups: [optionGroupExample] });
  });

  it('A2 저장 본문의 선택 필드는 null 로 보낼 수 있다', () => {
    const minimal = {
      ...saveFormExample,
      categoryText: null,
      scheduleText: null,
      thumbnailUrl: null,
      cancelDeadline: null,
      paymentProductName: null,
      completionMessage: null,
    };
    expect(saveOneTimeFormRequestSchema.parse(minimal)).toEqual(minimal);
  });

  it('질문 형식은 계약 5.3 의 10종이다', () => {
    expect(oneTimeFormQuestionTypeSchema.options).toEqual([
      'SHORT_TEXT',
      'LONG_TEXT',
      'RADIO',
      'DROPDOWN',
      'CHECKBOX',
      'DATE',
      'NUMBER',
      'URL',
      'IMAGE',
      'FILE',
    ]);
  });
});

describe('필수 필드가 빠지면 실패한다', () => {
  const omit = <T extends object>(obj: T, key: keyof T) => {
    const copy = { ...obj };
    delete copy[key];
    return copy;
  };

  it('A1 항목의 applicationCount', () => {
    expect(() =>
      adminOneTimeFormListSchema.parse({
        forms: [omit(listExample.forms[0], 'applicationCount')],
      }),
    ).toThrow();
  });

  it.each([
    'title',
    'slug',
    'isVisible',
    'startDate',
    'endDate',
    'isPaid',
    'basePrice',
  ] as const)('A2·A4 저장 본문의 %s', (key) => {
    expect(() =>
      saveOneTimeFormRequestSchema.parse(omit(saveFormExample, key)),
    ).toThrow();
  });

  it('A3 form 의 isSlugLocked', () => {
    expect(() =>
      adminOneTimeFormDetailSchema.parse({
        ...detailExample,
        form: omit(detailExample.form, 'isSlugLocked'),
      }),
    ).toThrow();
  });

  it('A6 질문의 type', () => {
    expect(() =>
      saveOneTimeFormQuestionsRequestSchema.parse({
        questions: [omit(saveQuestionsExample.questions[0], 'type')],
      }),
    ).toThrow();
  });

  it('A7 그룹의 selectType', () => {
    expect(() =>
      saveOneTimeFormOptionGroupsRequestSchema.parse({
        optionGroups: [
          omit(saveOptionGroupsExample.optionGroups[0], 'selectType'),
        ],
      }),
    ).toThrow();
  });
});

describe('계약 5.6 형식 제한', () => {
  it('slug 형식이 어긋나면 실패한다', () => {
    ['Portfolio', 'ab', 'a--b', '-ab', 'ab-', 'a_b'].forEach((slug) => {
      expect(
        saveOneTimeFormRequestSchema.safeParse({ ...saveFormExample, slug })
          .success,
      ).toBe(false);
    });
  });

  it('기본 금액 0 원은 허용하고 음수는 거절한다', () => {
    expect(
      saveOneTimeFormRequestSchema.safeParse({
        ...saveFormExample,
        basePrice: 0,
      }).success,
    ).toBe(true);
    expect(
      saveOneTimeFormRequestSchema.safeParse({
        ...saveFormExample,
        basePrice: -1,
      }).success,
    ).toBe(false);
  });

  it('옵션 추가 금액이 음수면 실패한다', () => {
    const group = saveOptionGroupsExample.optionGroups[0];
    expect(
      saveOneTimeFormOptionGroupsRequestSchema.safeParse({
        optionGroups: [
          {
            ...group,
            options: [{ ...group.options[0], additionalPrice: -1000 }],
          },
        ],
      }).success,
    ).toBe(false);
  });

  it('없는 질문 형식이면 실패한다', () => {
    expect(oneTimeFormQuestionTypeSchema.safeParse('EMAIL').success).toBe(
      false,
    );
  });
});

/** 계약 A8 예시 그대로 */
const applicationsExample = {
  form: {
    formId: 7,
    title: '현직자와 함께하는 포트폴리오 집중 클래스',
    slug: 'portfolio-1115',
    isPaid: true,
  },
  questions: [
    {
      questionId: 100,
      type: 'SHORT_TEXT',
      title: '이전 질문',
      sortOrder: 0,
      isDeleted: true,
    },
    {
      questionId: 101,
      type: 'RADIO',
      title: '희망 직무',
      sortOrder: 0,
      isDeleted: false,
    },
    {
      questionId: 103,
      type: 'CHECKBOX',
      title: '참여 가능한 요일',
      sortOrder: 2,
      isDeleted: false,
    },
    {
      questionId: 110,
      type: 'FILE',
      title: '이력서',
      sortOrder: 9,
      isDeleted: false,
    },
  ],
  optionGroups: [
    {
      optionGroupId: 31,
      title: '참여 방식을 골라 주세요',
      sortOrder: 0,
      isDeleted: false,
    },
    {
      optionGroupId: 32,
      title: '함께 신청하면 좋아요',
      sortOrder: 1,
      isDeleted: false,
    },
  ],
  applications: [
    {
      applicationId: 1042,
      createDate: '2026-11-02T13:24:00',
      isCanceled: false,
      canceledAt: null,
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
      payment: {
        paymentId: 88001,
        orderId: 'letsXk29Pq8812',
        paidAmount: 49000,
        refundAmount: 0,
      },
      user: {
        userId: 58231,
        email: 'letscareer@example.com',
        university: '렛츠대학교',
        major: '경영학과',
        grade: '4학년',
        wishField: '개발',
        wishJob: '프론트엔드',
        wishIndustry: 'IT',
        inflowPath: '인스타그램',
        marketingAgree: true,
      },
      utmSource: 'instagram',
      utmMedium: 'paid',
      utmCampaign: 'portfolio_1115',
      utmContent: 'story_a',
      utmTerm: null,
      referrer: 'https://event-xxx.vercel.app/',
      answers: {
        '100': '삭제 전 답',
        '101': '프론트엔드',
        '103': ['월', '수'],
        '110': {
          key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
          name: '김렛커_이력서_최종.pdf',
        },
      },
    },
  ],
};

describe('A8 신청자 목록', () => {
  const [application] = applicationsExample.applications;

  it('계약 예시가 통과한다', () => {
    expect(
      adminOneTimeFormApplicationsSchema.parse(applicationsExample),
    ).toEqual(applicationsExample);
  });

  it('무료 폼의 payment, 탈퇴한 계정의 user 는 null 로 온다', () => {
    const free = { ...application, payment: null, user: null };
    expect(
      adminOneTimeFormApplicationsSchema.parse({
        ...applicationsExample,
        applications: [free],
      }).applications[0],
    ).toEqual(free);
  });

  it.each(['isCanceled', 'selectedOptions', 'payment', 'answers'] as const)(
    '신청 항목의 %s 가 빠지면 실패한다',
    (key) => {
      const { [key]: _omitted, ...rest } = application;
      expect(() =>
        adminOneTimeFormApplicationsSchema.parse({
          ...applicationsExample,
          applications: [rest],
        }),
      ).toThrow();
    },
  );

  it('questions 가 빠지면 실패한다', () => {
    const { questions: _omitted, ...rest } = applicationsExample;
    expect(() => adminOneTimeFormApplicationsSchema.parse(rest)).toThrow();
  });

  it.each([
    ['문자열', '프론트엔드'],
    ['문자열 배열', ['월', '수']],
    ['숫자', 18],
    ['첨부', { key: 'one-time-form/attachment/7/a.png', name: '프로필.png' }],
  ])('답은 %s 를 받는다', (_, value) => {
    expect(oneTimeFormAnswerValueSchema.parse(value)).toEqual(value);
  });

  it.each([
    ['불리언', true],
    ['이름 없는 첨부', { key: 'one-time-form/attachment/7/a.png' }],
    ['숫자 배열', [1, 2]],
  ])('답은 %s 를 거절한다', (_, value) => {
    expect(() => oneTimeFormAnswerValueSchema.parse(value)).toThrow();
  });

  it('답 객체는 질문 ID 를 키로 형식을 섞어 받는다', () => {
    expect(oneTimeFormAnswersSchema.parse(application.answers)).toEqual(
      application.answers,
    );
  });
});
