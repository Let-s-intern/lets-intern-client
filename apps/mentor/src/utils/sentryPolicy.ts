/**
 * Sentry 전송 정책 — SDK 를 부르지 않는 순수 함수만 둔다.
 *
 * apps/web 에 같은 이름의 함수들이 있지만 의도적으로 공유하지 않는다.
 * web 은 불특정 공개 트래픽이라 "무엇을 걸러낼까"가 설계의 중심이고(번역기·지갑
 * 확장·봇), mentor 는 로그인한 멘토 소수가 쓰는 도구라 에러 한 건이 곧 멘토 한 명이
 * 일을 못 하는 상황이다. 걸러내는 방향이 반대라, 같은 코드를 공유하면 한쪽에 맞지
 * 않는 정책을 강제하게 된다. 공유하는 것은 `@letscareer/api` 의 `ApiError` 계약뿐이다.
 */

/** Sentry 이벤트 중 이 정책이 실제로 읽는 필드만 추린 형태. SDK 타입에 묶이지 않는다. */
export interface SentryEventLike {
  level?: string;
  tags?: Record<string, unknown>;
  exception?: {
    values?: Array<{
      type?: string;
      mechanism?: { handled?: boolean };
    }>;
  };
}

/**
 * `ApiError` 또는 axios 에러에서 HTTP 상태 코드를 꺼낸다.
 * 없으면 undefined — 네트워크 실패나 렌더 에러가 여기 해당한다.
 */
export function extractHttpStatus(err: unknown): number | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  const e = err as { status?: unknown; response?: { status?: unknown } };
  if (typeof e.status === 'number') return e.status;
  if (typeof e.response?.status === 'number') return e.response.status;
  return undefined;
}

/**
 * 노이즈 분류. 현재는 stale chunk 하나만 다룬다.
 *
 * mentor 는 해시 청크를 쓰는 Vite SPA 인데 apps/web 의 `StaleChunkHandler` 같은
 * 복구 장치가 없다. 배포 직후 캐시된 `index.html` 이 사라진 청크를 요청하면
 * `ChunkLoadError` 가 나는데, 이건 코드 결함이 아니라 배포 타이밍 문제라 실제
 * 버그와 섞이면 안 된다.
 *
 * web 이 분류하는 번역기·지갑 확장 노이즈는 넣지 않았다. 로그인 사용자 대상이라
 * 아직 관측된 적이 없고, 실제로 보이면 그때 추가한다.
 */
export function classifyNoise(error: Error): 'stale-deploy' | null {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  if (
    name === 'chunkloaderror' ||
    message.includes('failed to load chunk') ||
    message.includes('loading chunk') ||
    message.includes('dynamically imported module')
  ) {
    return 'stale-deploy';
  }

  return null;
}

/**
 * Replay buffer 를 flush 할 "크래시" 이벤트인지 판정한다.
 *
 * web 의 기준에서 SSR 전용 항목(`kind: server-component`)을 뺐다. mentor 는 런타임이
 * 브라우저 하나뿐이라 해당 이벤트가 발생하지 않는다.
 */
export function isCrashEvent(event: SentryEventLike): boolean {
  if (event.level === 'fatal') return true;

  const exception = event.exception?.values?.[0];

  // 잡히지 않은 예외 — 렌더가 중단됐다는 뜻이다.
  if (exception?.mechanism?.handled === false) return true;

  if (exception?.type === 'ChunkLoadError') return true;

  // 스키마 파싱 실패는 화면을 그릴 수 없는 상태다.
  const errorCode = event.tags?.errorCode;
  if (typeof errorCode === 'string' && errorCode.endsWith('_PARSE')) {
    return true;
  }

  return false;
}
