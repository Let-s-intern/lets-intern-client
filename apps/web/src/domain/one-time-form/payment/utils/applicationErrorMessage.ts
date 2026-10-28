import { ApiError } from '@letscareer/api/errors';

const FALLBACK_MESSAGE = '신청하지 못했어요. 잠시 후 다시 시도해 주세요.';

/** U3 실패 안내. 서버 메시지는 화면에 그대로 띄울 수 있는 문장이다(계약 10절) */
export const getApplicationErrorMessage = (error: unknown): string =>
  (error instanceof ApiError ? error.serverMessage : undefined) ||
  FALLBACK_MESSAGE;
