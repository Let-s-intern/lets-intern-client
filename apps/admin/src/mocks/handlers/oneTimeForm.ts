import { http, HttpResponse } from 'msw';

import {
  adminOneTimeFormListItemSchema,
  CHOICE_QUESTION_TYPES,
  saveOneTimeFormOptionGroupsRequestSchema,
  saveOneTimeFormQuestionsRequestSchema,
  saveOneTimeFormRequestSchema,
  type AdminOneTimeForm,
  type AdminOneTimeFormOptionGroup,
  type AdminOneTimeFormQuestion,
  type SaveOneTimeFormRequest,
} from '@/api/one-time-form/oneTimeFormSchema';

import {
  seedOneTimeFormApplications,
  seedOneTimeFormOptionGroups,
  seedOneTimeFormQuestions,
  seedOneTimeForms,
  type SeedOneTimeForm,
  type SeedOneTimeFormApplication,
  type SeedOneTimeFormOptionGroup,
  type SeedOneTimeFormQuestion,
} from '../seed/oneTimeForm';

/**
 * 일회성 폼 어드민 MSW 핸들러(계약 9절 A1~A10, 13.2).
 *
 * axios 응답 본문이 `{ data: <payload> }` 엔벨로프(`res.data.data`)이므로 모두 `{ data }` 로 감싼다.
 * 실패 본문은 서버 `ErrorResponse` 와 같은 `{ status, code, message }` 다(계약 3.5, 10절).
 *
 * 저장이 다음 조회에 반영되도록 시드를 메모리에서 변경한다. 테스트는 `resetOneTimeFormMock` 으로 되돌린다.
 */

const BASE = '*/api/v1/admin/one-time-form';

let forms: SeedOneTimeForm[] = [];
let questions: SeedOneTimeFormQuestion[] = [];
let optionGroups: SeedOneTimeFormOptionGroup[] = [];
let applications: SeedOneTimeFormApplication[] = [];
let nextFormId = 0;
let nextQuestionId = 0;
let nextOptionGroupId = 0;
let nextOptionId = 0;

/** 테스트가 서로의 변경을 물려받지 않게 되돌린다. */
export const resetOneTimeFormMock = () => {
  forms = structuredClone(seedOneTimeForms);
  questions = structuredClone(seedOneTimeFormQuestions);
  optionGroups = structuredClone(seedOneTimeFormOptionGroups);
  applications = structuredClone(seedOneTimeFormApplications);
  nextFormId = Math.max(...forms.map((f) => f.formId)) + 1;
  nextQuestionId = Math.max(...questions.map((q) => q.questionId)) + 1;
  nextOptionGroupId = Math.max(...optionGroups.map((g) => g.optionGroupId)) + 1;
  nextOptionId =
    Math.max(...optionGroups.flatMap((g) => g.options.map((o) => o.optionId))) +
    1;
};
resetOneTimeFormMock();

const ERROR_STATUS_AND_MESSAGE = {
  BAD_REQUEST: [400, '잘못된 요청입니다.'],
  ONE_TIME_FORM_NOT_FOUND: [404, '신청 페이지를 찾을 수 없습니다.'],
  ONE_TIME_FORM_SLUG_DUPLICATED: [409, '이미 사용 중인 주소입니다.'],
  ONE_TIME_FORM_SLUG_LOCKED: [
    400,
    '공개 중이거나 신청이 있는 폼은 주소를 바꿀 수 없습니다.',
  ],
  ONE_TIME_FORM_INVALID_PERIOD: [400, '기간 설정이 올바르지 않습니다.'],
  ONE_TIME_FORM_HAS_APPLICATIONS: [409, '신청이 있는 폼은 삭제할 수 없습니다.'],
  ONE_TIME_FORM_CHOICES_REQUIRED: [400, '선택형 질문에는 선택지가 필요합니다.'],
  ONE_TIME_FORM_QUESTION_TYPE_LOCKED: [
    400,
    '저장된 질문의 형식은 바꿀 수 없습니다.',
  ],
  ONE_TIME_FORM_ITEM_NOT_IN_FORM: [400, '이 폼의 질문 또는 옵션이 아닙니다.'],
  APPLICATION_NOT_FOUND: [404, '존재하지 않는 신청 내역입니다.'],
  ONE_TIME_FORM_FILE_NOT_FOUND: [404, '첨부 파일이 없습니다.'],
  APPLICATION_ALREADY_CANCELED: [409, '이미 취소된 신청입니다.'],
  PAYMENT_NOT_FOUND: [404, '결제 내역이 없습니다.'],
  MANAGER_NAME_REQUIRED: [400, '담당자 이름을 입력해주세요.'],
  REASON_REQUIRED: [400, '환불 사유를 입력해주세요.'],
} as const;

