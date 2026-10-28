import { ApiError } from '@letscareer/api/errors';

/**
 * 로그인이 필요해 실패했는가. 계약은 비로그인 U2·U3·U4 를 401 로 적었지만
 * 실제 서버는 Spring Security 가 403 을 준다. 그래서 둘 다 로그인 필요로 본다.
 * 에러 코드 문자열은 서버마다 달라 보지 않고 HTTP 상태만 본다.
 */
export const isLoginRequiredError = (error: unknown): boolean =>
  error instanceof ApiError && (error.status === 401 || error.status === 403);

/** 로그인 뒤 returnPath 로 돌아오는 로그인 페이지 경로 */
export const buildLoginPath = (returnPath: string): string =>
  `/login?redirect=${encodeURIComponent(returnPath)}`;
