/**
 * LiveCTAButtons - getIsAlreadyApplied 우선순위 검증.
 *
 * Push 5(웹 라이브 상세 단건 API 전환) — /live/{id}/history 응답이
 * 신청 여부의 단일 진실 소스가 되도록 변경. 본 테스트는 history 응답
 * 유무에 따른 isAlreadyApplied 결정 로직을 단위로 고정한다.
 */
import { getIsAlreadyApplied } from '../getIsAlreadyApplied';

describe('getIsAlreadyApplied', () => {
  it('history.applied 가 true 면 true', () => {
    expect(getIsAlreadyApplied({ applied: true }, { applied: false })).toBe(
      true,
    );
  });

  it('history.applied 가 false 면 false (application 무시)', () => {
    expect(getIsAlreadyApplied({ applied: false }, { applied: true })).toBe(
      false,
    );
  });

  it('history 가 undefined 면 application.applied 폴백', () => {
    expect(getIsAlreadyApplied(undefined, { applied: true })).toBe(true);
    expect(getIsAlreadyApplied(undefined, { applied: false })).toBe(false);
  });

  it('history 가 null 이면 application.applied 폴백', () => {
    expect(getIsAlreadyApplied(null, { applied: true })).toBe(true);
  });

  it('history.applied 가 null/undefined 면 application 폴백', () => {
    expect(getIsAlreadyApplied({ applied: null }, { applied: true })).toBe(
      true,
    );
    expect(getIsAlreadyApplied({ applied: undefined }, { applied: true })).toBe(
      true,
    );
  });

  it('둘 다 없으면 false', () => {
    expect(getIsAlreadyApplied(undefined, undefined)).toBe(false);
    expect(getIsAlreadyApplied(null, null)).toBe(false);
  });
});