type ErrorCode = keyof typeof ERROR_STATUS_AND_MESSAGE;

const error = (code: ErrorCode, message?: string) => {
  const [status, defaultMessage] = ERROR_STATUS_AND_MESSAGE[code];
  return HttpResponse.json(
    { status, code, message: message ?? defaultMessage },
    { status },
  );
};

/** zod 실패를 서버 `@Valid` 실패처럼 필드별 사유를 이어 붙인 BAD_REQUEST 로 바꾼다 */
const badRequest = (issues: { path: (string | number)[]; message: string }[]) =>
  error(
    'BAD_REQUEST',
    issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', '),
  );

const findForm = (formId: number) => forms.find((f) => f.formId === formId);

const applicationCountOf = (formId: number) =>
  applications.filter((a) => a.formId === formId).length;

/** 공개 중이거나 신청이 1건 이상이면 잠긴다. 저장 전 상태로 판단한다 */
const isSlugLocked = (form: SeedOneTimeForm) =>
  form.isVisible || applicationCountOf(form.formId) > 0;

const toAdminForm = (form: SeedOneTimeForm): AdminOneTimeForm => ({
  ...form,
  applicationCount: applicationCountOf(form.formId),
  isSlugLocked: isSlugLocked(form),
});

// admin tsconfig 가 strict 가 아니라 zod 추론 타입의 필드가 모두 optional 이다
const bySortOrder = (a: { sortOrder?: number }, b: { sortOrder?: number }) =>
  a.sortOrder - b.sortOrder;

const liveQuestionsOf = (formId: number): AdminOneTimeFormQuestion[] =>
  questions
    .filter((q) => q.formId === formId && !q.isDeleted)
    .sort(bySortOrder)
    .map(({ formId: _formId, isDeleted: _isDeleted, ...q }) => q);

/** 삭제 안 된 그룹과 옵션. 숨긴 옵션(`isVisible=false`)은 준다 */
const liveOptionGroupsOf = (formId: number): AdminOneTimeFormOptionGroup[] =>
  optionGroups
    .filter((g) => g.formId === formId && !g.isDeleted)
    .sort(bySortOrder)
    .map(({ formId: _formId, isDeleted: _isDeleted, options, ...group }) => ({
      ...group,
      options: options
        .filter((o) => !o.isDeleted)
        .sort(bySortOrder)
        .map(({ isDeleted: _deleted, ...option }) => option),
    }));

/** 삭제된 것까지 sortOrder, 같으면 ID 오름차순(계약 A8 열 순서) */
const applicationQuestionsOf = (formId: number) =>
  questions
    .filter((q) => q.formId === formId)
    .sort((a, b) => bySortOrder(a, b) || a.questionId - b.questionId)
    .map(({ questionId, type, title, sortOrder, isDeleted }) => ({
      questionId,
      type,
      title,
      sortOrder,
      isDeleted,
    }));

const applicationOptionGroupsOf = (formId: number) =>
  optionGroups
    .filter((g) => g.formId === formId)
    .sort((a, b) => bySortOrder(a, b) || a.optionGroupId - b.optionGroupId)
    .map(({ optionGroupId, title, sortOrder, isDeleted }) => ({
      optionGroupId,
      title,
      sortOrder,
      isDeleted,
    }));

const applicationFormOf = (form: SeedOneTimeForm) => ({
  formId: form.formId,
  title: form.title,
  slug: form.slug,
  isPaid: form.isPaid,
});

const findApplication = (applicationId: number) =>
  applications.find((a) => a.applicationId === applicationId);

const isAttachmentAnswer = (
  value: unknown,
): value is { key: string; name: string } =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  'key' in value;

