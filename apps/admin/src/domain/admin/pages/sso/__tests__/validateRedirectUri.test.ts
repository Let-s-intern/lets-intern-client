import { describe, expect, it } from 'vitest';

import { validateRedirectUri } from '../validateRedirectUri';

/**
 * 이 검증은 오타를 막는 장치다. 최종 신뢰 경계는 서버의 `isAllowedRedirectUri` 이므로
 * 여기서 무엇을 통과시켰는지가 보안 결론이 되지는 않는다.
 *
 * 다만 **막는 쪽이 과하면 개발자가 자기 로컬 콜백을 등록하지 못한다.** 그래서
 * 통과 케이스도 함께 못 박는다.
 */

describe('validateRedirectUri', () => {
  it('https 전체 주소는 통과한다', () => {
    expect(
      validateRedirectUri('https://vod.letscareer.co.kr/auth/callback'),
    ).toBeNull();
  });

  it('앞뒤 공백은 문제 삼지 않는다', () => {
    // 붙여넣기에 딸려 오는 공백까지 오류로 돌려주면 원인을 짐작하기 어렵다.
    expect(
      validateRedirectUri('  https://vod.letscareer.co.kr/auth/callback  '),
    ).toBeNull();
  });

  it('빈 값은 사유를 돌려준다', () => {
    expect(validateRedirectUri('')).toBe('허용 URL을 입력해 주세요.');
    expect(validateRedirectUri('   ')).toBe('허용 URL을 입력해 주세요.');
  });

  it('스킴이 없으면 거절한다', () => {
    // 스킴 없는 값은 서버가 어떤 프로토콜로 읽을지 정해지지 않는다.
    expect(validateRedirectUri('vod.letscareer.co.kr/auth/callback')).toMatch(
      /https:\/\//,
    );
  });

  it('localhost 는 http 로도 등록할 수 있다', () => {
    expect(
      validateRedirectUri('http://localhost:3000/auth/callback'),
    ).toBeNull();
    expect(
      validateRedirectUri('http://127.0.0.1:3000/auth/callback'),
    ).toBeNull();
  });

  it('localhost 가 아닌 http 는 거절한다', () => {
    // 토큰이 URL 쿼리로 실려 간다(PRD 확정 사항 7). 평문 리다이렉트면 그대로 노출된다.
    expect(
      validateRedirectUri('http://vod.letscareer.co.kr/auth/callback'),
    ).toMatch(/localhost/);
  });

  it('http·https 가 아닌 스킴은 거절한다', () => {
    expect(validateRedirectUri('javascript:alert(1)')).toBe(
      'http 또는 https 주소만 등록할 수 있습니다.',
    );
  });
});
