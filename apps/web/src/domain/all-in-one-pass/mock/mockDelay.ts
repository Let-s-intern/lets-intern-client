/**
 * mock 응답 지연 유틸. api 훅의 queryFn 이 실제 서버 대신 이 값을 반환한다.
 * 실제 API 연결 시 mock 폴더를 통째로 삭제한다.
 */
export const mockDelay = <T>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));
