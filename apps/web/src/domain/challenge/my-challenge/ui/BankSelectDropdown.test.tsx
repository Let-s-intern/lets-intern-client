import { banks } from './BankSelectDropdown';

/**
 * 서버 `AccountType` enum 이 받는 값 전부.
 * 출처: `lets-career-server` / `src/main/java/org/letscareer/letscareer/domain/user/type/AccountType.java`
 *
 * 이 배열은 손으로 옮긴 사본이다. 서버 enum 이 바뀌면 여기도 같이 고쳐야 한다.
 * 그럼에도 두는 이유 — 드롭다운에만 있는 값을 보내면 서버가 400 이 아니라
 * 500 "서버 내부 오류입니다." 를 돌려주고, 참여자는 원인을 알 수 없다.
 * 2026-09-07 에 케이뱅크(`KBANK`)·SC제일은행(`SC`)이 그렇게 새어나가
 * 블로그 보너스 제출이 100% 실패했다(LC-3285).
 */
const SERVER_ACCOUNT_TYPES: readonly string[] = [
  'KB',
  'HANA',
  'WOORI',
  'SHINHAN',
  'NH',
  'SH',
  'IBK',
  'MG',
  'KAKAO',
  'TOSS',
];

describe('BankSelectDropdown 의 은행 코드', () => {
  it('모든 값이 서버 AccountType enum 에 있다', () => {
    const unknown = Object.entries(banks)
      .filter(([, code]) => !SERVER_ACCOUNT_TYPES.includes(code))
      .map(([label, code]) => `${label}(${code})`);

    expect(unknown).toEqual([]);
  });

  it('코드가 중복되지 않는다', () => {
    const codes = Object.values(banks);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('제거한 케이뱅크·SC제일은행이 다시 들어오지 않는다', () => {
    const codes = Object.values(banks);
    expect(codes).not.toContain('KBANK');
    expect(codes).not.toContain('SC');
  });
});
