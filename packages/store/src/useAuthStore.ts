import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { inferExpFromJwtMs } from './_token';

export type TokenSet = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
};

export interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;
  isLoggedIn: boolean;
  setToken: (tokens: TokenSet | null) => void;
  isInitialized: boolean; // 스토어 초기화 여부
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setInitialized: (initialized: boolean) => void;
}

const emptyTokens = {
  token: null as TokenSet | null,
  accessToken: null as string | null,
  refreshToken: null as string | null,
  accessTokenExpiresAt: null as number | null,
  refreshTokenExpiresAt: null as number | null,
  isLoggedIn: false,
};

const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => {
      const setEmptyTokens = () => {
        set({
          ...emptyTokens,
        });
      };

      return {
        ...emptyTokens,

        isInitialized: false,
        login: (accessToken, refreshToken) => {
          const accessTokenExpiresAt = inferExpFromJwtMs(accessToken);
          const refreshTokenExpiresAt = inferExpFromJwtMs(refreshToken);
          if (!accessTokenExpiresAt || !refreshTokenExpiresAt) {
            throw new Error('Invalid token format');
          }
          get().setToken({
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
          });
        },
        logout: () => {
          get().setToken(null);
        },
        setToken: (token) => {
          if (!token) {
            setEmptyTokens();
            return;
          }

          set({
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            isLoggedIn: true,
          });
        },
        setInitialized: (initialized) => {
          set({ isInitialized: initialized });
        },
      };
    },
    {
      name: 'userLoginStatus',
      onRehydrateStorage: () => (state) => {
        state?.setInitialized(true);

        if (!state) {
          return;
        }

        if (
          state.accessToken &&
          state.refreshToken &&
          typeof state.accessTokenExpiresAt === 'number' &&
          typeof state.refreshTokenExpiresAt === 'number'
        ) {
          state.setToken({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            accessTokenExpiresAt: state.accessTokenExpiresAt,
            refreshTokenExpiresAt: state.refreshTokenExpiresAt,
          });
        }

        consumeSsoHashIfPresent(state);
      },
    },
  ),
);

// 서브도메인/포트 간 개별 로그인을 피하기 위한 URL hash 기반 토큰 전달.
// `#__sso=<accessToken>|<refreshToken>` 이 있으면 자동 로그인 후 hash 제거.
function consumeSsoHashIfPresent(state: AuthStore) {
  if (typeof window === 'undefined') return;
  const match = window.location.hash.match(/(?:^#|&)__sso=([^&]+)/);
  if (!match) return;

  try {
    const [accessToken, refreshToken] = decodeURIComponent(match[1]).split('|');
    if (!accessToken || !refreshToken) return;
    state.login(accessToken, refreshToken);
  } catch {
    return;
  }

  const cleaned = window.location.hash
    .replace(/(^#|&)__sso=[^&]+/, '')
    .replace(/^#&/, '#');
  const newUrl =
    window.location.pathname +
    window.location.search +
    (cleaned === '#' || cleaned === '' ? '' : cleaned);
  window.history.replaceState(null, '', newUrl);
}

export default useAuthStore;
