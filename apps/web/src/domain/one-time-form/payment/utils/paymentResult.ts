import type {
  CreateOneTimeFormApplicationRequest,
  MyOneTimeFormApplication,
} from '@/api/one-time-form/oneTimeFormSchema';
import type { OneTimeFormDraft } from '../../utils/applicationDraft';
import {
  buildLoginPath,
  isLoginRequiredError,
} from '../../utils/loginRequired';
import type { OneTimeFormUtm } from '../../utils/utmStorage';
import { buildCreateApplicationRequest } from './buildCreateApplicationRequest';

/** 토스 successUrl 쿼리(계약 11.2-10). 쿼리에 같은 키가 여러 번 오면 배열이라 문자열만 받는다 */
export interface PaymentResultQuery {
  paymentKey: string;
  orderId: string;
  amount: number;
}

const ORDER_MISMATCH_CODE = 'ORDER_ID_MISMATCH';
const ORDER_MISMATCH_MESSAGE =
  '결제 정보가 신청 정보와 맞지 않아요. 다시 결제해 주세요.';

const pickString = (value: unknown): string | null =>
  typeof value === 'string' && value !== '' ? value : null;

/** 하나라도 없거나 금액이 양의 정수가 아니면 null */
export const parsePaymentResultQuery = (raw: {
  paymentKey?: unknown;
  orderId?: unknown;
  amount?: unknown;
}): PaymentResultQuery | null => {
  const paymentKey = pickString(raw.paymentKey);
  const orderId = pickString(raw.orderId);
  const amountText = pickString(raw.amount);
  const amount = amountText === null ? NaN : Number(amountText);
  if (!paymentKey || !orderId || !Number.isInteger(amount) || amount <= 0) {
    return null;
  }
  return { paymentKey, orderId, amount };
};

export interface PaymentResultDeps {
  readDraft: () => OneTimeFormDraft | null;
  readUtm: () => OneTimeFormUtm | null;
  createApplication: (
    body: CreateOneTimeFormApplicationRequest,
  ) => Promise<unknown>;
  fetchMyApplication: () => Promise<MyOneTimeFormApplication>;
  clearSession: () => void;
  getErrorCode: (error: unknown) => string | undefined;
  getErrorMessage: (error: unknown) => string;
  alreadyAppliedCode: string;
}

/** 결제 단계로 돌려보내며 안내. 결제 단계는 code 가 있으면 message 를 띄운다(8.1) */
const paymentNoticePath = (slug: string, code: string, message: string) =>
  `/form/${slug}/payment?${new URLSearchParams({ code, message })}`;

/**
 * 로그인 뒤 같은 결제 결과 처리로 돌아온다. 서버는 로그인 검사에서 막혀 결제를 승인하지 않았으니
 * 보관값과 토스 쿼리로 U3 를 다시 부르면 다시 결제하지 않고 이어진다.
 * 토스 승인 가능 시간이 지났으면 U3 실패로 결제 단계에 돌아가 다시 결제한다.
 */
const loginAndReturnPath = (slug: string, query: PaymentResultQuery) =>
  buildLoginPath(
    `/form/${slug}/payment/result?${new URLSearchParams({
      paymentKey: query.paymentKey,
      orderId: query.orderId,
      amount: String(query.amount),
    })}`,
  );

/**
 * 토스 성공 리다이렉트 처리 결과로 이동할 경로를 정한다(계약 11.2-10, 11.4).
 * 결제 승인은 U3 안에서 서버가 하므로, U3 가 실패하면 결제는 일어나지 않고 보관값을 둔 채 결제 단계로 돌아간다.
 * 로그인이 필요하다는 실패(401·403)면 보관값을 둔 채 로그인으로 보내고 이 처리로 돌아오게 한다.
 */
export const resolvePaymentResult = async (
  slug: string,
  query: PaymentResultQuery | null,
  deps: PaymentResultDeps,
): Promise<string> => {
  const formPath = `/form/${slug}`;
  const paymentPath = `${formPath}/payment`;
  const completePath = `${formPath}/complete`;

  if (!query) return paymentPath;

  const draft = deps.readDraft();
  if (!draft) {
    // 새로고침 등으로 이미 성공해 보관값이 지워진 경우. 신청이 있으면 완료, 없으면 처음으로
    try {
      const application = await deps.fetchMyApplication();
      return application && !application.isCanceled ? completePath : formPath;
    } catch (error) {
      return isLoginRequiredError(error)
        ? loginAndReturnPath(slug, query)
        : formPath;
    }
  }

  if (draft.orderId !== null && draft.orderId !== query.orderId) {
    return paymentNoticePath(slug, ORDER_MISMATCH_CODE, ORDER_MISMATCH_MESSAGE);
  }

  try {
    await deps.createApplication(
      buildCreateApplicationRequest(draft, deps.readUtm(), query),
    );
  } catch (error) {
    if (isLoginRequiredError(error)) return loginAndReturnPath(slug, query);
    const code = deps.getErrorCode(error);
    if (code !== deps.alreadyAppliedCode) {
      return paymentNoticePath(
        slug,
        code ?? 'APPLICATION_FAILED',
        deps.getErrorMessage(error),
      );
    }
  }

  deps.clearSession();
  return completePath;
};
