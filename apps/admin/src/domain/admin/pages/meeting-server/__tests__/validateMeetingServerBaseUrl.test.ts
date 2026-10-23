import { describe, expect, it } from 'vitest';

import { validateMeetingServerBaseUrl } from '../validateMeetingServerBaseUrl';

/**
 * 서버 `MeetingServerServiceImpl#validateBaseUrl` 이 거절하는 주소를 여기서도 거절해야 한다.
 * 어긋나면 화면은 통과시키고 서버가 400 을 돌려 운영이 이유를 모른다.
 */
describe('validateMeetingServerBaseUrl', () => {
  it('https 로 시작하고 / 로 끝나면 통과한다', () => {
    expect(
      validateMeetingServerBaseUrl('https://jitsi-meet.letscareer.co.kr/'),
    ).toBeNull();
  });

  it('앞뒤 공백은 걷어서 본다', () => {
    expect(
      validateMeetingServerBaseUrl('  https://jitsi-meet.letscareer.co.kr/  '),
    ).toBeNull();
  });

  it.each([
    ['', '주소를 입력해 주세요.'],
    [
      'jitsi-meet.letscareer.co.kr/',
      'https://로 시작하는 전체 주소를 입력해 주세요.',
    ],
    ['http://jitsi-meet.letscareer.co.kr/', 'https 주소만 등록할 수 있습니다.'],
    [
      'https://jitsi-meet.letscareer.co.kr@evil.example/',
      '주소에 사용자 정보(@)를 넣을 수 없습니다.',
    ],
    [
      'https://jitsi-meet.letscareer.co.kr/?',
      '주소에 ? 나 # 를 넣을 수 없습니다.',
    ],
    [
      'https://jitsi-meet.letscareer.co.kr/#a',
      '주소에 ? 나 # 를 넣을 수 없습니다.',
    ],
    ['https://jitsi-meet.letscareer.co.kr', '주소는 / 로 끝나야 합니다.'],
  ])('%s 는 거절한다', (value, message) => {
    expect(validateMeetingServerBaseUrl(value)).toBe(message);
  });
});
