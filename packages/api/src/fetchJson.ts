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

export async function fetchJson<T>(
  url: string,
  init: RequestInit & {
    code: string;
    displayMessage: string;
    parse?: (data: unknown) => T;
  },
): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (cause) {
    throw new ApiError({
      code: `${init.code}_NETWORK`,
      message: init.displayMessage,
      status: 0,
      endpoint: url,
      method,
      cause,
    });
  }

  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }

  if (!res.ok) {
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

  if (!init.parse) return data as T;

  try {
    return init.parse(data);
  } catch (cause) {
    throw new SchemaParseError({
      code: `${init.code}_PARSE`,
      message: init.displayMessage,
      status: res.status,
      context: { rawSample: truncate(data, 500) },
      cause,
    });
  }
}
