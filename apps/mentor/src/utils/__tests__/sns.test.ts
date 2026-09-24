import { describe, expect, it } from 'vitest';

import { serializeSnsList, toSnsUrl } from '../sns';

describe('serializeSnsList', () => {
  /*
   * LC-3306 회귀 테스트.
   *
   * 서버는 null 을 "바꾸지 않음"으로 받는다. 전부 지웠을 때 null 을 보내면 기존 SNS 가
   * 그대로 남고, 저장 직후 다시 불러온 값이 폼에 되돌아온다.
   */
  it('모두 비면 빈 문자열을 반환한다', () => {
    expect(serializeSnsList([])).toBe('');
    expect(serializeSnsList(['', '  '])).toBe('');
  });

  it('빈 항목을 빼고 JSON 배열로 직렬화한다', () => {
    expect(serializeSnsList(['https://a.com', ''])).toBe('["https://a.com"]');
  });
});

/* LC-3307 — URL 이 아닌 값은 저장하지 않는다. 도메인만 쓰면 https:// 를 붙인다. */
describe('toSnsUrl', () => {
  it('http·https 주소는 그대로 둔다', () => {
    expect(toSnsUrl('https://instagram.com/a')).toBe('https://instagram.com/a');
    expect(toSnsUrl('http://blog.naver.com/x')).toBe('http://blog.naver.com/x');
  });

  it('스킴이 없으면 https:// 를 붙인다', () => {
    expect(toSnsUrl('instagram.com/a')).toBe('https://instagram.com/a');
    expect(toSnsUrl('  instagram.com/a  ')).toBe('https://instagram.com/a');
  });

  it.each(['instagram', 'https://', 'javascript:alert(1)', 'mailto:a@b.com'])(
    '%s 는 저장할 수 없다',
    (value) => {
      expect(toSnsUrl(value)).toBeNull();
    },
  );
});
