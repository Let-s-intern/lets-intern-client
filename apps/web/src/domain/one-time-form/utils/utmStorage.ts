// 계약 11.4: 진입 시 UTM 과 referrer 를 slug 별 sessionStorage 에 보관하고 U3 성공 때 지운다.
// 키가 이미 있으면 덮지 않는다. 로그인 이동과 토스 왕복 뒤에도 첫 진입 값이 남는다.

export interface OneTimeFormUtm {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
}

/** 테스트에서 가짜를 넣을 수 있도록 필요한 메서드만 받는다 */
export type UtmStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

// 계약 5.6 길이. 서버도 같은 길이로 자른다
const UTM_MAX_LENGTH = 255;
const REFERRER_MAX_LENGTH = 1000;

const UTM_PARAMS = {
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  utmContent: 'utm_content',
  utmTerm: 'utm_term',
} as const;

export const utmStorageKey = (slug: string) => `one-time-form:${slug}:utm`;

const toStoredValue = (value: string | null, maxLength: number) =>
  value ? value.slice(0, maxLength) : null;

/** URL 쿼리 문자열과 document.referrer 에서 보관할 값을 만든다. 없거나 빈 값은 null */
export const collectUtm = (
  search: string,
  referrer: string,
): OneTimeFormUtm => {
  const params = new URLSearchParams(search);
  const read = (name: string) =>
    toStoredValue(params.get(name), UTM_MAX_LENGTH);

  return {
    utmSource: read(UTM_PARAMS.utmSource),
    utmMedium: read(UTM_PARAMS.utmMedium),
    utmCampaign: read(UTM_PARAMS.utmCampaign),
    utmContent: read(UTM_PARAMS.utmContent),
    utmTerm: read(UTM_PARAMS.utmTerm),
    referrer: toStoredValue(referrer, REFERRER_MAX_LENGTH),
  };
};

// 사생활 보호 모드 등에서는 sessionStorage 에 접근하는 것만으로 던질 수 있다
export const getSessionStorage = (): UtmStorage | null => {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
};

/** 키가 없을 때만 저장한다. 저장소를 쓸 수 없으면 조용히 넘어간다 */
export const saveUtmOnce = (
  slug: string,
  utm: OneTimeFormUtm,
  storage: UtmStorage | null = getSessionStorage(),
): void => {
  if (!storage) return;
  try {
    const key = utmStorageKey(slug);
    if (storage.getItem(key) !== null) return;
    storage.setItem(key, JSON.stringify(utm));
  } catch {
    // UTM 은 신청을 막을 이유가 아니다
  }
};

/** 보관한 값. 없거나 읽을 수 없으면 null */
export const readUtm = (
  slug: string,
  storage: UtmStorage | null = getSessionStorage(),
): OneTimeFormUtm | null => {
  if (!storage) return null;
  try {
    const raw = storage.getItem(utmStorageKey(slug));
    return raw === null ? null : (JSON.parse(raw) as OneTimeFormUtm);
  } catch {
    return null;
  }
};

/** U3 성공 뒤 지운다 */
export const clearUtm = (
  slug: string,
  storage: UtmStorage | null = getSessionStorage(),
): void => {
  try {
    storage?.removeItem(utmStorageKey(slug));
  } catch {
    // 지우지 못해도 다음 신청은 서버가 중복으로 막는다
  }
};
