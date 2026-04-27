/**
 * packages/api 의 env/axios 핵심 분기에 대한 회귀 검증.
 * env push2 이후 SERVER_API/V2/V3 가 절대 URL 로 들어와 baseURL 합성이 사라짐.
 * Push 3: 모듈-탑 throw 가 admin/mentor SPA 부트를 통째로 죽여 SSO 같은
 *   무관한 흐름까지 막는 부수효과가 있어, 호출 시점 fail-fast 로 좁힘.
 */

describe('packages/api env exports', () => {
  // 동적 require: jest 가 모듈을 isolated 로 로드해 process.env 변화를 반영하도록.
  function loadApi() {
    jest.resetModules();
    return require('@letscareer/api') as {
      SERVER_API: string;
      SERVER_API_V2: string;
      SERVER_API_V3: string;
      API_BASE_PATH: string;
      createDefaultAxios: () => unknown;
      createV2Axios: () => unknown;
      createV3Axios: () => unknown;
    };
  }

  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('NEXT_PUBLIC_SERVER_API* 가 SERVER_API/V2/V3 로 그대로 export', () => {
    process.env.NEXT_PUBLIC_SERVER_API = 'https://letsintern.kr/v1';
    process.env.NEXT_PUBLIC_SERVER_API_V2 = 'https://letsintern.kr/v2';
    process.env.NEXT_PUBLIC_SERVER_API_V3 = 'https://letsintern.kr/v3';
    process.env.NEXT_PUBLIC_API_BASE_PATH = 'https://letsintern.kr';
    const api = loadApi();
    expect(api.SERVER_API).toBe('https://letsintern.kr/v1');
    expect(api.SERVER_API_V2).toBe('https://letsintern.kr/v2');
    expect(api.SERVER_API_V3).toBe('https://letsintern.kr/v3');
    expect(api.API_BASE_PATH).toBe('https://letsintern.kr');
  });

  it('env 미설정이어도 모듈 로드는 통과 (빈 문자열 export)', () => {
    delete process.env.NEXT_PUBLIC_SERVER_API;
    delete process.env.NEXT_PUBLIC_SERVER_API_V2;
    delete process.env.NEXT_PUBLIC_SERVER_API_V3;
    delete process.env.NEXT_PUBLIC_API_BASE_PATH;
    const api = loadApi();
    expect(api.SERVER_API).toBe('');
    expect(api.SERVER_API_V2).toBe('');
    expect(api.SERVER_API_V3).toBe('');
    expect(api.API_BASE_PATH).toBe('');
  });

  it('NEXT_PUBLIC_SERVER_API 가 비면 createDefaultAxios 호출 시 throw', () => {
    delete process.env.NEXT_PUBLIC_SERVER_API;
    const { createDefaultAxios } = loadApi();
    expect(() => createDefaultAxios()).toThrow(
      /NEXT_PUBLIC_SERVER_API|baseURL/,
    );
  });

  it('NEXT_PUBLIC_SERVER_API_V2 가 비면 createV2Axios 호출 시 throw', () => {
    delete process.env.NEXT_PUBLIC_SERVER_API_V2;
    const { createV2Axios } = loadApi();
    expect(() => createV2Axios()).toThrow(
      /NEXT_PUBLIC_SERVER_API_V2|baseURL/,
    );
  });

  it('NEXT_PUBLIC_SERVER_API_V3 가 비면 createV3Axios 호출 시 throw', () => {
    delete process.env.NEXT_PUBLIC_SERVER_API_V3;
    const { createV3Axios } = loadApi();
    expect(() => createV3Axios()).toThrow(
      /NEXT_PUBLIC_SERVER_API_V3|baseURL/,
    );
  });
});

describe('createV2Axios baseURL', () => {
  function loadAxiosV2() {
    jest.resetModules();
    return require('@letscareer/api') as {
      createV2Axios: (options?: { baseURL?: string }) => {
        defaults: { baseURL?: string };
      };
    };
  }

  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.NEXT_PUBLIC_SERVER_API = 'https://letsintern.kr/v1';
    process.env.NEXT_PUBLIC_SERVER_API_V2 = 'https://letsintern.kr/v2';
    process.env.NEXT_PUBLIC_SERVER_API_V3 = 'https://letsintern.kr/v3';
    process.env.NEXT_PUBLIC_API_BASE_PATH = 'https://letsintern.kr';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('options.baseURL 이 없으면 SERVER_API_V2 그대로 사용', () => {
    const { createV2Axios } = loadAxiosV2();
    const instance = createV2Axios();
    expect(instance.defaults.baseURL).toBe('https://letsintern.kr/v2');
  });

  it('options.baseURL 이 빈 문자열이면 throw', () => {
    const { createV2Axios } = loadAxiosV2();
    expect(() => createV2Axios({ baseURL: '' })).toThrow(/baseURL/);
  });
});
