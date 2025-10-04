import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isLoggedIn: boolean;
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
      isLoggedIn: false,
      isInitialized: false,
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
