/**
 * @jest-environment jsdom
 */

// 모듈 로드 전에 환경 변수 보장 (auth.ts가 모듈 레벨에서 fail-fast 검증).
process.env.NEXT_PUBLIC_SERVER_API_V2 ??= 'https://api.example.com/v2';

// reload 호출 검증을 위해 mock 처리. jsdom의 location.reload는 기본 구현이 없어 throw하므로 필수.
const reloadMock = jest.fn();
Object.defineProperty(window, 'location', {
  configurable: true,
  value: {
    ...window.location,
    reload: reloadMock,
  },
});

function seedAuthLocalStorage(value: unknown): void {
  window.localStorage.setItem('userLoginStatus', JSON.stringify(value));
}

describe('apps/web utils/auth.ts — bootstrap 좀비 상태 방어층', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reloadMock.mockClear();
    jest.resetModules();
  });

  it('isLoggedIn: true + expiresAt null 좀비 상태 → reload 없이 logout 처리', async () => {
    // version: 1로 마킹된 좀비 케이스 (마이그레이션은 통과, store의 onRehydrateStorage 가드 + bootstrap 방어층이 정리).
    seedAuthLocalStorage({
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

    await jest.isolateModulesAsync(async () => {
      const useAuthStoreModule = await import('../store/useAuthStore');
      const useAuthStore = useAuthStoreModule.default;
      // 모듈 로드 직후 자동 실행되는 bootstrap이 완료될 때까지 대기.
      const authModule = await import('./auth');
      // getAuthHeader를 호출하면 내부에서 bootstrap을 await 하므로 완료 보장.
      await authModule.getAuthHeader();

      const finalState = useAuthStore.getState();
      expect(finalState.isLoggedIn).toBe(false);
      expect(finalState.accessToken).toBeNull();
      expect(finalState.refreshToken).toBeNull();
      // logoutAndRefreshPage가 아니라 logout만 호출돼야 함 (reload 없음 = 무한 루프 차단).
      expect(reloadMock).not.toHaveBeenCalled();
    });
  });

  it('빈 persist (비로그인 유저) → bootstrap 조용히 종료, reload 없음', async () => {
    await jest.isolateModulesAsync(async () => {
      const useAuthStoreModule = await import('../store/useAuthStore');
      const useAuthStore = useAuthStoreModule.default;
      const authModule = await import('./auth');
      await authModule.getAuthHeader();

      expect(useAuthStore.getState().isLoggedIn).toBe(false);
      expect(reloadMock).not.toHaveBeenCalled();
    });
  });
});
