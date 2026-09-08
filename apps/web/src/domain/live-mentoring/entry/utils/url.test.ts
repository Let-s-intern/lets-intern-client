import { isOpenableUrl } from './url';

describe('isOpenableUrl', () => {
  it('http/https 는 통과한다', () => {
    expect(isOpenableUrl('https://letscareer.notion.site/mentee')).toBe(true);
    expect(isOpenableUrl('http://example.com')).toBe(true);
  });

  it('javascript: 스킴은 막는다', () => {
    // href 에 그대로 실리면 클릭 시 이 페이지 origin 에서 실행된다.
    expect(isOpenableUrl('javascript:alert(1)')).toBe(false);
  });

  it('파싱할 수 없는 값은 막는다', () => {
    expect(isOpenableUrl('not a url')).toBe(false);
    expect(isOpenableUrl('')).toBe(false);
  });
});
