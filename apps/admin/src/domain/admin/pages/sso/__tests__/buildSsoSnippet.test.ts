import { describe, expect, it } from 'vitest';

import { buildPopupSnippet } from '../buildSsoSnippet';

describe('buildPopupSnippet', () => {
  const base = {
    allowedRedirectUri: 'https://vod.letscareer.co.kr/auth/callback/popup',
    serviceName: '무료 vod 서비스',
    ssoOrigin: 'https://letscareer.co.kr',
  };

  it('등록된 URL 을 그대로 담는다', () => {
    // 이 값이 서버의 완전일치 비교 대상이다. 한 글자라도 달라지면 복사해 가는 의미가 없다.
    expect(buildPopupSnippet(base)).toContain(
      '"https://vod.letscareer.co.kr/auth/callback/popup"',
    );
  });

  it('서비스명과 SSO 주소를 담는다', () => {
    const snippet = buildPopupSnippet(base);
    expect(snippet).toContain('무료 vod 서비스');
    expect(snippet).toContain('https://letscareer.co.kr');
  });

  it('따옴표가 섞인 서비스명도 코드를 깨뜨리지 않는다', () => {
    const snippet = buildPopupSnippet({
      ...base,
      serviceName: '따옴표 " 포함',
    });
    // JSON.stringify 로 이스케이프되어 문자열 리터럴이 닫히지 않는다.
    expect(snippet).toContain('\\"');
  });

  it('ssoOrigin 을 넘기지 않으면 운영 주소로 떨어진다', () => {
    const snippet = buildPopupSnippet({
      allowedRedirectUri: base.allowedRedirectUri,
      serviceName: base.serviceName,
    });
    expect(snippet).toContain('https://letscareer.co.kr');
  });

  it('모바일 폴백과 팝업 차단 폴백이 들어 있다', () => {
    const snippet = buildPopupSnippet(base);
    expect(snippet).toContain('window.innerWidth < 768');
    expect(snippet).toContain('if (!popup)');
  });

  it('메시지 수신부에 오리진 확인이 들어 있다', () => {
    // 이게 빠진 코드를 복사해 가면 아무 사이트나 로그인 완료 신호를 보낼 수 있다.
    expect(buildPopupSnippet(base)).toContain(
      'event.origin !== window.location.origin',
    );
  });
});
