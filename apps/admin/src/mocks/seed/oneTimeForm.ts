import type {
  AdminOneTimeForm,
  AdminOneTimeFormOption,
  AdminOneTimeFormOptionGroup,
  AdminOneTimeFormQuestion,
} from '@/api/one-time-form/oneTimeFormSchema';

/**
 * 일회성 폼 목 시드(계약 13.3).
 *
 * 서버 테이블처럼 저장 상태로 둔다. `applicationCount`, `isSlugLocked` 는 응답에서 계산하므로
 * 폼에 넣지 않고, 소프트 삭제된 질문·그룹·옵션도 `isDeleted` 로 함께 둔다.
 *
 *   폼 7  유료 29,000원, 공개, 질문 101~110(+삭제된 100), 옵션 그룹 31·32
 *   폼 8  무료, 공개, 질문 201, 옵션 없음
 *   폼 9  유료 0원, 비공개, 질문 없음, 옵션 그룹 91
 *
 * 신청은 지금 폼별 신청 수와 결제된 옵션(A7 숨김 처리) 판단에 필요한 값만 둔다.
 * 신청자 화면(A8~A10) 작업에서 같은 배열에 나머지 필드를 붙인다.
 */

export type SeedOneTimeForm = Omit<
  AdminOneTimeForm,
  'applicationCount' | 'isSlugLocked'
>;

export type SeedOneTimeFormQuestion = AdminOneTimeFormQuestion & {
  formId: number;
  isDeleted: boolean;
};

export type SeedOneTimeFormOption = AdminOneTimeFormOption & {
  isDeleted: boolean;
};

export type SeedOneTimeFormOptionGroup = Omit<
  AdminOneTimeFormOptionGroup,
  'options'
> & {
  formId: number;
  isDeleted: boolean;
  options: SeedOneTimeFormOption[];
};

/** 계약 6.2 옵션 스냅샷 항목 */
export interface SeedOneTimeFormSelectedOption {
  optionGroupId: number;
  groupTitle: string;
  optionId: number;
  optionName: string;
  additionalPrice: number;
}

export interface SeedOneTimeFormApplication {
  applicationId: number;
  formId: number;
  selectedOptions: SeedOneTimeFormSelectedOption[];
}

export const seedOneTimeForms: SeedOneTimeForm[] = [
  {
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
    createDate: '2026-10-20T10:00:00',
  },
  {
    formId: 8,
    title: '11월 무료 세미나 사전 질문',
    slug: 'seminar-1130',
    categoryText: '사전 설문',
    scheduleText: '11.30(일)까지',
    thumbnailUrl: null,
    isVisible: true,
    startDate: '2026-11-01T00:00:00',
    endDate: '2026-11-30T23:59:59',
    cancelDeadline: null,
    isPaid: false,
    basePrice: 0,
    paymentProductName: null,
    completionMessage: null,
    // 계약에 생성일이 없다. 목록 정렬(생성일 내림차순)을 확인하려고 정한 값이다
    createDate: '2026-10-22T10:00:00',
  },
  {
    formId: 9,
    title: '0원 결제 테스트 폼',
    slug: 'zero-test',
    categoryText: '테스트',
    scheduleText: '내부 QA용',
    thumbnailUrl: null,
    isVisible: false,
    startDate: '2026-10-01T00:00:00',
    endDate: '2026-12-31T23:59:59',
    cancelDeadline: null,
    isPaid: true,
    basePrice: 0,
    paymentProductName: null,
    completionMessage: null,
    // 계약에 생성일이 없다. 위와 같은 이유로 정한 값이다
    createDate: '2026-09-25T10:00:00',
  },
];

const question = (
  formId: number,
  q: Omit<SeedOneTimeFormQuestion, 'formId' | 'isDeleted'>,
  isDeleted = false,
): SeedOneTimeFormQuestion => ({ ...q, formId, isDeleted });

