import type { TokenSet } from '@/types/token';
import { inferExpFromJwtMs } from '@/utils/token';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthStore {
  token: TokenSet | null;
  isLoggedIn: boolean;
  setToken: (tokens: TokenSet | null) => void;
  isInitialized: boolean; // 스토어 초기화 여부
  accessToken?: string;
  refreshToken?: string;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setInitialized: (initialized: boolean) => void;
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
      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
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
