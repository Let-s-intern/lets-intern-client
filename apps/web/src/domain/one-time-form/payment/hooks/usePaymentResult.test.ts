import {
  fetchMyOneTimeFormApplication,
  useCreateOneTimeFormApplicationMutation,
} from '@/api/one-time-form/oneTimeForm';
import type { MyOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';
// 패키지 entry(@letscareer/api) 는 jest 에서 import.meta 로 깨진다. ApiError 만 서브경로로 가져온다
import { ApiError } from '@letscareer/api/errors';
import { renderHook, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import {
  draftStorageKey,
  readDraft,
  saveDraft,
  type OneTimeFormDraft,
} from '../../utils/applicationDraft';
import { saveUtmOnce, utmStorageKey } from '../../utils/utmStorage';
import {
  parsePaymentResultQuery,
  type PaymentResultQuery,
} from '../utils/paymentResult';
import usePaymentResult from './usePaymentResult';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  ONE_TIME_FORM_ALREADY_APPLIED: 'ONE_TIME_FORM_ALREADY_APPLIED',
  getOneTimeFormErrorCode: (error: { code?: string } | null) => error?.code,
  useCreateOneTimeFormApplicationMutation: jest.fn(),
  fetchMyOneTimeFormApplication: jest.fn(),
}));

const SLUG = 'portfolio-1115';
const mutateAsync = jest.fn();
const fetchMy = fetchMyOneTimeFormApplication as jest.Mock;

const QUERY: PaymentResultQuery = {
  paymentKey: 'tgen_20261102132355abcd',
  orderId: 'letsXk29Pq8812',
  amount: 49000,
};

// 계약 13.3 폼 7, 11.4 보관값
const DRAFT: OneTimeFormDraft = {
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptionIds: [311, 321],
  answers: { '101': '프론트엔드', '103': ['월', '수'] },
  orderId: 'letsXk29Pq8812',
  amount: 49000,
};

const MY_APPLICATION = {
  applicationId: 1042,
  createDate: '2026-11-02T13:24:00',
  isCanceled: false,
  canceledAt: null,
  isCancelable: true,
  cancelDeadline: '2026-11-10T23:59:59',
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptions: [],
  payment: { paidAmount: 49000, refundAmount: 0, paymentMethod: '카드' },
  answerItems: [],
} as unknown as NonNullable<MyOneTimeFormApplication>;

const apiError = (code: string, serverMessage: string) =>
  Object.assign(Object.create(ApiError.prototype), { code, serverMessage });

const statusError = (status: number) =>
  new ApiError({
    status,
    code: 'API_ERROR',
    message: `Request failed with status code ${status}`,
    endpoint: `/one-time-form/${SLUG}/applications`,
    method: 'POST',
  });

// 로그인 뒤 같은 토스 쿼리로 결제 결과 처리에 돌아온다
const LOGIN_AND_RETURN_PATH = `/login?redirect=${encodeURIComponent(
  `/form/${SLUG}/payment/result?paymentKey=${QUERY.paymentKey}&orderId=${QUERY.orderId}&amount=${QUERY.amount}`,
)}`;

const renderResult = (query: PaymentResultQuery | null = QUERY) =>
  renderHook(() => usePaymentResult(SLUG, query));

beforeEach(() => {
  window.sessionStorage.clear();
  replace.mockClear();
  mutateAsync.mockReset();
  fetchMy.mockReset();
  (useCreateOneTimeFormApplicationMutation as jest.Mock).mockReturnValue({
    mutateAsync,
  });
});

