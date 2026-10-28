import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  adminOneTimeFormApplicationDetailSchema,
  adminOneTimeFormApplicationsSchema,
  adminOneTimeFormDetailSchema,
  adminOneTimeFormListSchema,
  adminOneTimeFormOptionGroupsSchema,
  adminOneTimeFormQuestionsSchema,
  createOneTimeFormResponseSchema,
  oneTimeFormFileUrlSchema,
  type SaveOneTimeFormRequest,
} from '@/api/one-time-form/oneTimeFormSchema';

import { oneTimeFormHandlers, resetOneTimeFormMock } from './oneTimeForm';

/**
 * 서버가 붙기 전까지 이 목이 어드민 폼 설정 화면의 백엔드다. 저장이 다음 조회에 반영되고,
 * 화면이 갈래를 나눠야 하는 에러 코드가 계약 10절 그대로 오는지 확인한다.
 */

const BASE = 'http://localhost/api/v1/admin/one-time-form';
const server = setupServer(...oneTimeFormHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetOneTimeFormMock();
});
afterAll(() => server.close());

const send = (method: string, path: string, body?: unknown) =>
  fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const expectError = async (res: Response, status: number, code: string) => {
  const body = (await res.json()) as { status: number; code: string };
  expect(res.status).toBe(status);
  expect(body).toMatchObject({ status, code });
};

const fetchList = async () => {
  const res = await send('GET', '');
  const body = (await res.json()) as { data: unknown };
  return adminOneTimeFormListSchema.parse(body.data);
};

const fetchDetail = async (formId: number) => {
  const res = await send('GET', `/${formId}`);
  const body = (await res.json()) as { data: unknown };
  return adminOneTimeFormDetailSchema.parse(body.data);
};

const newForm = (
  over: Partial<SaveOneTimeFormRequest> = {},
): SaveOneTimeFormRequest => ({
  title: '새 폼',
  slug: 'new-form',
  categoryText: null,
  scheduleText: null,
  thumbnailUrl: null,
  isVisible: false,
  startDate: '2026-12-01T00:00:00',
  endDate: '2026-12-10T23:59:59',
  cancelDeadline: null,
  isPaid: true,
  basePrice: 10000,
  paymentProductName: null,
  completionMessage: null,
  ...over,
});

/** 시드 폼 7 을 A4 본문으로 바꾼 것 */
const form7Body = async (): Promise<SaveOneTimeFormRequest> => {
  const {
    formId: _formId,
    applicationCount: _count,
    isSlugLocked: _locked,
    createDate: _createDate,
    ...body
  } = (await fetchDetail(7)).form;
  return body;
};

const createForm = async (over: Partial<SaveOneTimeFormRequest> = {}) => {
  const res = await send('POST', '', newForm(over));
  const body = (await res.json()) as { data: unknown };
  return createOneTimeFormResponseSchema.parse(body.data).formId;
};

describe('A1 GET /admin/one-time-form', () => {
  it('시드 폼 3개를 생성일 내림차순으로 준다', async () => {
    const { forms } = await fetchList();

    expect(forms.map((f) => f.formId)).toEqual([8, 7, 9]);
    expect(forms.find((f) => f.formId === 7)?.applicationCount).toBe(2);
  });
});

describe('A3 GET /admin/one-time-form/:formId', () => {
  it('폼 7 은 삭제된 질문 100 을 빼고 질문 10개, 옵션 그룹 2개를 준다', async () => {
    const { form, questions, optionGroups } = await fetchDetail(7);

    expect(form.isSlugLocked).toBe(true);
    expect(questions.map((q) => q.questionId)).toEqual([
      101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
    ]);
    expect(optionGroups.map((g) => g.optionGroupId)).toEqual([31, 32]);
  });

  it('폼 9 는 비공개지만 신청이 있어 slug 가 잠긴다', async () => {
    const { form, questions } = await fetchDetail(9);

    expect(form.isVisible).toBe(false);
    expect(form.isSlugLocked).toBe(true);
    expect(questions).toEqual([]);
  });

  it('없는 폼은 404 ONE_TIME_FORM_NOT_FOUND', async () => {
    await expectError(
      await send('GET', '/999'),
      404,
      'ONE_TIME_FORM_NOT_FOUND',
    );
  });
});

