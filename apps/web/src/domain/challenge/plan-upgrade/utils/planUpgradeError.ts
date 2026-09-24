import { ApiError } from '@letscareer/api';
import { AxiosError } from 'axios';

/**
 * 업그레이드 API 실패의 서버 코드와 문구.
 *
 * axios 인터셉터가 응답 에러를 ApiError 로 감싸 던진다. 네트워크 실패는 감싸지 않은
 * AxiosError 로 오므로 둘 다 본다. payment-input 페이지와 같은 방식이다.
 * 코드는 승인 실패 화면이 `PLAN_UPGRADE_SAVE_FAILED` 를 가려내는 데 쓴다.
 */
export const getPlanUpgradeServerError = (
  error: unknown,
): { code?: string; message?: string } => {
  if (error instanceof ApiError) {
    return { code: error.code, message: error.serverMessage };
  }
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { code?: string; message?: string }
      | undefined;
    return { code: data?.code, message: data?.message };
  }
  return {};
};
