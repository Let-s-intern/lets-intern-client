import { isValidOneTimeFormSlug } from './isValidOneTimeFormSlug';

describe('isValidOneTimeFormSlug (계약 5.6)', () => {
  it.each(['portfolio-1115', 'zero-test', 'abc', 'a'.repeat(50)])(
    '%s 는 허용한다',
    (slug) => {
      expect(isValidOneTimeFormSlug(slug)).toBe(true);
    },
  );

  it.each([
    ['경로 이동', '../admin'],
    ['슬래시', 'a/b'],
    ['인코딩된 슬래시', '..%2Fadmin'],
    ['대문자', 'Portfolio-1115'],
    ['앞 하이픈', '-zero-test'],
    ['뒤 하이픈', 'zero-test-'],
    ['연속 하이픈', 'zero--test'],
    ['너무 짧음', 'ab'],
    ['너무 김', 'a'.repeat(51)],
    ['빈 문자열', ''],
  ])('%s(%s) 는 거절한다', (_, slug) => {
    expect(isValidOneTimeFormSlug(slug)).toBe(false);
  });
});
