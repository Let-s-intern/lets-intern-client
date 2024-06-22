import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, redirect: string) => void;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      isLoggedIn: false,
      login: (accessToken, refreshToken, redirect) => {
        localStorage.setItem('access-token', accessToken);
        localStorage.setItem('refresh-token', refreshToken);
        set({ isLoggedIn: true });
        window.location.href = redirect;
      },
      logout: () => {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        set({ isLoggedIn: false });
        window.location.href = '/';
      },
    }),
    {
      name: 'userLoginStatus',
    },
  ),
);

export default useAuthStore;
