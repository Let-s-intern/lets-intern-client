/**
 * 서버가 준 에러코드와 문구를 꺼낸다.
 *
 * **`error.response.data` 를 읽으면 안 된다.** `createAuthorizedAxios` 의 인터셉터가
 * axios 에러를 `ApiError` 로 **바꿔서** 던지기 때문이다(`packages/api/src/errors.ts`).
 * 그 객체에는 `response` 가 없고 `code` · `message` · `serverMessage` 가 최상위에 있다.
 *
 * 이걸 모르고 `response.data.code` 를 보면 코드가 언제나 `UNKNOWN` 으로 읽혀서
 * 에러코드로 갈라 놓은 분기가 **조용히 한 번도 타지 않는다.** 실제로 그렇게 만들었다가
 * 취소 화면에서 "이미 취소된 라이브 멘토링 신청입니다" 대신 기본 문구가 뜨는 것을 보고
 * 알아냈다.
 *
 * 인터셉터를 타지 않는 경로가 생길 수 있으므로 원본 axios 형태도 함께 본다.
 */
export interface ServerError {
  code: string;
  message: string;
}

export function readServerError(
  error: unknown,
  fallbackMessage = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.',
): ServerError {
  const apiError = error as {
    code?: string;
    message?: string;
    serverMessage?: string;
    response?: { data?: { code?: string; message?: string } };
  } | null;

  const fromResponse = apiError?.response?.data;

  const code = fromResponse?.code ?? apiError?.code ?? 'UNKNOWN';
  const message =
    fromResponse?.message ??
    apiError?.serverMessage ??
    apiError?.message ??
    fallbackMessage;

  return {
    code,
    // 인터셉터가 서버 문구를 못 찾으면 자체 문구를 넣는다. 그건 사용자에게 쓸모없다.
    message:
      message === '서버 오류가 발생했습니다.' ? fallbackMessage : message,
  };
}
