import { isAllowedNotionUrl, parseNotionUrl } from './notion';

describe('isAllowedNotionUrl', () => {
  // 허용 케이스
  test('허용: letsintern.notion.site https URL', () => {
    expect(isAllowedNotionUrl('https://letsintern.notion.site/abc')).toBe(true);
  });

  test('허용: 외부 워크스페이스 publish URL (boggy-chestnut-60b.notion.site)', () => {
    expect(
      isAllowedNotionUrl(
        'https://boggy-chestnut-60b.notion.site/abc?query=1',
      ),
    ).toBe(true);
  });

  test('허용: 다단계 서브도메인 (a.b.notion.site)', () => {
    expect(isAllowedNotionUrl('https://a.b.notion.site/c')).toBe(true);
  });

  test('허용: 실 운영자 보고 URL (workspace.notion.site/<id>?source=copy_link)', () => {
    expect(
      isAllowedNotionUrl(
        'https://workspace.notion.site/35f4740158fa80b4b79cd69e01eddca2?source=copy_link',
      ),
    ).toBe(true);
  });

  // 거부 케이스
  test('거부: 서브도메인 없는 notion.site', () => {
    expect(isAllowedNotionUrl('https://notion.site/abc')).toBe(false);
  });

  test('거부: www.notion.so (노션 측에서 iframe 임베드 차단)', () => {
    expect(isAllowedNotionUrl('https://www.notion.so/abc')).toBe(false);
  });

  test('거부: 임의의 *.notion.so 도메인', () => {
    expect(isAllowedNotionUrl('https://anything.notion.so/page-id')).toBe(
      false,
    );
  });

  test('거부: 위조 도메인 evilnotion.site', () => {
    expect(isAllowedNotionUrl('https://evilnotion.site/abc')).toBe(false);
  });

  test('거부: 위조 도메인 notion-site.com', () => {
    expect(isAllowedNotionUrl('https://notion-site.com/abc')).toBe(false);
  });

  test('거부: www.notion.so.evil.com 류 호스트 위조', () => {
    expect(isAllowedNotionUrl('https://www.notion.so.evil.com/abc')).toBe(
      false,
    );
  });

  test('거부: http 스킴 (https 아님)', () => {
    expect(isAllowedNotionUrl('http://x.notion.site/abc')).toBe(false);
  });

  test('거부: javascript: 스킴', () => {
    expect(isAllowedNotionUrl('javascript:alert(1)')).toBe(false);
  });

  test('거부: 빈 문자열', () => {
    expect(isAllowedNotionUrl('')).toBe(false);
  });

  test('거부: 파싱 실패하는 잘못된 URL', () => {
    expect(isAllowedNotionUrl('not a url')).toBe(false);
  });

  test('거부: 다른 도메인이 path 에 들어간 URL', () => {
    expect(isAllowedNotionUrl('https://evil.com/letsintern.notion.site')).toBe(
      false,
    );
  });
});

describe('parseNotionUrl', () => {
  test('허용 URL 은 trim 된 그대로 반환', () => {
    expect(parseNotionUrl('  https://letsintern.notion.site/abc  ')).toBe(
      'https://letsintern.notion.site/abc',
    );
  });

  test('허용 URL (외부 워크스페이스) 반환', () => {
    expect(
      parseNotionUrl('https://boggy-chestnut-60b.notion.site/abc'),
    ).toBe('https://boggy-chestnut-60b.notion.site/abc');
  });

  test('거부 URL (www.notion.so) 은 null', () => {
    expect(parseNotionUrl('https://www.notion.so/abc')).toBe(null);
  });

  test('거부 URL (path 사칭) 은 null', () => {
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
