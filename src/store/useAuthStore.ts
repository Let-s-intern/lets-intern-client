import { inferExpFromJwtMs, TokenSet } from '@/utils/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthStore {
  token: TokenSet | null;
  isLoggedIn: boolean;
  isInitialized: boolean; // 스토어 초기화 여부
  accessToken?: string;
  refreshToken?: string;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setInitialized: (initialized: boolean) => void;
  setToken: (tokens: TokenSet | null) => void;
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      token: null,
      isLoggedIn: false,
      isInitialized: false,
      login: (accessToken, refreshToken) => {
        const accessTokenExpiresAt = inferExpFromJwtMs(accessToken);
        const refreshTokenExpiresAt = inferExpFromJwtMs(refreshToken);
        if (!accessTokenExpiresAt || !refreshTokenExpiresAt) {
          throw new Error('Invalid token format');
        }
        set({
          token: {
            accessToken,
            refreshToken,
            accessExpiresAt: accessTokenExpiresAt,
            refreshExpiresAt: refreshTokenExpiresAt,
          },
          isLoggedIn: true,
        });
      },
      logout: () => {
        set({
          isLoggedIn: false,
        });
      },
      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },
      setToken: (token) => {
        if (
          !token ||
          !token.accessToken ||
          !token.refreshToken ||
          !token.accessExpiresAt ||
          !token.refreshExpiresAt
        ) {
          set({
            token: null,
            isLoggedIn: false,
          });
          return;
        }

        set({
          token,
          isLoggedIn: true,
        });
      },
    }),
    {
      name: 'userLoginStatus',
      onRehydrateStorage: () => (state) => {
        state?.setInitialized(true);
      },
    },
  ),
);

export default useAuthStore;
