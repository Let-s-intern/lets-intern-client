import useAuthStore from '../store/useAuthStore';

type EpochMs = number;

export type TokenSet = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: EpochMs;
  refreshExpiresAt: EpochMs;
};

export type RequireAuthReason =
  | '401'
  | 'invalid-token-error'
  | 'refresh-expired'
  | 'refresh-failed'
  | 'unexpected-401';

const THIRTY_SECONDS_MS = 30_000;
const REFRESH_PATH =
  (process.env.NEXT_PUBLIC_API_BASE_PATH ?? '') + '/api/v2/user/token';

let storeRehydrated = false;
let tokens: TokenSet | null = null;
let readyPromise: Promise<void> | null = null;
let refreshPromise: Promise<boolean> | null = null;
let requireAuthHandler: ((reason: RequireAuthReason) => void) | null = null;

export function inferExpFromJwtMs(token?: string | null): EpochMs | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1]!, 'base64').toString('utf-8'),
    );
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function getNow(): number {
  return Date.now();
}

function asEpochMs(value: unknown): EpochMs | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1e11 ? Math.floor(value) : Math.floor(value * 1000);
  }
  if (typeof value === 'string' && value.trim()) {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return numeric > 1e11 ? Math.floor(numeric) : Math.floor(numeric * 1000);
    }
  }
  return null;
}

function isExpiringSoon(exp: number | null | undefined): boolean {
  if (!exp) return true;
  return exp - getNow() <= THIRTY_SECONDS_MS;
}

function hasTokenShape(value: TokenSet | null): value is TokenSet {
  return (
    !!value &&
    typeof value.accessToken === 'string' &&
    typeof value.refreshToken === 'string' &&
    typeof value.accessExpiresAt === 'number' &&
    typeof value.refreshExpiresAt === 'number'
  );
}

async function rehydrateStore(): Promise<void> {
  if (storeRehydrated) return;
  const persistApi = (
    useAuthStore as unknown as {
      persist?: { rehydrate?: () => Promise<void> | void };
    }
  ).persist;
  if (persistApi?.rehydrate) {
    await persistApi.rehydrate();
  }
  storeRehydrated = true;
}

function applyTokens(next: TokenSet | null) {
  tokens = next;
  useAuthStore.getState().setToken(next);
}

function readTokensFromStore(): TokenSet | null {
  const snapshot = useAuthStore.getState().token;
  return hasTokenShape(snapshot) ? snapshot : null;
}

async function requireAuth(reason: RequireAuthReason): Promise<void> {
  applyTokens(null);
  const handler = requireAuthHandler ?? defaultRequireAuthHandler;
  handler(reason);
}

function defaultRequireAuthHandler(reason: RequireAuthReason) {
  if (
    typeof window !== 'undefined' &&
    typeof window.location?.reload === 'function'
  ) {
    // eslint-disable-next-line no-console
    console.warn('[auth] resetting session due to', reason);
    window.location.reload();
  }
}

async function requestRefresh(refreshToken: string): Promise<TokenSet | null> {
  const response = await fetch(REFRESH_PATH, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(`refresh-${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return mapRefreshResponse(payload);
}

function mapRefreshResponse(payload: unknown): TokenSet | null {
  if (!payload || typeof payload !== 'object') return null;
  const root = (payload as { data?: unknown }).data ?? payload;
  const data = (root as { data?: unknown }).data ?? root;

  if (!data || typeof data !== 'object') return null;

  const record = data as Record<string, unknown>;
  const accessToken = record.accessToken ?? record.access_token;
  const refreshToken = record.refreshToken ?? record.refresh_token;
  const accessExpiresAtRaw =
    record.accessExpiresAt ??
    record.access_expires_at ??
    record.accessTokenExpiresAt;
  const refreshExpiresAtRaw =
    record.refreshExpiresAt ??
    record.refresh_expires_at ??
    record.refreshTokenExpiresAt;

  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    return null;
  }

  const accessExpiresAt =
    asEpochMs(accessExpiresAtRaw) ?? inferExpFromJwtMs(accessToken);
  const refreshExpiresAt =
    asEpochMs(refreshExpiresAtRaw) ?? inferExpFromJwtMs(refreshToken);

  if (!accessExpiresAt || !refreshExpiresAt) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
  };
}

async function refreshTokens(): Promise<boolean> {
  if (!tokens?.refreshToken) return false;

  if (isExpiringSoon(tokens.refreshExpiresAt)) {
    await requireAuth('refresh-expired');
    return false;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const next = await requestRefresh(tokens!.refreshToken);
      if (!next) {
        await requireAuth('refresh-failed');
        return false;
      }
      applyTokens(next);
      return true;
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 401) {
        await requireAuth('unexpected-401');
      } else {
        await requireAuth('refresh-failed');
      }
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function bootstrap(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      await rehydrateStore();
      const initial = readTokensFromStore();
      applyTokens(initial);

      if (!hasTokenShape(initial)) {
        return;
      }

      if (isExpiringSoon(initial.refreshExpiresAt)) {
        await requireAuth('refresh-expired');
        return;
      }

      if (isExpiringSoon(initial.accessExpiresAt)) {
        await refreshTokens();
      }
    })();
  }

  await readyPromise;
}

async function ready(): Promise<void> {
  await bootstrap();
}

async function ensureValidAccessToken(): Promise<boolean> {
  await ready();
  if (!hasTokenShape(tokens)) return false;
  if (!isExpiringSoon(tokens.accessExpiresAt)) return true;
  return refreshTokens();
}

function getTokens(): TokenSet | null {
  return tokens;
}

function hasTokens(): boolean {
  return hasTokenShape(tokens);
}

function getAuthHeader(): { Authorization: string } | null {
  if (!tokens?.accessToken) return null;
  return { Authorization: `Bearer ${tokens.accessToken}` };
}

function setRequireAuthHandler(handler: (reason: RequireAuthReason) => void) {
  requireAuthHandler = handler;
}

export const auth = {
  bootstrap,
  ready,
  ensureValidAccessToken,
  refreshTokens,
  getTokens,
  hasTokens,
  getAuthHeader,
  requireAuth,
  setRequireAuthHandler,
};

void (async () => {
  if (typeof window !== 'undefined') {
    await bootstrap();
  }
})();
