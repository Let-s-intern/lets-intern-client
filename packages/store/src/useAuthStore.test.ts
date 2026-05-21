import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// JWT 페이로드 인코딩 헬퍼 (테스트 시드용).
function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const body = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${body}.sig`;
}

const FUTURE_SEC = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24시간 후

function seedLocalStorage(value: unknown): void {
  window.localStorage.setItem('userLoginStatus', JSON.stringify(value));
}

async function loadStoreFresh() {
  vi.resetModules();
  const mod = await import('./useAuthStore');
  const store = mod.default;
  // persist 미들웨어는 모듈 로드 시 비동기로 rehydrate를 수행하므로 명시적으로 한 번 더 호출해 완료 보장.
  await store.persist.rehydrate();
  return store;
}

describe('useAuthStore persist migration (B안: 옛 스키마 nuke)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('옛 스키마(version 없음, 3필드) → 좀비 상태 nuke', async () => {
    // PR #1901 이전의 옛 persist 스키마: {isLoggedIn, accessToken?, refreshToken?}.
    seedLocalStorage({
      state: {
        isLoggedIn: true,
        accessToken: 'legacy-access',
        refreshToken: 'legacy-refresh',
      },
      // version 키 없음 → zustand가 version=0으로 간주.
    });

    const store = await loadStoreFresh();
    const state = store.getState();

    expect(state.isLoggedIn).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.accessTokenExpiresAt).toBeNull();
    expect(state.refreshTokenExpiresAt).toBeNull();
  });

  it('명시적 version: 0 → nuke', async () => {
    seedLocalStorage({
      state: {
        isLoggedIn: true,
        accessToken: 'legacy-access',
        refreshToken: 'legacy-refresh',
      },
      version: 0,
    });

    const store = await loadStoreFresh();
    const state = store.getState();

    expect(state.isLoggedIn).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it('신 스키마(version: 1, expiresAt 포함) → 정상 유지', async () => {
    const accessToken = makeJwt({ exp: FUTURE_SEC });
    const refreshToken = makeJwt({ exp: FUTURE_SEC });
    const accessExp = FUTURE_SEC * 1000;
    const refreshExp = FUTURE_SEC * 1000;

    seedLocalStorage({
      state: {
        isLoggedIn: true,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessExp,
        refreshTokenExpiresAt: refreshExp,
        isInitialized: false,
      },
      version: 1,
    });

    const store = await loadStoreFresh();
    const state = store.getState();

    expect(state.isLoggedIn).toBe(true);
    expect(state.accessToken).toBe(accessToken);
    expect(state.refreshToken).toBe(refreshToken);
    expect(state.accessTokenExpiresAt).toBe(accessExp);
    expect(state.refreshTokenExpiresAt).toBe(refreshExp);
  });

  it('좀비 부분 신 스키마(isLoggedIn: true + 토큰은 있지만 expiresAt null) → 가드로 nuke', async () => {
    // version 1로 마킹된 좀비 케이스: 마이그레이션은 통과시키지만 onRehydrateStorage 가드가 정리.
    seedLocalStorage({
      state: {
        isLoggedIn: true,
        accessToken: 'zombie-access',
        refreshToken: 'zombie-refresh',
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        isInitialized: false,
      },
      version: 1,
    });

    const store = await loadStoreFresh();
    const state = store.getState();

    expect(state.isLoggedIn).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.accessTokenExpiresAt).toBeNull();
    expect(state.refreshTokenExpiresAt).toBeNull();
  });

  it('빈 persist (최초 방문) → 로그아웃 상태', async () => {
    const store = await loadStoreFresh();
    const state = store.getState();

    expect(state.isLoggedIn).toBe(false);
    expect(state.accessToken).toBeNull();
  });
});
