import { inferExpFromJwtMs, TokenSet } from '@/utils/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthStore {
  token: TokenSet | null;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setToken: (tokens: TokenSet | null) => void;
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      token: null,
      isLoggedIn: false,
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
    }),
    {
      name: 'userLoginStatus',
    },
  ),
);

export default useAuthStore;
