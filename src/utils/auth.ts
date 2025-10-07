import useAuthStore from '../store/useAuthStore';

type EpochMs = number;

export type TokenSet = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: EpochMs;
  refreshExpiresAt: EpochMs;
};

export type RequireAuthReason =
  | 'bootstrap-no-refresh'
  | 'refresh-fail'
  | '401'
  | 'invalid-token-error';

const DEFAULT_SKEW_MS = 60_000;

const REFRESH_PATH =
  process.env.NEXT_PUBLIC_API_BASE_PATH + '/api/v2/user/token';

let rehydrated = false;
let tokens: TokenSet | null = null;
let readyPromise: Promise<void> | null = null;
let refreshPromise: Promise<boolean> | null = null;
let requireAuthHandler: ((reason: RequireAuthReason) => void) | null = null;
let refreshExecutor: (refreshToken: string) => Promise<TokenSet | null>;

export function inferExpFromJwtMs(token?: string | null): EpochMs | null {
  if (!token) {
    return null;
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payloadBase64 = parts[1]!;
    const buf = Buffer.from(payloadBase64, 'base64');
    const decoded = buf.toString('utf-8');
    const payload = JSON.parse(decoded);

    if (typeof payload.exp !== 'number') return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

function isMissingOrExpired(
  exp?: EpochMs | null,
  skewMs = DEFAULT_SKEW_MS,
): boolean {
  if (!exp) return true;
  return Date.now() >= exp - skewMs;
}

function hasAnyToken(stack: TokenSet | null): boolean {
  return Boolean(stack?.accessToken || stack?.refreshToken);
}

function normalizeTokenSet(t: TokenSet | null): TokenSet | null {
  if (!t) return null;
  const accessExpiresAt =
    t.accessExpiresAt ?? inferExpFromJwtMs(t.accessToken ?? null);
  const refreshExpiresAt =
    t.refreshExpiresAt ?? inferExpFromJwtMs(t.refreshToken ?? null);
  return {
    accessToken: t.accessToken ?? null,
    refreshToken: t.refreshToken ?? null,
    accessExpiresAt: accessExpiresAt ?? null,
    refreshExpiresAt: refreshExpiresAt ?? null,
  };
}

function parseEpochMs(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number') {
    return normalizeEpoch(value);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric)) {
      return normalizeEpoch(numeric);
    }
    const date = Date.parse(trimmed);
    if (!Number.isNaN(date)) return date;
  }
  return null;
}

function normalizeEpoch(input: number): number | null {
  if (!Number.isFinite(input)) return null;
  if (input > 1e12) return input; // already ms precision
  if (input > 1e10) return Math.floor(input); // assume ms but as float
  if (input > 0) return Math.floor(input * 1000);
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRefreshResponse(json: any): TokenSet {
  const root = json?.data ?? json ?? {};
  const payload = root?.data ?? root;
  const accessToken = payload?.accessToken ?? payload?.access_token ?? null;
  const refreshToken = payload?.refreshToken ?? payload?.refresh_token ?? null;
  const accessExpiresAt =
    parseEpochMs(
      payload?.accessExpiresAt ??
        payload?.access_exp ??
        payload?.accessTokenExpiredAt ??
        payload?.accessTokenExpiresAt,
      // 23 hours
    ) ?? 23 * 60 * 60 * 1000 + Date.now();
  const refreshExpiresAt =
    parseEpochMs(
      payload?.refreshExpiresAt ??
        payload?.refresh_exp ??
        payload?.refreshTokenExpiredAt ??
        payload?.refreshTokenExpiresAt,
      // 6 days
    ) ?? 6 * 24 * 60 * 60 * 1000 + Date.now();
  return {
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
  };
}

function applyTokensToStore(next: TokenSet | null) {
  useAuthStore.getState().setToken(next);
}

function setTokens(next: TokenSet | null) {
  tokens = normalizeTokenSet(next);
  applyTokensToStore(tokens);
}

function getTokens(): TokenSet | null {
  return tokens;
}

async function ensureStoreRehydrated() {
  if (rehydrated) return;
  const persistApi = (
    useAuthStore as unknown as {
      persist?: { rehydrate?: () => Promise<void> | void };
    }
  ).persist;
  if (persistApi?.rehydrate) {
    await persistApi.rehydrate();
  }
  rehydrated = true;
}

async function loadTokens(): Promise<TokenSet | null> {
  await ensureStoreRehydrated();
  const state = useAuthStore.getState();
  const snapshot: TokenSet | null = state.token;
  return normalizeTokenSet(snapshot);
}

function getSkewMs(): number {
  const fromEnv = Number(process.env.NEXT_PUBLIC_AUTH_SKEW_MS);
  if (Number.isFinite(fromEnv) && fromEnv >= 0) {
    return fromEnv;
  }
  return DEFAULT_SKEW_MS;
}

async function hardReset(reason: RequireAuthReason) {
  setTokens(null);
  const handler = requireAuthHandler ?? defaultRequireAuthHandler;
  handler?.(reason);
}

function defaultRequireAuthHandler(reason: RequireAuthReason) {
  if (
    typeof window !== 'undefined' &&
    typeof window.location?.reload === 'function'
  ) {
    // eslint-disable-next-line no-console
    console.warn('[auth] reloading page due to auth requirement:', reason);
    window.location.reload();
  }
}

async function defaultRefreshExecutor(
  refreshToken: string,
): Promise<TokenSet | null> {
  const response = await fetch(REFRESH_PATH, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  });

  let json: any = null;
  try {
    json = await response.json();
  } catch {
    if (response.ok) {
      json = {};
    }
  }

  if (!response.ok) {
    const statusText = response.statusText || 'Unknown error';
    throw new Error(
      `Refresh request failed with status ${response.status}: ${statusText}`,
    );
  }

  return mapRefreshResponse(json ?? {});
}