export const seedOneTimeFormQuestions: SeedOneTimeFormQuestion[] = [
  // 삭제된 질문. A3 에는 안 나오고 신청자 CSV 에서만 "(삭제됨)" 열로 남는다
  question(
    7,
    {
      questionId: 100,
      type: 'SHORT_TEXT',
      title: '이전 질문',
      description: null,
      isRequired: false,
      choices: null,
      sortOrder: 0,
    },
    true,
  ),
  question(7, {
    questionId: 101,
    type: 'RADIO',
    title: '희망 직무',
    description: null,
    isRequired: true,
    choices: ['프론트엔드', '백엔드', '데이터'],
    sortOrder: 0,
  }),
  question(7, {
    questionId: 102,
    type: 'DROPDOWN',
    title: '현재 상태',
    description: null,
    isRequired: true,
    choices: ['대학 재학 중', '졸업 후 취업 준비', '재직 중'],
    sortOrder: 1,
  }),
  question(7, {
    questionId: 103,
    type: 'CHECKBOX',
    title: '참여 가능한 요일',
    description: '여러 개 고를 수 있어요.',
    isRequired: false,
    choices: ['월', '화', '수', '목', '금', '주말'],
    sortOrder: 2,
  }),
  question(7, {
    questionId: 104,
    type: 'CHECKBOX',
    title: '관심 분야',
    description: null,
    isRequired: true,
    choices: ['서류 첨삭', '면접 준비'],
    sortOrder: 3,
  }),
  question(7, {
    questionId: 105,
    type: 'DATE',
    title: '졸업(예정)일',
    description: null,
    isRequired: false,
    choices: null,
    sortOrder: 4,
  }),
  question(7, {
    questionId: 106,
    type: 'NUMBER',
    title: '관련 경력',
    description: '개월',
    isRequired: false,
    choices: null,
    sortOrder: 5,
  }),
  question(7, {
    questionId: 107,
    type: 'URL',
    title: '포트폴리오 링크',
    description: null,
    isRequired: false,
    choices: null,
    sortOrder: 6,
  }),
  question(7, {
    questionId: 108,
    type: 'LONG_TEXT',
    title: '신청 동기',
    description: null,
    isRequired: true,
    choices: null,
    sortOrder: 7,
  }),
  question(7, {
    questionId: 109,
    type: 'IMAGE',
    title: '프로필 사진',
    description: 'jpg, png, webp · 10MB 이하',
    isRequired: false,
    choices: null,
    sortOrder: 8,
  }),
  question(7, {
    questionId: 110,
    type: 'FILE',
    title: '이력서',
    description: 'pdf, docx, pptx, hwp, zip · 20MB 이하',
    isRequired: true,
    choices: null,
    sortOrder: 9,
  }),
  question(8, {
    questionId: 201,
    type: 'LONG_TEXT',
    title: '세미나에서 듣고 싶은 내용',
    description: null,
    isRequired: true,
    choices: null,
    sortOrder: 0,
  }),
];

export const seedOneTimeFormOptionGroups: SeedOneTimeFormOptionGroup[] = [
  {
    formId: 7,
    optionGroupId: 31,
    title: '참여 방식을 골라 주세요',
    description: '현장 참여는 강남역 인근 강의실에서 진행해요.',
    selectType: 'SINGLE',
    isRequired: true,
    sortOrder: 0,
    isDeleted: false,
    options: [
      {
        optionId: 311,
        name: '온라인 라이브',
        description: 'Zoom 링크로 참여',
        additionalPrice: 0,
        badge: null,
        isVisible: true,
        sortOrder: 0,
        isDeleted: false,
      },
      {
        optionId: 312,
        name: '오프라인 현장 참여',
        description: '현장 네트워킹 포함',
        additionalPrice: 10000,
        badge: '추천',
        isVisible: true,
        sortOrder: 1,
        isDeleted: false,
      },
    ],
  },
  {
    formId: 7,
    optionGroupId: 32,
    title: '함께 신청하면 좋아요',
    description: '선택 사항이에요. 여러 개 고를 수 있어요.',
    selectType: 'MULTIPLE',
    isRequired: false,
    sortOrder: 1,
    isDeleted: false,
    options: [
      {
        optionId: 321,
        name: '포트폴리오 1:1 첨삭',
        description: '클래스 후 7일 안에 서면 피드백',
        additionalPrice: 20000,
        badge: null,
        isVisible: true,
        sortOrder: 0,
        isDeleted: false,
      },
      {
        optionId: 322,
        name: '녹화본 다시보기',
        description: '30일 동안 시청',
        additionalPrice: 5000,
        badge: null,
        isVisible: true,
        sortOrder: 1,
        isDeleted: false,
      },
    ],
  },
  {
    formId: 9,
    optionGroupId: 91,
    title: '참여 방식',
    description: null,
    selectType: 'SINGLE',
    isRequired: true,
    sortOrder: 0,
    isDeleted: false,
    options: [
      {
        optionId: 911,
        name: '온라인',
        description: null,
        additionalPrice: 0,
        badge: null,
        isVisible: true,
        sortOrder: 0,
        isDeleted: false,
      },
    ],
  },
];

export const seedOneTimeFormApplications: SeedOneTimeFormApplication[] = [
  {
    applicationId: 1042,
    formId: 7,
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
  },
  {
    // 취소된 신청. 신청 수와 결제된 옵션 판단에는 그대로 들어간다
    applicationId: 1043,
    formId: 7,
    selectedOptions: [
      {
        optionGroupId: 31,
        groupTitle: '참여 방식을 골라 주세요',
        optionId: 312,
        optionName: '오프라인 현장 참여',
        additionalPrice: 10000,
      },
    ],
  },
  { applicationId: 1044, formId: 8, selectedOptions: [] },
  {
    applicationId: 1050,
    formId: 9,
    selectedOptions: [
      {
        optionGroupId: 91,
        groupTitle: '참여 방식',
        optionId: 911,
        optionName: '온라인',
        additionalPrice: 0,
      },
    ],
  },
];