describe('usePaymentResult', () => {
  it('보관값과 쿼리로 U3 를 부르고, 성공하면 보관값을 지우고 완료로 간다', async () => {
    saveDraft(SLUG, DRAFT);
    saveUtmOnce(SLUG, {
      utmSource: 'instagram',
      utmMedium: 'paid',
      utmCampaign: 'portfolio_1115',
      utmContent: 'story_a',
      utmTerm: null,
      referrer: 'https://event-xxx.vercel.app/',
    });
    mutateAsync.mockResolvedValue({ applicationId: 1042 });

    renderResult();

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(`/form/${SLUG}/complete`),
    );
    expect(mutateAsync).toHaveBeenCalledWith({
      name: '김렛커',
      email: 'letscareer@example.com',
      phoneNum: '010-1234-5678',
      selectedOptionIds: [311, 321],
      answers: { '101': '프론트엔드', '103': ['월', '수'] },
      utmSource: 'instagram',
      utmMedium: 'paid',
      utmCampaign: 'portfolio_1115',
      utmContent: 'story_a',
      utmTerm: null,
      referrer: 'https://event-xxx.vercel.app/',
      payment: QUERY,
    });
    expect(window.sessionStorage.getItem(draftStorageKey(SLUG))).toBeNull();
    expect(window.sessionStorage.getItem(utmStorageKey(SLUG))).toBeNull();
  });

  it('금액 불일치 응답이면 보관값을 두고 안내와 함께 결제 단계로 간다', async () => {
    saveDraft(SLUG, DRAFT);
    mutateAsync.mockRejectedValue(
      apiError(
        'ONE_TIME_FORM_PRICE_MISMATCH',
        '결제 금액이 폼 설정과 다릅니다.',
      ),
    );

    renderResult();

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
    const url = new URL(replace.mock.calls[0][0], 'https://x');
    expect(url.pathname).toBe(`/form/${SLUG}/payment`);
    expect(url.searchParams.get('code')).toBe('ONE_TIME_FORM_PRICE_MISMATCH');
    expect(url.searchParams.get('message')).toBe(
      '결제 금액이 폼 설정과 다릅니다.',
    );
    expect(readDraft(SLUG)).toEqual(DRAFT);
  });

  it.each([401, 403])(
    'U3 가 %i 이면 보관값을 두고 결제 결과로 돌아오는 로그인으로 간다',
    async (status) => {
      saveDraft(SLUG, DRAFT);
      mutateAsync.mockRejectedValue(statusError(status));

      renderResult();

      await waitFor(() =>
        expect(replace).toHaveBeenCalledWith(LOGIN_AND_RETURN_PATH),
      );
      expect(readDraft(SLUG)).toEqual(DRAFT);
    },
  );

  it('보관값이 없을 때 U2 가 403 이면 결제 결과로 돌아오는 로그인으로 간다', async () => {
    fetchMy.mockRejectedValue(statusError(403));

    renderResult();

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(LOGIN_AND_RETURN_PATH),
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('보관한 주문번호와 쿼리 주문번호가 다르면 U3 없이 결제 단계로 돌려보낸다', async () => {
    saveDraft(SLUG, { ...DRAFT, orderId: 'letsOtherOrder' });

    renderResult();

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
    const url = new URL(replace.mock.calls[0][0], 'https://x');
    expect(url.pathname).toBe(`/form/${SLUG}/payment`);
    expect(url.searchParams.get('code')).toBeTruthy();
    expect(url.searchParams.get('message')).toBeTruthy();
    expect(mutateAsync).not.toHaveBeenCalled();
    expect(readDraft(SLUG)).not.toBeNull();
  });

  it('이미 신청한 폼이면 보관값을 지우고 완료로 간다', async () => {
    saveDraft(SLUG, DRAFT);
    mutateAsync.mockRejectedValue(
      apiError('ONE_TIME_FORM_ALREADY_APPLIED', '이미 신청한 폼입니다.'),
    );

    renderResult();

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(`/form/${SLUG}/complete`),
    );
    expect(readDraft(SLUG)).toBeNull();
  });

  it('strict mode 의 effect 두 번 실행과 리렌더에도 U3 는 한 번만 부른다', async () => {
    saveDraft(SLUG, DRAFT);
    mutateAsync.mockResolvedValue({ applicationId: 1042 });

    const { rerender } = renderHook(() => usePaymentResult(SLUG, QUERY), {
      wrapper: StrictMode,
    });
    rerender();
    rerender();

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenCalledTimes(1);
  });

  it('보관값이 없고 취소 안 된 신청이 있으면 U3 없이 완료로 간다', async () => {
    fetchMy.mockResolvedValue(MY_APPLICATION);

    renderResult();

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(`/form/${SLUG}/complete`),
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('보관값이 없고 신청도 없으면 정보 입력으로 간다', async () => {
    fetchMy.mockResolvedValue(null);

    renderResult();

    await waitFor(() => expect(replace).toHaveBeenCalledWith(`/form/${SLUG}`));
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('보관값이 없고 신청이 취소된 것뿐이면 정보 입력으로 간다', async () => {
    fetchMy.mockResolvedValue({ ...MY_APPLICATION, isCanceled: true });

    renderResult();

    await waitFor(() => expect(replace).toHaveBeenCalledWith(`/form/${SLUG}`));
  });

  it('쿼리가 없거나 잘못되면 결제 단계로 간다', async () => {
    saveDraft(SLUG, DRAFT);

    renderResult(null);

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(`/form/${SLUG}/payment`),
    );
    expect(mutateAsync).not.toHaveBeenCalled();
    expect(fetchMy).not.toHaveBeenCalled();
  });
});

describe('parsePaymentResultQuery', () => {
  it('세 값이 모두 있으면 금액을 숫자로 바꾼다', () => {
    expect(
      parsePaymentResultQuery({
        paymentKey: 'tgen_1',
        orderId: 'letsA',
        amount: '49000',
      }),
    ).toEqual({ paymentKey: 'tgen_1', orderId: 'letsA', amount: 49000 });
  });

  it.each([
    [{ orderId: 'letsA', amount: '49000' }],
    [{ paymentKey: 'tgen_1', amount: '49000' }],
    [{ paymentKey: 'tgen_1', orderId: 'letsA' }],
    [{ paymentKey: 'tgen_1', orderId: 'letsA', amount: 'abc' }],
    [{ paymentKey: 'tgen_1', orderId: 'letsA', amount: '0' }],
    [{ paymentKey: ['a', 'b'], orderId: 'letsA', amount: '49000' }],
  ])('빠지거나 형식이 다르면 null (%o)', (raw) => {
    expect(parsePaymentResultQuery(raw)).toBeNull();
  });
});
