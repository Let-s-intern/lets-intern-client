import useAuthStore, { TokenSet } from '../store/useAuthStore';
import { inferExpFromJwtMs } from './token';

export { inferExpFromJwtMs } from './token';

const THIRTY_SECONDS_MS = 30_000;
const REFRESH_PATH =
  (process.env.NEXT_PUBLIC_API_BASE_PATH ?? '') + '/api/v2/user/token';

let readyPromise: Promise<void> | null = null;
let refreshPromise: Promise<boolean> | null = null;

function isExpiringSoon(exp: number | null | undefined): boolean {
  if (!exp) return true;
  return exp - Date.now() <= THIRTY_SECONDS_MS;
}

async function ensureHydratedStore(): Promise<void> {
  if (useAuthStore.persist.hasHydrated()) return;
  await useAuthStore.persist.rehydrate();
}

// 실제 refresh 요청 수행
async function requestRefresh(refreshToken: string): Promise<TokenSet | null> {
  const response = await fetch(REFRESH_PATH, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  });

  let payload: {
    data?: {
      accessToken?: string;
      refreshToken?: string;
    };
  } | null = null;
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

  const newAccessToken = payload?.data?.accessToken;
  const newRefreshToken = payload?.data?.refreshToken;

  if (
    typeof newAccessToken !== 'string' ||
    typeof newRefreshToken !== 'string'
  ) {
    return null;
  }

  const accessTokenExpiresAt = inferExpFromJwtMs(newAccessToken);
  const refreshTokenExpiresAt = inferExpFromJwtMs(newRefreshToken);

  if (!accessTokenExpiresAt || !refreshTokenExpiresAt) {
    return null;
  }

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  };
}

export function logoutAndRefreshPage(): void {
  useAuthStore.getState().logout();
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

async function refreshTokenAtOnce(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  const current = useAuthStore.getState();
  if (!current?.refreshToken) {
    logoutAndRefreshPage();
    return false;
  }

  if (isExpiringSoon(current.refreshTokenExpiresAt)) {
    logoutAndRefreshPage();
    return false;
  }

  // 이미 갱신 중이면 기존 갱신 작업을 재사용
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = current.refreshToken;

  refreshPromise = (async () => {
    try {
      console.log('[letscareer] refreshToken Started');
      const next = await requestRefresh(refreshToken);
      if (!next) {
        logoutAndRefreshPage();
        return false;
      }
      useAuthStore.getState().setToken(next);
      return true;
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 401) {
        logoutAndRefreshPage();
      } else {
        logoutAndRefreshPage();
      }
      return false;
    } finally {
      console.log('[letscareer] refreshToken Finished ⚡');
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function bootstrap(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  if (!readyPromise) {
    readyPromise = (async () => {
      // eslint-disable-next-line no-console
      console.log('[letscareer] Token Bootstrap Started');
      await ensureHydratedStore();
      const initial = useAuthStore.getState();

      if (
        !initial.isLoggedIn ||
        !initial.accessToken ||
        !initial.accessTokenExpiresAt ||
        !initial.refreshToken ||
        !initial.refreshTokenExpiresAt
      ) {
        return;
      }

      if (isExpiringSoon(initial.refreshTokenExpiresAt)) {
        logoutAndRefreshPage();
        return;
      }

      if (isExpiringSoon(initial.accessTokenExpiresAt)) {
        await refreshTokenAtOnce();
      }
    })();
  }

  await readyPromise;
}

/**
 * 인증 관련 초기화가 완료될 때까지 대기합니다.
 */
export async function getAuthHeader(): Promise<{
  Authorization: string;
} | null> {
  await bootstrap();

  let store = useAuthStore.getState();
  if (!store.isLoggedIn) {
    return null;
  }

  if (isExpiringSoon(store.accessTokenExpiresAt)) {
    await refreshTokenAtOnce();
    store = useAuthStore.getState();
  }

  const accessToken = store.accessToken;

  return accessToken ? { Authorization: `Bearer ${accessToken}` } : null;
}

void (async () => {
  if (typeof window !== 'undefined') {
    await bootstrap();
  }
})();
