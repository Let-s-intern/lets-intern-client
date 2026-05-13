import { describe, expect, test } from 'vitest';

import { isAllowedNotionUrl, parseNotionUrl } from './notion';

describe('isAllowedNotionUrl', () => {
  test('허용: letsintern.notion.site https URL', () => {
    expect(isAllowedNotionUrl('https://letsintern.notion.site/abc')).toBe(true);
  });

  test('허용: www.notion.so https URL', () => {
    expect(isAllowedNotionUrl('https://www.notion.so/page-id')).toBe(true);
  });

  test('거부: http (스킴 불일치)', () => {
    expect(isAllowedNotionUrl('http://letsintern.notion.site/abc')).toBe(false);
  });

  test('거부: 다른 도메인이 path 에 들어간 URL', () => {
    expect(
      isAllowedNotionUrl('https://evil.com/letsintern.notion.site'),
    ).toBe(false);
  });

  test('거부: javascript: 스킴', () => {
    expect(isAllowedNotionUrl('javascript:alert(1)')).toBe(false);
  });

  test('거부: 유사 호스트 (notion-fake.site)', () => {
    expect(isAllowedNotionUrl('https://notion-fake.site/abc')).toBe(false);
  });

  test('거부: 빈 문자열', () => {
    expect(isAllowedNotionUrl('')).toBe(false);
  });

  test('거부: www 없는 notion.so (화이트리스트 외)', () => {
    expect(isAllowedNotionUrl('https://notion.so/page')).toBe(false);
  });

  test('거부: 서브도메인 위조 (xxx.letsintern.notion.site)', () => {
    expect(
      isAllowedNotionUrl('https://xxx.letsintern.notion.site/abc'),
    ).toBe(false);
  });

  test('거부: 파싱 실패하는 잘못된 URL', () => {
    expect(isAllowedNotionUrl('not a url')).toBe(false);
  });
});

describe('parseNotionUrl', () => {
  test('허용 URL 은 trim 된 그대로 반환', () => {
    expect(parseNotionUrl('  https://letsintern.notion.site/abc  ')).toBe(
      'https://letsintern.notion.site/abc',
    );
  });

  test('허용 URL (www.notion.so) 반환', () => {
    expect(parseNotionUrl('https://www.notion.so/page-id')).toBe(
      'https://www.notion.so/page-id',
    );
  });

  test('거부 URL 은 null', () => {
    expect(parseNotionUrl('https://evil.com/letsintern.notion.site')).toBe(
      null,
    );
  });

  test('빈 문자열은 null', () => {
    expect(parseNotionUrl('')).toBe(null);
    expect(parseNotionUrl('   ')).toBe(null);
  });

  test('javascript: 스킴은 null', () => {
    expect(parseNotionUrl('javascript:alert(1)')).toBe(null);
  });
});