refreshExecutor = defaultRefreshExecutor;

async function refreshOnce(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      if (
        !tokens?.refreshToken ||
        isMissingOrExpired(tokens.refreshExpiresAt, 0)
      ) {
        return false;
      }
      const raw = await refreshExecutor(tokens.refreshToken);
      const next = normalizeTokenSet(raw);
      if (!next?.accessToken) {
        return false;
      }
      setTokens(next);
      return true;
    } catch (err) {
      const details =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : JSON.stringify(err);
      console.error('[auth] token refresh failed', details);
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function bootstrap(): Promise<void> {
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    setTokens(await loadTokens());

    if (!hasAnyToken(tokens)) return;

    const skewMs = getSkewMs();
    const accessBad = isMissingOrExpired(tokens?.accessExpiresAt, 0);
    const refreshBad = isMissingOrExpired(tokens?.refreshExpiresAt, 0);

    if (accessBad && refreshBad) {
      await hardReset('bootstrap-no-refresh');
      return;
    }

    if (isMissingOrExpired(tokens?.accessExpiresAt, skewMs) && !refreshBad) {
      const ok = await refreshOnce();
      if (!ok) {
        await hardReset('refresh-fail');
      }
    }
  })();

  await readyPromise;
}

async function ready(): Promise<void> {
  if (!readyPromise) {
    await bootstrap();
    return;
  }
  await readyPromise;
}

async function waitForRefresh(): Promise<void> {
  if (refreshPromise) {
    await refreshPromise;
  }
}

function needsPreemptiveRefresh(): boolean {
  if (!tokens?.accessToken) return false;
  const skewMs = getSkewMs();
  const accessSoon = isMissingOrExpired(tokens.accessExpiresAt, skewMs);
  const refreshOk =
    !!tokens.refreshToken && !isMissingOrExpired(tokens.refreshExpiresAt, 0);
  return accessSoon && refreshOk;
}

export function getAuthHeader(): null | {
  Authorization: string;
} {
  if (tokens?.accessToken) {
    return {
      Authorization: `Bearer ${tokens.accessToken}`,
    };
  }
  return null;
}

function hasTokens(): boolean {
  return hasAnyToken(tokens);
}

function setRequireAuthHandler(handler: (reason: RequireAuthReason) => void) {
  requireAuthHandler = handler;
}

function setRefreshExecutorForTests(
  executor: (refreshToken: string) => Promise<TokenSet | null>,
) {
  refreshExecutor = executor;
}

function resetForTests() {
  rehydrated = false;
  readyPromise = null;
  refreshPromise = null;
  requireAuthHandler = null;
  setTokens(null);
}

export const auth = {
  bootstrap,
  getTokens,
  hasTokens,
  needsPreemptiveRefresh,
  refreshOnce,
  requireAuth: hardReset,
  setRequireAuthHandler,
  setTokens,
  waitForRefresh,
  __resetForTests: resetForTests,
  __setRefreshExecutorForTests: setRefreshExecutorForTests,
};
