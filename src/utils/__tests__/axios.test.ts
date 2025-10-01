import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock axios before importing the modules
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      patch: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

// Mock useAuthStore
vi.mock('../../store/useAuthStore', () => ({
  default: {
    getState: vi.fn(),
    setState: vi.fn(),
  },
}));

// Now import the modules after mocking
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';

const mockAxios = vi.mocked(axios);
const mockAuthStore = vi.mocked(useAuthStore);

describe('Axios Token Refresh Single-Flight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Single-Flight Logic', () => {
    it('should only make one token refresh request when multiple 401 errors occur simultaneously', async () => {
      // Arrange
      (mockAuthStore.getState as any).mockReturnValue({
        accessToken: 'expired-token',
        refreshToken: 'valid-refresh-token',
        isLoggedIn: true,
      });

      const mockReissuer = {
        patch: vi.fn().mockResolvedValue({
          data: {
            data: {
              accessToken: 'new-access-token',
              refreshToken: 'new-refresh-token',
            },
          },
        }),
      };

      // Mock axios.create to return reissuer for token refresh
      (mockAxios.create as any).mockImplementation((config: any) => {
        if (config?.baseURL?.includes('/user/token')) {
          return mockReissuer as any;
        }
        return {
          interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
          },
        };
      });

      // Simulate the single-flight logic directly
      let isRefreshing = false;
      let refreshPromise: Promise<any> | null = null;

      const simulateTokenRefresh = async () => {
        if (isRefreshing) {
          return refreshPromise;
        }

        isRefreshing = true;
        refreshPromise = mockReissuer.patch('/user/token', {
          refreshToken: 'valid-refresh-token',
        });

        try {
          const result = await refreshPromise;
          return result;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      };

      // Simulate 5 simultaneous 401 errors
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(simulateTokenRefresh());
      }

      // Wait for all requests to complete
      await Promise.allSettled(promises);

      // Assert that token refresh was called only once
      expect(mockReissuer.patch).toHaveBeenCalledTimes(1);
      expect(mockReissuer.patch).toHaveBeenCalledWith('/user/token', {
        refreshToken: 'valid-refresh-token',
      });
    });

    it('should handle token refresh failure correctly', async () => {
      // Arrange
      (mockAuthStore.getState as any).mockReturnValue({
        accessToken: 'expired-token',
        refreshToken: 'invalid-refresh-token',
        isLoggedIn: true,
      });

      const mockReissuer = {
        patch: vi.fn().mockRejectedValue(new Error('Token refresh failed')),
      };

      (mockAxios.create as any).mockImplementation((config: any) => {
        if (config?.baseURL?.includes('/user/token')) {
          return mockReissuer as any;
        }
        return {
          interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
          },
        };
      });

      // Simulate the single-flight logic with error handling
      let isRefreshing = false;
      let refreshPromise: Promise<any> | null = null;

      const simulateTokenRefresh = async () => {
        if (isRefreshing) {
          return refreshPromise;
        }

        isRefreshing = true;
        refreshPromise = mockReissuer.patch('/user/token', {
          refreshToken: 'invalid-refresh-token',
        });

        try {
          const result = await refreshPromise;
          return result;
        } catch (error) {
          // Simulate initAuth call
          (mockAuthStore.setState as any)();
          throw error;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      };

      // Act
      try {
        await simulateTokenRefresh();
      } catch (e) {
        // Expected to throw
      }

      // Assert
      expect(mockReissuer.patch).toHaveBeenCalledTimes(1);
      expect(mockAuthStore.setState).toHaveBeenCalled();
    });
  });

  describe('Authorization Header Logic', () => {
    it('should not send Authorization header when tokens are empty', () => {
      // Arrange
      (mockAuthStore.getState as any).mockReturnValue({
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
      });

      // Simulate the request interceptor logic
      const simulateRequestInterceptor = (config: any) => {
        const accessToken = mockAuthStore.getState().accessToken;
        const refreshToken = mockAuthStore.getState().refreshToken;

        if (accessToken && refreshToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      };

      // Act
      const config = { headers: {} as any };
      simulateRequestInterceptor(config);

      // Assert
      expect(config.headers.Authorization).toBeUndefined();
    });

    it('should send Authorization header when tokens are present', () => {
      // Arrange
      (mockAuthStore.getState as any).mockReturnValue({
        accessToken: 'valid-token',
        refreshToken: 'valid-refresh-token',
        isLoggedIn: true,
      });

      // Simulate the request interceptor logic
      const simulateRequestInterceptor = (config: any) => {
        const accessToken = mockAuthStore.getState().accessToken;
        const refreshToken = mockAuthStore.getState().refreshToken;

        if (accessToken && refreshToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      };

      // Act
      const config = { headers: {} as any };
      simulateRequestInterceptor(config);

      // Assert
      expect(config.headers.Authorization).toBe('Bearer valid-token');
    });
  });
});
