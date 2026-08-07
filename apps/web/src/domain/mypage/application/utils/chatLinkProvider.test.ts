import { isSlackChatLink, normalizeChatPassword } from './chatLinkProvider';

describe('isSlackChatLink', () => {
  it('슬랙 워크스페이스 서브도메인 링크는 true', () => {
    expect(isSlackChatLink('https://letscareer.slack.com/archives/C123')).toBe(
      true,
    );
  });

  it('슬랙 초대 링크(join.slack.com)는 true', () => {
    expect(
      isSlackChatLink('https://join.slack.com/t/abc/shared_invite/xyz'),
    ).toBe(true);
  });

  it('카카오톡 오픈채팅 링크는 false', () => {
    expect(isSlackChatLink('https://open.kakao.com/o/abc123')).toBe(false);
  });

  it('빈 문자열은 false', () => {
    expect(isSlackChatLink('')).toBe(false);
  });

  it('URL로 파싱할 수 없는 문자열은 throw 없이 false', () => {
    expect(isSlackChatLink('not-a-url')).toBe(false);
  });

  it('slack.com을 포함하지만 호스트가 아닌 경우는 false', () => {
    expect(isSlackChatLink('https://example.com/?redirect=slack.com')).toBe(
      false,
    );
  });
});

describe('normalizeChatPassword', () => {
  it('일반 값은 trim 후 그대로 유지한다', () => {
    expect(normalizeChatPassword(' 1234 ')).toBe('1234');
  });

  it('null·undefined·빈 문자열·공백은 undefined', () => {
    expect(normalizeChatPassword(null)).toBeUndefined();
    expect(normalizeChatPassword(undefined)).toBeUndefined();
    expect(normalizeChatPassword('')).toBeUndefined();
    expect(normalizeChatPassword('   ')).toBeUndefined();
  });

  it('"없음"류 값은 코드 없음(undefined)으로 취급한다', () => {
    expect(normalizeChatPassword('없음')).toBeUndefined();
    expect(normalizeChatPassword(' 없다 ')).toBeUndefined();
    expect(normalizeChatPassword('None')).toBeUndefined();
    expect(normalizeChatPassword('N/A')).toBeUndefined();
  });
});
