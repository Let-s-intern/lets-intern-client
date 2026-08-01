import { ApiError } from '@letscareer/api';

/**
 * 액션 실패 메시지. **서버 오류 코드를 문구에 그대로 남긴다.**
 *
 * ID 를 직접 입력하는 임시 도구라 실패 원인이 셋 중 무엇인지가 그대로 보여야 한다 —
 * 없는 ID(`LIVE_MENTORING_NOT_FOUND`), 잘못된 상태 전이(`LIVE_MENTORING_INVALID_STATE`),
 * 권한 없음(`IS_NOT_ADMIN`·`FORBIDDEN`). 코드를 사람 말로 번역하면
 * 어느 쪽인지 구분이 흐려져 잘못 입력한 ID 를 계속 다시 넣게 된다.
 */
export const liveMentoringActionErrorMessage = (
  action: string,
  error: unknown,
): string => {
  if (error instanceof ApiError) {
    return `${action}에 실패했습니다. [${error.code}] ${error.serverMessage ?? error.message}`;
  }
  if (error instanceof Error) {
    return `${action}에 실패했습니다. ${error.message}`;
  }
  return `${action}에 실패했습니다.`;
};