describe('A2 POST /admin/one-time-form', () => {
  it('201 과 새 formId 를 주고 목록에 나타난다', async () => {
    const res = await send('POST', '', newForm());
    const body = (await res.json()) as { data: unknown };
    const { formId } = createOneTimeFormResponseSchema.parse(body.data);

    expect(res.status).toBe(201);
    expect((await fetchList()).forms.some((f) => f.formId === formId)).toBe(
      true,
    );
  });

  it('무료 폼은 기본 금액을 0 으로 저장한다', async () => {
    const formId = await createForm({ isPaid: false, basePrice: 5000 });

    expect((await fetchDetail(formId)).form.basePrice).toBe(0);
  });

  it('다른 폼이 쓰는 slug 는 409 ONE_TIME_FORM_SLUG_DUPLICATED', async () => {
    await expectError(
      await send('POST', '', newForm({ slug: 'portfolio-1115' })),
      409,
      'ONE_TIME_FORM_SLUG_DUPLICATED',
    );
  });

  it('시작이 종료보다 늦으면 400 ONE_TIME_FORM_INVALID_PERIOD', async () => {
    await expectError(
      await send(
        'POST',
        '',
        newForm({
          startDate: '2026-12-10T00:00:00',
          endDate: '2026-12-01T00:00:00',
        }),
      ),
      400,
      'ONE_TIME_FORM_INVALID_PERIOD',
    );
  });

  it('취소 마감이 시작 이전이면 400 ONE_TIME_FORM_INVALID_PERIOD', async () => {
    await expectError(
      await send(
        'POST',
        '',
        newForm({ cancelDeadline: '2026-12-01T00:00:00' }),
      ),
      400,
      'ONE_TIME_FORM_INVALID_PERIOD',
    );
  });

  it('필수 누락과 slug 형식은 400 BAD_REQUEST', async () => {
    const { title: _title, ...withoutTitle } = newForm();

    await expectError(await send('POST', '', withoutTitle), 400, 'BAD_REQUEST');
    await expectError(
      await send('POST', '', newForm({ slug: 'New Form' })),
      400,
      'BAD_REQUEST',
    );
  });
});

describe('A4 PUT /admin/one-time-form/:formId', () => {
  it('저장한 값이 다음 조회에 반영된다', async () => {
    const res = await send('PUT', '/7', {
      ...(await form7Body()),
      title: '바뀐 제목',
      thumbnailUrl: null,
    });

    expect(res.status).toBe(200);
    const { form } = await fetchDetail(7);
    expect(form.title).toBe('바뀐 제목');
    expect(form.thumbnailUrl).toBeNull();
  });

  it('잠긴 폼의 slug 를 바꾸면 400 ONE_TIME_FORM_SLUG_LOCKED', async () => {
    await expectError(
      await send('PUT', '/7', { ...(await form7Body()), slug: 'other-slug' }),
      400,
      'ONE_TIME_FORM_SLUG_LOCKED',
    );
  });

  it('공개를 끄면서 slug 를 바꿔도 저장 전 상태로 판단해 거절한다', async () => {
    const formId = await createForm({ isVisible: true });

    await expectError(
      await send(
        'PUT',
        `/${formId}`,
        newForm({ isVisible: false, slug: 'renamed' }),
      ),
      400,
      'ONE_TIME_FORM_SLUG_LOCKED',
    );
  });

  it('잠기지 않은 폼은 slug 를 바꿀 수 있지만 다른 폼의 slug 는 409', async () => {
    const formId = await createForm();

    expect(
      (await send('PUT', `/${formId}`, newForm({ slug: 'renamed' }))).status,
    ).toBe(200);
    await expectError(
      await send('PUT', `/${formId}`, newForm({ slug: 'seminar-1130' })),
      409,
      'ONE_TIME_FORM_SLUG_DUPLICATED',
    );
  });

  it('없는 폼은 404', async () => {
    await expectError(
      await send('PUT', '/999', newForm()),
      404,
      'ONE_TIME_FORM_NOT_FOUND',
    );
  });
});

describe('A5 DELETE /admin/one-time-form/:formId', () => {
  it('신청이 있는 폼은 409 ONE_TIME_FORM_HAS_APPLICATIONS', async () => {
    await expectError(
      await send('DELETE', '/8'),
      409,
      'ONE_TIME_FORM_HAS_APPLICATIONS',
    );
  });

  it('신청이 없는 폼은 지워지고 slug 를 다시 쓸 수 있다', async () => {
    const formId = await createForm();

    expect((await send('DELETE', `/${formId}`)).status).toBe(200);
    expect((await send('GET', `/${formId}`)).status).toBe(404);
    expect((await send('POST', '', newForm())).status).toBe(201);
  });
});

