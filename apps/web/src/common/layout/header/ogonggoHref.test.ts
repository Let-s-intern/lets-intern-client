import { ogonggoWebHref, OGONGGO_WEB_HOME } from './ogonggoHref';

const mockState = {
  isLoggedIn: false,
  accessToken: null as string | null,
  refreshToken: null as string | null,
  accessTokenExpiresAt: null as number | null,
};

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: { getState: () => mockState },
}));

const loggedIn = (overrides: Partial<typeof mockState> = {}) =>
  Object.assign(mockState, {
    isLoggedIn: true,
    accessToken: 'access.token',
    refreshToken: 'refresh.token',
    accessTokenExpiresAt: Date.now() + 10 * 60 * 1000,
    ...overrides,
  });

describe('ogonggoWebHref (오공고로 로그인 이어 주기)', () => {
  afterEach(() => {
    Object.assign(mockState, {
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
    });
  });

  it('로그아웃 상태면 토큰 없는 첫 화면이다', () => {
    expect(ogonggoWebHref()).toBe(OGONGGO_WEB_HOME);
    expect(OGONGGO_WEB_HOME).not.toContain('#');
  });

  it('로그인 상태면 /auth/handoff 로 가며 토큰을 해시에만 싣는다', () => {
    loggedIn();
    const url = new URL(ogonggoWebHref());

    expect(url.pathname).toBe('/auth/handoff');
    expect(url.hash).toBe(
      `#__sso=${encodeURIComponent('access.token|refresh.token')}`,
    );
    // 쿼리에 실리면 서버 로그와 분석 도구에 남는다.
    expect(url.search).not.toContain('token');
    expect(url.searchParams.get('utm_source')).toBe('letscareer');
  });

  it('액세스 토큰이 만료됐으면 토큰을 넘기지 않는다', () => {
    loggedIn({ accessTokenExpiresAt: Date.now() - 1000 });
    expect(ogonggoWebHref()).toBe(OGONGGO_WEB_HOME);
  });

  it('리프레시 토큰이 없으면 토큰을 넘기지 않는다', () => {
    loggedIn({ refreshToken: null });
    expect(ogonggoWebHref()).toBe(OGONGGO_WEB_HOME);
  });
});
