import { isAxiosError } from 'axios';

/**
 * 우선순위가 겹치면 서버가 409, 값이 벗어나면 400 으로 거절한다. 그 이유는 서버 문구에만
 * 담겨 있으므로 그대로 스낵바에 올린다.
 */
export function toBlogPopupSaveErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}