describe('A6 PUT /admin/one-time-form/:formId/questions', () => {
  const saveQuestions = (formId: number, questions: unknown[]) =>
    send('PUT', `/${formId}/questions`, { questions });

  it('생성·수정·삭제·순서가 한 번에 반영된다', async () => {
    const res = await saveQuestions(7, [
      {
        questionId: 102,
        type: 'DROPDOWN',
        title: '현재 상태(수정)',
        description: null,
        isRequired: false,
        choices: ['재학', '졸업'],
      },
      {
        questionId: null,
        type: 'SHORT_TEXT',
        title: '추천인',
        description: '없으면 비워 두세요.',
        isRequired: false,
        // 선택형이 아니면 보낸 값과 상관없이 null 로 저장된다
        choices: ['무시됨'],
      },
    ]);
    const body = (await res.json()) as { data: unknown };
    const { questions } = adminOneTimeFormQuestionsSchema.parse(body.data);

    expect(res.status).toBe(200);
    expect(questions).toHaveLength(2);
    expect(questions[0]).toMatchObject({
      questionId: 102,
      title: '현재 상태(수정)',
      sortOrder: 0,
    });
    expect(questions[1].questionId).toBeGreaterThan(201);
    expect(questions[1]).toMatchObject({ choices: null, sortOrder: 1 });
    expect((await fetchDetail(7)).questions).toEqual(questions);
  });

  it('저장된 질문의 형식을 바꾸면 400 ONE_TIME_FORM_QUESTION_TYPE_LOCKED', async () => {
    await expectError(
      await saveQuestions(7, [
        {
          questionId: 101,
          type: 'DROPDOWN',
          title: '희망 직무',
          description: null,
          isRequired: true,
          choices: ['프론트엔드'],
        },
      ]),
      400,
      'ONE_TIME_FORM_QUESTION_TYPE_LOCKED',
    );
  });

  it.each([
    ['비었다', []],
    ['null 이다', null],
    ['빈 문자열이 있다', ['월', ' ']],
    ['중복이 있다', ['월', '월']],
  ])(
    '선택형인데 선택지가 %s 면 400 ONE_TIME_FORM_CHOICES_REQUIRED',
    async (_, choices) => {
      await expectError(
        await saveQuestions(8, [
          {
            questionId: null,
            type: 'CHECKBOX',
            title: '요일',
            description: null,
            isRequired: false,
            choices,
          },
        ]),
        400,
        'ONE_TIME_FORM_CHOICES_REQUIRED',
      );
    },
  );

  it('다른 폼의 질문이나 삭제된 질문은 400 ONE_TIME_FORM_ITEM_NOT_IN_FORM', async () => {
    const question = (questionId: number) => ({
      questionId,
      type: 'SHORT_TEXT',
      title: '이전 질문',
      description: null,
      isRequired: false,
      choices: null,
    });

    await expectError(
      await saveQuestions(8, [{ ...question(101), type: 'RADIO' }]),
      400,
      'ONE_TIME_FORM_ITEM_NOT_IN_FORM',
    );
    await expectError(
      await saveQuestions(7, [question(100)]),
      400,
      'ONE_TIME_FORM_ITEM_NOT_IN_FORM',
    );
  });

  it('검증에 실패하면 아무것도 저장되지 않는다', async () => {
    await saveQuestions(7, [
      {
        questionId: null,
        type: 'SHORT_TEXT',
        title: '새 질문',
        description: null,
        isRequired: false,
        choices: null,
      },
      {
        questionId: 101,
        type: 'URL',
        title: '희망 직무',
        description: null,
        isRequired: true,
        choices: null,
      },
    ]);

    expect((await fetchDetail(7)).questions).toHaveLength(10);
  });
});

