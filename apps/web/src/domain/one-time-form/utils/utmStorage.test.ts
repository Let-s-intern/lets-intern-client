import {
  clearUtm,
  collectUtm,
  readUtm,
  saveUtmOnce,
  utmStorageKey,
  type UtmStorage,
} from './utmStorage';

const createFakeStorage = (): UtmStorage & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
};

const throwingStorage: UtmStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
  removeItem: () => {
    throw new Error('SecurityError');
  },
};

describe('collectUtm', () => {
  it('utm_* 5종과 referrer 를 읽는다', () => {
    expect(
      collectUtm(
        '?utm_source=instagram&utm_medium=story&utm_campaign=1115&utm_content=a&utm_term=portfolio',
        'https://event-xxx.vercel.app/',
      ),
    ).toEqual({
      utmSource: 'instagram',
      utmMedium: 'story',
      utmCampaign: '1115',
      utmContent: 'a',
      utmTerm: 'portfolio',
      referrer: 'https://event-xxx.vercel.app/',
    });
  });

  it('없거나 빈 값은 null 이다', () => {
    expect(collectUtm('?utm_source=&foo=bar', '')).toEqual({
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      referrer: null,
    });
  });

  it('UTM 은 255자, referrer 는 1000자로 자른다', () => {
    const utm = collectUtm(
      `?utm_source=${'a'.repeat(300)}&utm_term=${'b'.repeat(255)}`,
      `https://example.com/${'c'.repeat(1200)}`,
    );

    expect(utm.utmSource).toHaveLength(255);
    expect(utm.utmTerm).toHaveLength(255);
    expect(utm.referrer).toHaveLength(1000);
    expect(utm.referrer?.startsWith('https://example.com/')).toBe(true);
  });
});

describe('saveUtmOnce · readUtm · clearUtm', () => {
  const first = collectUtm('?utm_source=instagram', 'https://a.example/');
  const second = collectUtm('?utm_source=kakao', 'https://b.example/');

  it('첫 진입 값을 저장하고 이후 진입에서 덮지 않는다', () => {
    const storage = createFakeStorage();

    saveUtmOnce('portfolio-1115', first, storage);
    saveUtmOnce('portfolio-1115', second, storage);

    expect(readUtm('portfolio-1115', storage)).toEqual(first);
    expect(storage.data.has('one-time-form:portfolio-1115:utm')).toBe(true);
  });

  it('slug 마다 따로 보관한다', () => {
    const storage = createFakeStorage();

    saveUtmOnce('portfolio-1115', first, storage);
    saveUtmOnce('seminar-1130', second, storage);

    expect(readUtm('portfolio-1115', storage)).toEqual(first);
    expect(readUtm('seminar-1130', storage)).toEqual(second);
  });

  it('없으면 null 을 읽고, 지우면 다음 진입 값을 새로 저장한다', () => {
    const storage = createFakeStorage();
    expect(readUtm('portfolio-1115', storage)).toBeNull();

    saveUtmOnce('portfolio-1115', first, storage);
    clearUtm('portfolio-1115', storage);
    expect(readUtm('portfolio-1115', storage)).toBeNull();

    saveUtmOnce('portfolio-1115', second, storage);
    expect(readUtm('portfolio-1115', storage)).toEqual(second);
  });

  it('깨진 값은 null 로 읽는다', () => {
    const storage = createFakeStorage();
    storage.setItem(utmStorageKey('portfolio-1115'), '{broken');

    expect(readUtm('portfolio-1115', storage)).toBeNull();
  });

  it('저장소가 던지거나 없어도 멈추지 않는다', () => {
    expect(() =>
      saveUtmOnce('portfolio-1115', first, throwingStorage),
    ).not.toThrow();
    expect(readUtm('portfolio-1115', throwingStorage)).toBeNull();
    expect(() => clearUtm('portfolio-1115', throwingStorage)).not.toThrow();

    expect(() => saveUtmOnce('portfolio-1115', first, null)).not.toThrow();
    expect(readUtm('portfolio-1115', null)).toBeNull();
    expect(() => clearUtm('portfolio-1115', null)).not.toThrow();
  });

  it('저장소를 넘기지 않으면 sessionStorage 를 쓴다', () => {
    window.sessionStorage.clear();

    saveUtmOnce('portfolio-1115', first);

    expect(
      JSON.parse(
        window.sessionStorage.getItem('one-time-form:portfolio-1115:utm')!,
      ),
    ).toEqual(first);
    expect(readUtm('portfolio-1115')).toEqual(first);
    clearUtm('portfolio-1115');
    expect(
      window.sessionStorage.getItem('one-time-form:portfolio-1115:utm'),
    ).toBeNull();
  });
});
