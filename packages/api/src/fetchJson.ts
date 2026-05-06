import { ApiError, SchemaParseError } from './errors';

function extractServerMessage(body: unknown): string | undefined {
  if (body == null || typeof body !== 'object') return undefined;
  const record = body as Record<string, unknown>;
  for (const key of ['message', 'error', 'msg', 'detail']) {
    if (typeof record[key] === 'string') return record[key] as string;
  }
  if ('data' in record && typeof record.data === 'object' && record.data !== null) {
    return extractServerMessage(record.data);
  }
  return undefined;
}

function truncate(value: unknown, maxLength: number): unknown {
  const str = JSON.stringify(value);
  if (typeof str !== 'string') return value;
  if (str.length <= maxLength) return value;
  return str.slice(0, maxLength) + '…';
}

/**
 * Sentry-호환 startSpan 시그니처. apps/web에서 `@sentry/nextjs.startSpan`을 주입.
 * `packages/api`는 `@sentry/nextjs`에 직접 의존하지 않으므로, 호스트 앱에서
 * `setFetchJsonStartSpan(Sentry.startSpan)`로 한 번 등록해야 자동 wrapping이 활성화됨.
 *
 * 미등록 상태에서도 fetchJson은 정상 동작 (no-op).
 */
type SpanAttributeValue = string | number | boolean | undefined;

type StartSpanOptions = {
  name: string;
  op?: string;
  attributes?: Record<string, SpanAttributeValue>;
};
type StartSpan = <T>(
  options: StartSpanOptions,
  callback: (span: unknown) => Promise<T> | T,
) => Promise<T> | T;

let injectedStartSpan: StartSpan | undefined;

/**
 * Sentry.startSpan을 fetchJson 자동 wrapping용으로 등록한다.
 * 호스트 앱(apps/web)이 instrumentation 시점에 1회 호출하면, 이후의 모든
 * fetchJson 호출이 `api.fetch` op span으로 자동 감싸진다.
 */
export function setFetchJsonStartSpan(fn: StartSpan | undefined): void {
  injectedStartSpan = fn;
}

type SetAttr = (key: string, value: SpanAttributeValue) => void;

async function runWithSpan<T>(
  options: StartSpanOptions,
  callback: (setAttr: SetAttr) => Promise<T>,
): Promise<T> {
  if (!injectedStartSpan) {
    // span 미주입 시: 그냥 콜백 실행 (attribute setter는 no-op)
    return callback(() => {});
  }

  return injectedStartSpan(options, async (span) => {
    const setAttr: SetAttr = (key, value) => {
      if (
        span &&
        typeof (span as { setAttribute?: unknown }).setAttribute === 'function'
      ) {
        try {
          (
            span as { setAttribute: (k: string, v: SpanAttributeValue) => void }
          ).setAttribute(key, value);
        } catch {
          // span API 변경 등으로 인한 실패는 무시
        }
      }
    };
    return callback(setAttr);
  }) as Promise<T>;
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit & {
    code: string;
    displayMessage: string;
    parse?: (data: unknown) => T;
    /** 커스텀 span 이름. 기본값 'api.fetch'. */
    metric?: string;
  },
): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const spanName = init.metric ?? 'api.fetch';

  return runWithSpan<T>(
    {
      name: spanName,
      op: 'http.client',
      attributes: {
        'http.url': url,
        'http.method': method,
      },
    },
    async (setAttr) => {
      const startedAt = Date.now();

      let res: Response;
      try {
        res = await fetch(url, init);
      } catch (cause) {
        setAttr('result', 'network_error');
        setAttr('error.code', `${init.code}_NETWORK`);
        setAttr('duration_ms', Date.now() - startedAt);
        throw new ApiError({
          code: `${init.code}_NETWORK`,
          message: init.displayMessage,
          status: 0,
          endpoint: url,
          method,
          cause,
        });
      }

      setAttr('http.status_code', res.status);

      const text = await res.text();
      let body: unknown;
      try {
        body = text ? JSON.parse(text) : undefined;
      } catch {
        body = text;
      }

      if (!res.ok) {
        setAttr('result', 'http_error');
        setAttr('error.code', init.code);
        setAttr('duration_ms', Date.now() - startedAt);
        throw new ApiError({
          code: init.code,
          message: init.displayMessage,
          status: res.status,
          endpoint: url,
          method,
          serverMessage: extractServerMessage(body),
          context: { responseBody: truncate(body, 500) },
        });
      }

      const data = (body as { data?: unknown } | null)?.data ?? body;

      if (!init.parse) {
        setAttr('result', 'success');
        setAttr('duration_ms', Date.now() - startedAt);
        return data as T;
      }

      try {
        const parsed = init.parse(data);
        setAttr('result', 'success');
        setAttr('duration_ms', Date.now() - startedAt);
        return parsed;
      } catch (cause) {
        setAttr('result', 'parse_error');
        setAttr('error.code', `${init.code}_PARSE`);
        setAttr('duration_ms', Date.now() - startedAt);
        throw new SchemaParseError({
          code: `${init.code}_PARSE`,
          message: init.displayMessage,
          status: res.status,
          context: { rawSample: truncate(data, 500) },
          cause,
        });
      }
    },
  );
}
