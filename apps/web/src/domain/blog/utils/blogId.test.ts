import { isValidBlogId } from './blogId';

describe('isValidBlogId', () => {
  it('숫자로만 이루어진 id를 허용한다', () => {
    expect(isValidBlogId('1')).toBe(true);
    expect(isValidBlogId('999999')).toBe(true);
  });

  it('숫자가 아닌 세그먼트를 거부한다', () => {
    // 실제 크래시를 만든 값과 흔한 크롤러 프로브
    expect(isValidBlogId('fill')).toBe(false);
    expect(isValidBlogId('rss')).toBe(false);
    expect(isValidBlogId('sitemap.xml')).toBe(false);
  });

  it('숫자가 섞여 있어도 전체가 숫자가 아니면 거부한다', () => {
    expect(isValidBlogId('12a')).toBe(false);
    expect(isValidBlogId('-1')).toBe(false);
    expect(isValidBlogId('1.5')).toBe(false);
    expect(isValidBlogId(' 1')).toBe(false);
  });

  it('빈 문자열을 거부한다', () => {
    expect(isValidBlogId('')).toBe(false);
  });
});
