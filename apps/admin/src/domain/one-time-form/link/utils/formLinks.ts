/** 웹 주소 끝의 `/` 를 떼어 경로를 그대로 이어 붙일 수 있게 한다 */
const trimWebBase = (webBase: string) => webBase.replace(/\/+$/, '');

/** 웹 신청 화면 `/form/[slug]` (API 계약 11.1) */
export const buildApplyUrl = (webBase: string, slug: string) =>
  `${trimWebBase(webBase)}/form/${encodeURIComponent(slug)}`;

/** 웹 신청 확인·취소 화면 `/form/[slug]/my` (API 계약 11.1) */
export const buildMyUrl = (webBase: string, slug: string) =>
  `${buildApplyUrl(webBase, slug)}/my`;

const UTM_KEY = /^utm_/;

const toPairs = (query: string) =>
  query
    .replace(/^\?/, '')
    .split('&')
    .filter((pair) => pair !== '');

const keyOf = (pair: string) => pair.split('=')[0];

const hasKey = (record: Record<string, string>, key: string) =>
  Object.prototype.hasOwnProperty.call(record, key);

/**
 * 상세페이지 주소의 `utm_*` 를 신청 URL 에 옮겨 붙인다.
 * 신청 URL 에 이미 있는 쿼리는 두고, 같은 키는 상세페이지 값을 쓴다. `utm_*` 가 아닌 값은 넘기지 않는다.
 * 값은 다시 인코딩하지 않고 받은 그대로 옮긴다.
 * 팝업용 코드(`popupCode.ts`)가 같은 순서로 같은 일을 한다. 한쪽을 고치면 다른 쪽도 고친다.
 */
export const mergeUtmParams = (applyUrl: string, pageSearch: string) => {
  const utmByKey: Record<string, string> = {};
  const utmKeys: string[] = [];
  toPairs(pageSearch).forEach((pair) => {
    const key = keyOf(pair);
    if (!UTM_KEY.test(key)) return;
    if (!hasKey(utmByKey, key)) utmKeys.push(key);
    utmByKey[key] = pair;
  });
  if (utmKeys.length === 0) return applyUrl;

  const queryStart = applyUrl.indexOf('?');
  const path = queryStart < 0 ? applyUrl : applyUrl.slice(0, queryStart);
  const kept =
    queryStart < 0
      ? []
      : toPairs(applyUrl.slice(queryStart)).filter(
          (pair) => !hasKey(utmByKey, keyOf(pair)),
        );
  const pairs = kept.concat(utmKeys.map((key) => utmByKey[key]));
  return `${path}?${pairs.join('&')}`;
};
