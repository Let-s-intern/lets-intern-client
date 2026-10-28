import { ApiError } from '@letscareer/api/errors';
import { isLoginRequiredError } from '../../utils/loginRequired';

/**
 * U5 실패 후 할 일.
 * - LOGIN: 로그인 페이지로 보낸다
 * - REFETCH: 다시 시도해도 안 된다. 안내를 띄우고 U2 를 다시 불러 화면 상태를 맞춘다
 * - RETRY: 안내를 띄우고 다시 시도할 수 있게 둔다
 */
export type CancelErrorAction =
  | { type: 'LOGIN' }
  | { type: 'REFETCH'; message: string }
  | { type: 'RETRY'; message: string };

const PAST_DEADLINE_MESSAGE = '취소 기간이 지나 직접 취소할 수 없어요.';
const ALREADY_CANCELED_MESSAGE = '이미 취소한 신청이에요.';
const FALLBACK_MESSAGE = '취소하지 못했어요. 잠시 후 다시 시도해 주세요.';

/** U5 에러 표(계약 U5)를 화면 동작으로 바꾼다. 401 은 비로그인이다 */
export const resolveCancelError = (error: unknown): CancelErrorAction => {
  if (isLoginRequiredError(error)) return { type: 'LOGIN' };

  const code = error instanceof ApiError ? error.code : undefined;
  if (code === 'APPLICATION_CANNOT_CANCELED') {
    return { type: 'REFETCH', message: PAST_DEADLINE_MESSAGE };
  }
  if (code === 'APPLICATION_ALREADY_CANCELED') {
    return { type: 'REFETCH', message: ALREADY_CANCELED_MESSAGE };
  }
  return { type: 'RETRY', message: FALLBACK_MESSAGE };
};
