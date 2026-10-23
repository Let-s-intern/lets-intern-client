import { isAxiosError } from 'axios';

/**
 * 서버 거절 사유를 그대로 꺼낸다.
 *
 * 마지막 사용 중 서버, 중복 주소 같은 이유는 서버 `message` 에만 담겨 있다.
 * `Request failed with status code 400` 으로 뭉개면 운영이 무엇을 고쳐야 하는지 알 수 없다.
 */
export const toMeetingServerErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
};
