import { parseBlogId } from './experiment';

describe('parseBlogId', () => {
  it('블로그 상세 경로에서 id(첫 세그먼트) 추출', () => {
    expect(parseBlogId('/blog/123/some-title')).toBe('123');
    expect(parseBlogId('/blog/abc')).toBe('abc');
  });

  it('블로그 경로가 아니거나 null이면 null', () => {
    expect(parseBlogId('/program/1')).toBeNull();
    expect(parseBlogId(null)).toBeNull();
    expect(parseBlogId('/blog')).toBeNull();
  });
});
