import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isLoggedIn: boolean;
  accessToken?: string;
  refreshToken?: string;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      isLoggedIn: false,
      login: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isLoggedIn: true });
      },
      logout: () => {
        set({
          accessToken: undefined,
          refreshToken: undefined,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: 'userLoginStatus',
    },
  ),
);

export default useAuthStore;
