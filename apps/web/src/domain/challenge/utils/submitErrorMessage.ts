import { isAxiosError } from 'axios';

export const SUBMIT_ERROR_FALLBACK =
  '미션 제출에 실패했습니다. 다시 시도해주세요.';

/**
 * 제출 실패 사유.
 *
 * 서버는 `{ status, code, message }`(`ErrorResponse`)로 이유를 알려준다.
 * 예전에는 그것을 버리고 "다시 시도해주세요" 만 띄웠는데, 기간 때문에 막힌
 * 경우(`ATTENDANCE_NOT_AVAILABLE_DATE`, "출석 제출이 불가능한 기간입니다")는
 * 다시 시도해도 절대 되지 않는다. 서버 문구를 그대로 보여준다.
 */
export const getSubmitErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.trim()) return message;
  }

  return SUBMIT_ERROR_FALLBACK;
};
