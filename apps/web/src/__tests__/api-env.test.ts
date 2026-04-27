/**
 * packages/api 의 env/axios 핵심 분기에 대한 회귀 검증.
 * env push2 이후 SERVER_API/V2/V3 가 절대 URL 로 들어와 baseURL 합성이 사라짐.
 * Push 1: silent 빈값 fallback 제거 → 모듈 로드 시점에 throw 검증.
 */

describe('packages/api env exports', () => {
  // 동적 require: jest 가 모듈을 isolated 로 로드해 process.env 변화를 반영하도록.
  function loadEnv() {
    jest.resetModules();
    return require('@letscareer/api') as {
      SERVER_API: string;
      SERVER_API_V2: string;
      SERVER_API_V3: string;
      API_BASE_PATH: string;
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
    const env = loadEnv();
    expect(env.SERVER_API).toBe('https://letsintern.kr/v1');
    expect(env.SERVER_API_V2).toBe('https://letsintern.kr/v2');
    expect(env.SERVER_API_V3).toBe('https://letsintern.kr/v3');
    expect(env.API_BASE_PATH).toBe('https://letsintern.kr');
  });

  it('NEXT_PUBLIC_SERVER_API 가 비면 모듈 로드 시 throw', () => {
    delete process.env.NEXT_PUBLIC_SERVER_API;
    process.env.NEXT_PUBLIC_SERVER_API_V2 = 'https://letsintern.kr/v2';
    process.env.NEXT_PUBLIC_SERVER_API_V3 = 'https://letsintern.kr/v3';
    process.env.NEXT_PUBLIC_API_BASE_PATH = 'https://letsintern.kr';
    expect(() => loadEnv()).toThrow(/NEXT_PUBLIC_SERVER_API/);
  });

  it('NEXT_PUBLIC_SERVER_API_V2 가 비면 모듈 로드 시 throw', () => {
    process.env.NEXT_PUBLIC_SERVER_API = 'https://letsintern.kr/v1';
    delete process.env.NEXT_PUBLIC_SERVER_API_V2;
    process.env.NEXT_PUBLIC_SERVER_API_V3 = 'https://letsintern.kr/v3';
    process.env.NEXT_PUBLIC_API_BASE_PATH = 'https://letsintern.kr';
    expect(() => loadEnv()).toThrow(/NEXT_PUBLIC_SERVER_API_V2/);
  });

  it('NEXT_PUBLIC_SERVER_API_V3 가 비면 모듈 로드 시 throw', () => {
    process.env.NEXT_PUBLIC_SERVER_API = 'https://letsintern.kr/v1';
    process.env.NEXT_PUBLIC_SERVER_API_V2 = 'https://letsintern.kr/v2';
    delete process.env.NEXT_PUBLIC_SERVER_API_V3;
    process.env.NEXT_PUBLIC_API_BASE_PATH = 'https://letsintern.kr';
    expect(() => loadEnv()).toThrow(/NEXT_PUBLIC_SERVER_API_V3/);
  });

  it('NEXT_PUBLIC_API_BASE_PATH 가 비면 모듈 로드 시 throw', () => {
    process.env.NEXT_PUBLIC_SERVER_API = 'https://letsintern.kr/v1';
    process.env.NEXT_PUBLIC_SERVER_API_V2 = 'https://letsintern.kr/v2';
    process.env.NEXT_PUBLIC_SERVER_API_V3 = 'https://letsintern.kr/v3';
    delete process.env.NEXT_PUBLIC_API_BASE_PATH;
    expect(() => loadEnv()).toThrow(/NEXT_PUBLIC_API_BASE_PATH/);
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