describe('A7 PUT /admin/one-time-form/:formId/option-groups', () => {
  const saveGroups = (formId: number, optionGroups: unknown[]) =>
    send('PUT', `/${formId}/option-groups`, { optionGroups });

  const option = (optionId: number | null, name: string, price = 0) => ({
    optionId,
    name,
    description: null,
    additionalPrice: price,
    badge: null,
    isVisible: true,
  });

  const group31 = (options: unknown[]) => ({
    optionGroupId: 31,
    title: '참여 방식을 골라 주세요',
    description: '현장 참여는 강남역 인근 강의실에서 진행해요.',
    selectType: 'SINGLE',
    isRequired: true,
    options,
  });

  it('계약 예시대로 저장하면 새 옵션이 생기고 그룹 32 는 삭제된다', async () => {
    const res = await saveGroups(7, [
      group31([
        option(311, '온라인 라이브'),
        { ...option(null, '현장 + 뒤풀이', 15000), badge: '신규' },
      ]),
    ]);
    const body = (await res.json()) as { data: unknown };
    const { optionGroups } = adminOneTimeFormOptionGroupsSchema.parse(
      body.data,
    );

    expect(res.status).toBe(200);
    expect(optionGroups.map((g) => g.optionGroupId)).toEqual([31]);
    const [online, party] = optionGroups[0].options;
    expect(online).toMatchObject({ optionId: 311, sortOrder: 0 });
    expect(party).toMatchObject({
      name: '현장 + 뒤풀이',
      additionalPrice: 15000,
      badge: '신규',
      sortOrder: 1,
    });
    expect((await fetchDetail(7)).optionGroups).toEqual(optionGroups);
  });

  it('결제된 적 있는 옵션은 빠져도 숨김으로 다시 나타난다', async () => {
    // 312 는 신청 1043 의 스냅샷에 있다
    const res = await saveGroups(7, [group31([option(311, '온라인 라이브')])]);
    const body = (await res.json()) as { data: unknown };
    const { optionGroups } = adminOneTimeFormOptionGroupsSchema.parse(
      body.data,
    );

    const hidden = optionGroups[0].options.find((o) => o.optionId === 312);
    expect(hidden?.isVisible).toBe(false);
  });

  it('결제된 적 없는 옵션은 빠지면 삭제된다', async () => {
    const res = await saveGroups(7, [
      group31([
        option(311, '온라인 라이브'),
        option(312, '오프라인 현장 참여'),
      ]),
      {
        optionGroupId: 32,
        title: '함께 신청하면 좋아요',
        description: null,
        selectType: 'MULTIPLE',
        isRequired: false,
        options: [option(321, '포트폴리오 1:1 첨삭', 20000)],
      },
    ]);
    const body = (await res.json()) as { data: unknown };
    const { optionGroups } = adminOneTimeFormOptionGroupsSchema.parse(
      body.data,
    );

    expect(optionGroups[1].options.map((o) => o.optionId)).toEqual([321]);
  });

  it('다른 그룹의 옵션을 옮기면 400 ONE_TIME_FORM_ITEM_NOT_IN_FORM', async () => {
    await expectError(
      await saveGroups(7, [group31([option(321, '포트폴리오 1:1 첨삭')])]),
      400,
      'ONE_TIME_FORM_ITEM_NOT_IN_FORM',
    );
  });

  it('다른 폼의 그룹은 400 ONE_TIME_FORM_ITEM_NOT_IN_FORM', async () => {
    await expectError(
      await saveGroups(9, [group31([])]),
      400,
      'ONE_TIME_FORM_ITEM_NOT_IN_FORM',
    );
  });

  it('추가 금액이 음수면 400 BAD_REQUEST', async () => {
    await expectError(
      await saveGroups(7, [group31([option(311, '온라인 라이브', -1)])]),
      400,
      'BAD_REQUEST',
    );
  });

  it('없는 폼은 404', async () => {
    await expectError(
      await saveGroups(999, []),
      404,
      'ONE_TIME_FORM_NOT_FOUND',
    );
  });
});

describe('A8 GET /admin/one-time-form/:formId/applications', () => {
  const fetchApplications = async (formId: number) => {
    const res = await send('GET', `/${formId}/applications`);
    const body = (await res.json()) as { data: unknown };
    return adminOneTimeFormApplicationsSchema.parse(body.data);
  };

  it('폼 7 은 취소 포함 2건을 신청일시 내림차순으로 준다', async () => {
    const { form, applications } = await fetchApplications(7);

    expect(form).toEqual({
      formId: 7,
      title: '현직자와 함께하는 포트폴리오 집중 클래스',
      slug: 'portfolio-1115',
      isPaid: true,
    });
    expect(applications.map((a) => a.applicationId)).toEqual([1043, 1042]);
    expect(applications[0]).toMatchObject({
      isCanceled: true,
      canceledAt: '2026-11-03T14:02:00',
      payment: { paidAmount: 39000, refundAmount: 39000 },
    });
  });

  it('질문은 삭제된 100 을 포함해 sortOrder, questionId 순으로 준다', async () => {
    const { questions } = await fetchApplications(7);

    expect(questions.map((q) => q.questionId)).toEqual([
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
    ]);
    expect(questions[0]).toEqual({
      questionId: 100,
      type: 'SHORT_TEXT',
      title: '이전 질문',
      sortOrder: 0,
      isDeleted: true,
    });
  });

  it('A6 에서 지운 질문과 A7 에서 지운 그룹도 isDeleted 로 남는다', async () => {
    const { questions: live } = await fetchDetail(7);
    await send('PUT', '/7/questions', {
      questions: live
        .filter((q) => q.questionId !== 108)
        .map(({ sortOrder: _sortOrder, ...q }) => q),
    });
    await send('PUT', '/7/option-groups', { optionGroups: [] });

    const { questions, optionGroups } = await fetchApplications(7);
    expect(questions.find((q) => q.questionId === 108)).toMatchObject({
      sortOrder: 7,
      isDeleted: true,
    });
    expect(optionGroups.map((g) => [g.optionGroupId, g.isDeleted])).toEqual([
      [31, true],
      [32, true],
    ]);
  });

  it('무료 폼 8 의 신청은 payment 가 null 이다', async () => {
    const { form, applications } = await fetchApplications(8);

    expect(form.isPaid).toBe(false);
    expect(applications).toHaveLength(1);
    expect(applications[0]).toMatchObject({
      applicationId: 1044,
      payment: null,
      selectedOptions: [],
    });
  });

  it('0원 결제 폼 9 의 신청은 0원 결제 기록을 준다', async () => {
    const { applications } = await fetchApplications(9);

    expect(applications[0]).toMatchObject({
      applicationId: 1050,
      payment: { orderId: 'letsZERO0001', paidAmount: 0, refundAmount: 0 },
      answers: {},
    });
  });

  it('없는 폼은 404 ONE_TIME_FORM_NOT_FOUND', async () => {
    const res = await send('GET', '/999/applications');

    await expectError(res, 404, 'ONE_TIME_FORM_NOT_FOUND');
  });
});

