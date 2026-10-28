import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import type { AdminOneTimeForm } from '@/api/one-time-form/oneTimeFormSchema';

import { getOneTimeFormSaveErrorFeedback } from './oneTimeFormSaveError';
import {
  DEFAULT_ONE_TIME_FORM_SETTINGS,
  toOneTimeFormSettingsValues,
  toSaveOneTimeFormRequest,
} from './oneTimeFormSettingsValues';

const form: AdminOneTimeForm = {
  formId: 7,
  title: '포트폴리오 집중 클래스',
  slug: 'portfolio-1115',
  categoryText: null,
  scheduleText: '11.15(토) 14:00',
  thumbnailUrl: null,
  isVisible: true,
  startDate: '2026-11-01T00:00:00',
  endDate: '2026-11-10T23:59:59',
  cancelDeadline: null,
  isPaid: true,
  basePrice: 29000,
  paymentProductName: null,
  completionMessage: null,
  applicationCount: 3,
  isSlugLocked: true,
  createDate: '2026-10-20T10:00:00',
};

describe('입력 상태와 A2·A4 본문 변환', () => {
  it('A3 값을 읽어 다시 저장하면 같은 값이 나간다', () => {
    expect(toSaveOneTimeFormRequest(toOneTimeFormSettingsValues(form))).toEqual(
      {
        title: form.title,
        slug: form.slug,
        categoryText: null,
        scheduleText: '11.15(토) 14:00',
        thumbnailUrl: null,
        isVisible: true,
        startDate: form.startDate,
        endDate: form.endDate,
        cancelDeadline: null,
        isPaid: true,
        basePrice: 29000,
        paymentProductName: null,
        completionMessage: null,
      },
    );
  });

  it('새 폼은 무료·0원·상품명 null 로 나간다', () => {
    const body = toSaveOneTimeFormRequest(DEFAULT_ONE_TIME_FORM_SETTINGS);
    expect(body).toMatchObject({
      isPaid: false,
      basePrice: 0,
      paymentProductName: null,
      isVisible: false,
    });
  });

  it('공백만 있는 선택 문구는 null 로 보낸다', () => {
    const body = toSaveOneTimeFormRequest({
      ...DEFAULT_ONE_TIME_FORM_SETTINGS,
      categoryText: '  ',
      cancelDeadline: '',
    });
    expect(body.categoryText).toBeNull();
    expect(body.cancelDeadline).toBeNull();
  });
});

describe('getOneTimeFormSaveErrorFeedback', () => {
  const axiosErrorOf = (status: number, code: string) =>
    new AxiosError('fail', String(status), undefined, undefined, {
      status,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: { status, code, message: '' },
    });

  it.each([
    [409, 'ONE_TIME_FORM_SLUG_DUPLICATED', 'slug', /이미 다른 폼이 쓰는 주소/],
    [400, 'ONE_TIME_FORM_SLUG_LOCKED', 'slug', /주소를 바꿀 수 없습니다/],
    [400, 'ONE_TIME_FORM_INVALID_PERIOD', 'endDate', /기간 설정/],
  ])('%i %s 는 %s 칸에 보인다', (status, code, field, message) => {
    const feedback = getOneTimeFormSaveErrorFeedback(
      axiosErrorOf(status, code),
    );
    expect(feedback.field).toBe(field);
    expect(feedback.message).toMatch(message);
  });

  it('모르는 오류는 일반 문구만 보인다', () => {
    expect(getOneTimeFormSaveErrorFeedback(new Error('x'))).toEqual({
      message: '저장하지 못했습니다.',
    });
  });
});