/** 브라우저가 그릴 수 있는 이미지. 실제 서버는 S3 서명 URL 을 준다 */
const MOCK_IMAGE_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160"><rect width="240" height="160" fill="#E4E4E7"/><text x="120" y="86" font-size="16" text-anchor="middle" fill="#5C5F66">MOCK IMAGE</text></svg>',
)}`;

const mockPresignedUrl = (key: string) =>
  `https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/${key}?X-Amz-Expires=600&X-Amz-Signature=mock`;

/** 취소 포함 전체, 신청일시 내림차순 */
const applicationsOf = (formId: number) =>
  applications
    .filter((a) => a.formId === formId)
    .sort((a, b) => b.createDate.localeCompare(a.createDate))
    .map(({ formId: _formId, ...application }) => application);

/** 스냅샷에 들어간(결제된 적 있는) 옵션은 빠져도 지우지 않고 숨긴다(계약 A7) */
const isOptionPaid = (optionId: number) =>
  applications.some((a) =>
    a.selectedOptions.some((s) => s.optionId === optionId),
  );

const isInvalidPeriod = (body: SaveOneTimeFormRequest) => {
  const start = new Date(body.startDate).getTime();
  const end = new Date(body.endDate).getTime();
  if (start >= end) return true;
  return (
    body.cancelDeadline !== null &&
    new Date(body.cancelDeadline).getTime() <= start
  );
};

/** 무료 폼은 서버가 기본 금액을 0 으로 저장한다 */
const toStoredFields = (body: SaveOneTimeFormRequest) => ({
  ...body,
  basePrice: body.isPaid ? body.basePrice : 0,
});

const hasInvalidChoices = (choices: string[] | null) =>
  !choices ||
  choices.length === 0 ||
  choices.some((c) => c.trim() === '') ||
  new Set(choices).size !== choices.length;

export const oneTimeFormHandlers = [
  // A1
  http.get(BASE, () => {
    const list = [...forms]
      .sort((a, b) => b.createDate.localeCompare(a.createDate))
      // 목록 항목에 없는 필드는 스키마가 걸러낸다
      .map((form) => adminOneTimeFormListItemSchema.parse(toAdminForm(form)));
    return HttpResponse.json({ data: { forms: list } });
  }),

  // A2
  http.post(BASE, async ({ request }) => {
    const parsed = saveOneTimeFormRequestSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) return badRequest(parsed.error.issues);
    const body = parsed.data;

    if (forms.some((f) => f.slug === body.slug)) {
      return error('ONE_TIME_FORM_SLUG_DUPLICATED');
    }
    if (isInvalidPeriod(body)) return error('ONE_TIME_FORM_INVALID_PERIOD');

    const formId = nextFormId++;
    forms = [
      ...forms,
      {
        ...toStoredFields(body),
        formId,
        createDate: new Date().toISOString().slice(0, 19),
      },
    ];
    return HttpResponse.json({ data: { formId } }, { status: 201 });
  }),

  // A3
  http.get(`${BASE}/:formId`, ({ params }) => {
    const formId = Number(params.formId);
    const form = findForm(formId);
    if (!form) return error('ONE_TIME_FORM_NOT_FOUND');

    return HttpResponse.json({
      data: {
        form: toAdminForm(form),
        questions: liveQuestionsOf(formId),
        optionGroups: liveOptionGroupsOf(formId),
      },
    });
  }),

  // A8
  http.get(`${BASE}/:formId/applications`, ({ params }) => {
    const formId = Number(params.formId);
    const form = findForm(formId);
    if (!form) return error('ONE_TIME_FORM_NOT_FOUND');

    return HttpResponse.json({
      data: {
        form: applicationFormOf(form),
        questions: applicationQuestionsOf(formId),
        optionGroups: applicationOptionGroupsOf(formId),
        applications: applicationsOf(formId),
      },
    });
  }),

  // A9 폼의 질문·그룹은 A8 처럼 삭제된 것까지 준다
  http.get(`${BASE}/application/:applicationId`, ({ params }) => {
    const found = findApplication(Number(params.applicationId));
    if (!found) return error('APPLICATION_NOT_FOUND');
    const { formId, ...application } = found;

    return HttpResponse.json({
      data: {
        form: applicationFormOf(findForm(formId)),
        questions: applicationQuestionsOf(formId),
        optionGroups: applicationOptionGroupsOf(formId),
        application,
      },
    });
  }),

  // A10 이미지 답은 미리보기가 그려지도록 데이터 URL 을 준다
  http.get(
    `${BASE}/application/:applicationId/files/:questionId`,
    ({ params }) => {
      const found = findApplication(Number(params.applicationId));
      if (!found) return error('APPLICATION_NOT_FOUND');

      const questionId = Number(params.questionId);
      const question = questions.find(
        (q) => q.questionId === questionId && q.formId === found.formId,
      );
      const answer = found.answers[String(questionId)];
      if (
        !question ||
        (question.type !== 'IMAGE' && question.type !== 'FILE') ||
        !isAttachmentAnswer(answer)
      ) {
        return error('ONE_TIME_FORM_FILE_NOT_FOUND');
      }

      const url =
        question.type === 'IMAGE'
          ? MOCK_IMAGE_URL
          : mockPresignedUrl(answer.key);
      return HttpResponse.json({ data: { url } });
    },
  ),

  // A11 전액 환불. 일회성 폼 신청만 받고, 나머지는 다음 핸들러(adminRefundHandlers)로 넘긴다(계약 13.2)
  http.post(
    '*/api/v1/admin/application/:applicationId/refund',
    async ({ params, request }) => {
      // 본문을 읽기 전에 거른다. 넘길 요청의 본문을 소비하지 않는다
      const found = findApplication(Number(params.applicationId));
      if (!found) return undefined;

      const body = (await request.json().catch(() => null)) as {
        managerName?: string;
        reason?: string;
      } | null;
      if (!body?.managerName?.trim()) return error('MANAGER_NAME_REQUIRED');
      if (!body.reason?.trim()) return error('REASON_REQUIRED');
      if (found.payment === null) return error('PAYMENT_NOT_FOUND');
      if (found.isCanceled) return error('APPLICATION_ALREADY_CANCELED');

      // 계약 A8: 취소면 refundAmount 가 환불액이다. 전액 환불이라 결제액과 같다
      found.isCanceled = true;
      found.canceledAt = new Date().toISOString().slice(0, 19);
      found.payment.refundAmount = found.payment.paidAmount;

      return HttpResponse.json({
        data: {
          refundedAmount: found.payment.paidAmount,
          canceledAt: found.canceledAt,
          // 0원 결제는 토스를 부르지 않아 결제 키가 없다
          paymentKey:
            found.payment.paidAmount === 0
              ? null
              : `tgen_mock_${found.payment.orderId}`,
          pendingManualRefundAmount: 0,
        },
      });
    },
  ),

  // A4
  http.put(`${BASE}/:formId`, async ({ params, request }) => {
    const formId = Number(params.formId);
    const form = findForm(formId);
    if (!form) return error('ONE_TIME_FORM_NOT_FOUND');

    const parsed = saveOneTimeFormRequestSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) return badRequest(parsed.error.issues);
    const body = parsed.data;

    if (body.slug !== form.slug) {
      if (isSlugLocked(form)) return error('ONE_TIME_FORM_SLUG_LOCKED');
      if (forms.some((f) => f.formId !== formId && f.slug === body.slug)) {
        return error('ONE_TIME_FORM_SLUG_DUPLICATED');
      }
    }
    if (isInvalidPeriod(body)) return error('ONE_TIME_FORM_INVALID_PERIOD');

    forms = forms.map((f) =>
      f.formId === formId ? { ...f, ...toStoredFields(body) } : f,
    );
    return HttpResponse.json({ data: null });
  }),

  // A5 하드 삭제. slug 를 다시 쓸 수 있게 풀린다
  http.delete(`${BASE}/:formId`, ({ params }) => {
    const formId = Number(params.formId);
    if (!findForm(formId)) return error('ONE_TIME_FORM_NOT_FOUND');
    if (applicationCountOf(formId) > 0) {
      return error('ONE_TIME_FORM_HAS_APPLICATIONS');
    }

    forms = forms.filter((f) => f.formId !== formId);
    questions = questions.filter((q) => q.formId !== formId);
    optionGroups = optionGroups.filter((g) => g.formId !== formId);
    return HttpResponse.json({ data: null });
  }),

  // A6
  http.put(`${BASE}/:formId/questions`, async ({ params, request }) => {
    const formId = Number(params.formId);
    if (!findForm(formId)) return error('ONE_TIME_FORM_NOT_FOUND');

    const parsed = saveOneTimeFormQuestionsRequestSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) return badRequest(parsed.error.issues);

    const existing = new Map(
      questions
        .filter((q) => q.formId === formId && !q.isDeleted)
        .map((q) => [q.questionId, q]),
    );

    // 모두 검증한 뒤에 바꾼다. 서버도 한 트랜잭션이라 중간에 실패하면 아무것도 저장되지 않는다
    for (const item of parsed.data.questions) {
      if (item.questionId !== null) {
        const saved = existing.get(item.questionId);
        if (!saved) return error('ONE_TIME_FORM_ITEM_NOT_IN_FORM');
        if (saved.type !== item.type) {
          return error('ONE_TIME_FORM_QUESTION_TYPE_LOCKED');
        }
      }
      if (
        CHOICE_QUESTION_TYPES.includes(item.type) &&
        hasInvalidChoices(item.choices)
      ) {
        return error('ONE_TIME_FORM_CHOICES_REQUIRED');
      }
    }

    const kept = new Set<number>();
    const saved = parsed.data.questions.map(
      (item, index): SeedOneTimeFormQuestion => {
        const questionId = item.questionId ?? nextQuestionId++;
        kept.add(questionId);
        return {
          ...item,
          questionId,
          choices: CHOICE_QUESTION_TYPES.includes(item.type)
            ? item.choices
            : null,
          sortOrder: index,
          formId,
          isDeleted: false,
        };
      },
    );

    // 빠진 질문은 소프트 삭제. 삭제 직전 sortOrder 를 남긴다(계약 A8)
    questions = [
      ...questions
        .filter((q) => !(q.formId === formId && kept.has(q.questionId)))
        .map((q) =>
          q.formId === formId && !q.isDeleted ? { ...q, isDeleted: true } : q,
        ),
      ...saved,
    ];

    return HttpResponse.json({
      data: { questions: liveQuestionsOf(formId) },
    });
  }),

  // A7
  http.put(`${BASE}/:formId/option-groups`, async ({ params, request }) => {
    const formId = Number(params.formId);
    if (!findForm(formId)) return error('ONE_TIME_FORM_NOT_FOUND');

    const parsed = saveOneTimeFormOptionGroupsRequestSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) return badRequest(parsed.error.issues);

    const existing = new Map(
      optionGroups
        .filter((g) => g.formId === formId && !g.isDeleted)
        .map((g) => [g.optionGroupId, g]),
    );

    // 다른 폼의 그룹, 다른 그룹의 옵션(그룹 간 이동 포함)은 거절한다
    for (const group of parsed.data.optionGroups) {
      if (group.optionGroupId === null) {
        if (group.options.some((o) => o.optionId !== null)) {
          return error('ONE_TIME_FORM_ITEM_NOT_IN_FORM');
        }
        continue;
      }
      const saved = existing.get(group.optionGroupId);
      if (!saved) return error('ONE_TIME_FORM_ITEM_NOT_IN_FORM');
      const ownOptionIds = new Set(
        saved.options.filter((o) => !o.isDeleted).map((o) => o.optionId),
      );
      if (
        group.options.some(
          (o) => o.optionId !== null && !ownOptionIds.has(o.optionId),
        )
      ) {
        return error('ONE_TIME_FORM_ITEM_NOT_IN_FORM');
      }
    }

    const keptGroupIds = new Set<number>();
    const saved = parsed.data.optionGroups.map(
      (group, groupIndex): SeedOneTimeFormOptionGroup => {
        const optionGroupId = group.optionGroupId ?? nextOptionGroupId++;
        keptGroupIds.add(optionGroupId);

        const options = group.options.map((option, index) => ({
          ...option,
          optionId: option.optionId ?? nextOptionId++,
          sortOrder: index,
          isDeleted: false,
        }));
        const keptOptionIds = new Set(options.map((o) => o.optionId));
        const dropped = (existing.get(optionGroupId)?.options ?? []).filter(
          (o) => !keptOptionIds.has(o.optionId),
        );
        // 결제된 옵션은 숨김으로 남아 저장 후 응답에 다시 나타난다. 순서는 보낸 옵션 뒤로 둔다
        const droppedOptions = dropped.map((o, index) =>
          !o.isDeleted && isOptionPaid(o.optionId)
            ? { ...o, isVisible: false, sortOrder: options.length + index }
            : { ...o, isDeleted: true },
        );

        return {
          ...group,
          optionGroupId,
          sortOrder: groupIndex,
          formId,
          isDeleted: false,
          options: [...options, ...droppedOptions],
        };
      },
    );

    optionGroups = [
      ...optionGroups
        .filter(
          (g) => !(g.formId === formId && keptGroupIds.has(g.optionGroupId)),
        )
        .map((g) =>
          g.formId === formId && !g.isDeleted ? { ...g, isDeleted: true } : g,
        ),
      ...saved,
    ];

    return HttpResponse.json({
      data: { optionGroups: liveOptionGroupsOf(formId) },
    });
  }),
];
