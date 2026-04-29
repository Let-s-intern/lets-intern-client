import { getCanonicalSiteUrl, getCanonicalUrl, getRobotsMetadata } from './url';

describe('getCanonicalSiteUrl', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.BASE_URL;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('NEXT_PUBLIC_SITE_URL 이 우선', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.letscareer.co.kr';
    process.env.BASE_URL = 'http://localhost:3000';
    expect(getCanonicalSiteUrl()).toBe('https://www.letscareer.co.kr');
  });

  it('NEXT_PUBLIC_SITE_URL 미지정 시 BASE_URL 로 fallback', () => {
    process.env.BASE_URL = 'https://preview.example.com';
    expect(getCanonicalSiteUrl()).toBe('https://preview.example.com');
  });

  it('trailing slash 제거', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.letscareer.co.kr///';
    expect(getCanonicalSiteUrl()).toBe('https://www.letscareer.co.kr');
  });
});

describe('getCanonicalUrl', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.letscareer.co.kr';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('빈 pathname 은 사이트 URL 그대로', () => {
    expect(getCanonicalUrl('')).toBe('https://www.letscareer.co.kr');
  });

  it('leading slash 없으면 자동 추가', () => {
    expect(getCanonicalUrl('curation')).toBe(
      'https://www.letscareer.co.kr/curation',
    );
  });
});

describe('getRobotsMetadata', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_PROFILE;
    delete process.env.NO_INDEX;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('production 프로파일 + NO_INDEX 미설정 → index, follow', () => {
    process.env.NEXT_PUBLIC_PROFILE = 'production';
    expect(getRobotsMetadata()).toBe('index, follow');
  });

  it('NO_INDEX=true 면 production 이어도 noindex 강제', () => {
    process.env.NEXT_PUBLIC_PROFILE = 'production';
    process.env.NO_INDEX = 'true';
    expect(getRobotsMetadata()).toBe('noindex, nofollow');
  });

  it('production 외 프로파일 → noindex 강제', () => {
    process.env.NEXT_PUBLIC_PROFILE = 'development';
    expect(getRobotsMetadata()).toBe('noindex, nofollow');
  });
});
