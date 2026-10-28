// 계약 5.6 slug 규칙. 경로 조작(`../`, `%2F`)이 섞인 값은 API 호출 전에 걸러낸다
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SLUG_MIN_LENGTH = 3;
const SLUG_MAX_LENGTH = 50;

export const isValidOneTimeFormSlug = (slug: string): boolean =>
  slug.length >= SLUG_MIN_LENGTH &&
  slug.length <= SLUG_MAX_LENGTH &&
  SLUG_PATTERN.test(slug);