describe('A9 GET /admin/one-time-form/application/:applicationId', () => {
  const fetchApplication = async (applicationId: number) => {
    const res = await send('GET', `/application/${applicationId}`);
    const body = (await res.json()) as { data: unknown };
    return adminOneTimeFormApplicationDetailSchema.parse(body.data);
  };

  it('신청 1042 를 폼, 삭제 질문을 포함한 질문, 옵션 그룹과 함께 준다', async () => {
    const { form, questions, optionGroups, application } =
      await fetchApplication(1042);

    expect(form).toEqual({
      formId: 7,
      title: '현직자와 함께하는 포트폴리오 집중 클래스',
      slug: 'portfolio-1115',
      isPaid: true,
    });
    expect(questions.map((q) => [q.questionId, q.isDeleted])).toContainEqual([
      100,
      true,
    ]);
    expect(questions).toHaveLength(11);
    expect(optionGroups.map((g) => g.optionGroupId)).toEqual([31, 32]);
    expect(application).toMatchObject({
      applicationId: 1042,
      name: '김렛커',
      answers: { '100': '삭제 전 답', '103': ['월', '수'] },
    });
    expect(application).not.toHaveProperty('formId');
  });

  it('무료 폼 신청 1044 는 payment 가 null 이고 폼 8 의 질문만 준다', async () => {
    const { questions, application } = await fetchApplication(1044);

    expect(application.payment).toBeNull();
    expect(questions.map((q) => q.questionId)).toEqual([201]);
  });

  it('없는 신청은 404 APPLICATION_NOT_FOUND', async () => {
    await expectError(
      await send('GET', '/application/9999'),
      404,
      'APPLICATION_NOT_FOUND',
    );
  });
});

describe('A10 GET /admin/one-time-form/application/:applicationId/files/:questionId', () => {
  const fetchFileUrl = async (applicationId: number, questionId: number) => {
    const res = await send(
      'GET',
      `/application/${applicationId}/files/${questionId}`,
    );
    const body = (await res.json()) as { data: unknown };
    return oneTimeFormFileUrlSchema.parse(body.data).url;
  };

  it('파일 답은 저장된 키로 만든 서명 URL 을 준다', async () => {
    const url = await fetchFileUrl(1042, 110);

    expect(url).toContain(
      'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
    );
    expect(url).toContain('X-Amz-Signature=');
  });

  it('이미지 답은 브라우저가 그릴 수 있는 URL 을 준다', async () => {
    expect(await fetchFileUrl(1043, 109)).toMatch(/^data:image\/svg\+xml/);
  });

  it('없는 신청은 404 APPLICATION_NOT_FOUND', async () => {
    await expectError(
      await send('GET', '/application/9999/files/110'),
      404,
      'APPLICATION_NOT_FOUND',
    );
  });

  it.each([
    ['답하지 않은 첨부 질문', 1042, 109],
    ['첨부가 아닌 질문', 1042, 101],
    ['다른 폼의 질문', 1044, 110],
  ])(
    '%s 는 404 ONE_TIME_FORM_FILE_NOT_FOUND',
    async (_, applicationId, qId) => {
      await expectError(
        await send('GET', `/application/${applicationId}/files/${qId}`),
        404,
        'ONE_TIME_FORM_FILE_NOT_FOUND',
      );
    },
  );
});
