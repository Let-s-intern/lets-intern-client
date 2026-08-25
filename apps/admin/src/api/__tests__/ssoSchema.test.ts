import { describe, expect, it } from 'vitest';

import {
  ssoRedirectWhitelistListSchema,
  ssoRedirectWhitelistSchema,
} from '../ssoSchema';

/**
 * 이 스키마가 지켜야 할 것은 두 가지다.
 *
 *   1. 서버 Push 1 이 아직 없어 **목록 래퍼 키가 미확정**이다. 배열이든 이름 붙은 래퍼든
 *      같은 배열로 풀려야 화면이 서버 확정 전에 착수할 수 있다.
 *   2. 모양이 어긋난 응답을 **빈 목록으로 흘리지 않는다.** 화이트리스트가 비어 보이면
 *      운영은 "등록된 게 없다"로 읽고 이미 있는 항목을 다시 등록한다.
 */

const row = {
  id: 1,
  serviceName: 'FreeSeminarVodHub',
  allowedRedirectUri: 'https://vod.letscareer.co.kr/auth/callback',
  isActive: true,
  createDate: '2026-08-01T10:00:00',
};

describe('ssoRedirectWhitelistSchema', () => {
  it('서버 DTO 필드를 그대로 통과시킨다', () => {
    expect(ssoRedirectWhitelistSchema.parse(row)).toEqual(row);
  });

  it('생성 시각이 없어도 행은 성립한다', () => {
    // 목록 정렬·표시용 부가 정보다. 이것 때문에 행 전체가 사라지면 손해가 더 크다.
    const { createDate: _createDate, ...withoutCreateDate } = row;

    expect(ssoRedirectWhitelistSchema.parse(withoutCreateDate)).toEqual(
      withoutCreateDate,
    );
    expect(
      ssoRedirectWhitelistSchema.parse({ ...row, createDate: null }).createDate,
    ).toBeNull();
  });

  it('허용 URL 이 빠지면 실패한다', () => {
    // URI 없는 화이트리스트 행은 운영이 판단할 근거가 없다. 조용히 그리면 계약 불일치를 감춘다.
    const { allowedRedirectUri: _uri, ...withoutUri } = row;

    expect(() => ssoRedirectWhitelistSchema.parse(withoutUri)).toThrow();
  });

  it('활성화 여부가 문자열로 오면 실패한다', () => {
    // `"false"` 는 자바스크립트에서 참이다. 통과시키면 꺼 둔 항목이 켜진 것으로 보인다.
    expect(() =>
      ssoRedirectWhitelistSchema.parse({ ...row, isActive: 'false' }),
    ).toThrow();
  });
});

describe('ssoRedirectWhitelistListSchema', () => {
  it('배열 응답을 그대로 읽는다', () => {
    expect(ssoRedirectWhitelistListSchema.parse([row])).toEqual([row]);
  });

  it('이름 붙은 래퍼로 와도 같은 배열로 푼다', () => {
    // 서버가 `GetFaqResponseDto` 처럼 래퍼 DTO 를 둘 수 있다. 키 이름은 아직 모른다.
    expect(
      ssoRedirectWhitelistListSchema.parse({
        ssoRedirectWhitelistList: [row],
      }),
    ).toEqual([row]);
  });

  it('빈 목록도 정상 응답이다', () => {
    expect(ssoRedirectWhitelistListSchema.parse([])).toEqual([]);
    expect(ssoRedirectWhitelistListSchema.parse({ whitelists: [] })).toEqual(
      [],
    );
  });

  it('배열이 아닌 응답은 빈 목록으로 접지 않고 실패한다', () => {
    expect(() => ssoRedirectWhitelistListSchema.parse(null)).toThrow();
    expect(() =>
      ssoRedirectWhitelistListSchema.parse({ message: '조회 실패' }),
    ).toThrow();
  });

  it('행 하나라도 모양이 어긋나면 실패한다', () => {
    expect(() =>
      ssoRedirectWhitelistListSchema.parse([row, { ...row, id: '2' }]),
    ).toThrow();
  });
});
