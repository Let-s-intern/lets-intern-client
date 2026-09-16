import { isSlackChatLink, normalizeChatPassword } from './chatLink';

describe('isSlackChatLink', () => {
  it('슬랙 초대 링크면 true', () => {
    expect(
      isSlackChatLink('https://join.slack.com/t/abc/shared_invite/xyz'),
    ).toBe(true);
  });

  it('카카오톡 오픈채팅 링크면 false', () => {
    expect(isSlackChatLink('https://open.kakao.com/o/abc123')).toBe(false);
  });

  /* 어드민이 자유 입력하는 값이라 URL 이 아닌 글자가 들어올 수 있다. */
  it('URL 이 아니면 false', () => {
    expect(isSlackChatLink('추후 공지')).toBe(false);
  });

  /* slack.com 을 흉내 낸 도메인을 슬랙으로 보면 엉뚱한 안내가 나간다. */
  it('호스트 끝이 slack.com 이 아니면 false', () => {
    expect(isSlackChatLink('https://notslack.com.evil.io/x')).toBe(false);
  });
});

describe('normalizeChatPassword', () => {
  it('값이 있으면 공백을 떼고 그대로 쓴다', () => {
    expect(normalizeChatPassword('  1234  ')).toBe('1234');
  });

  it('빈칸이면 undefined', () => {
    expect(normalizeChatPassword('   ')).toBeUndefined();
    expect(normalizeChatPassword(null)).toBeUndefined();
    expect(normalizeChatPassword(undefined)).toBeUndefined();
  });

  /* 운영이 "없음" 이라고 적어 두는 경우가 있다. 그대로 두면 코드 모달이 뜬다. */
  it('"없음"류 값은 코드 없음으로 본다', () => {
    expect(normalizeChatPassword('없음')).toBeUndefined();
    expect(normalizeChatPassword('N/A')).toBeUndefined();
  });
});
