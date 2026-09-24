// 하반기 멤버십 하드코딩 데이터 (어드민/API 연동 없음).
// 세부 수치(마감일·좌석)는 이 파일에서 직접 조정한다.
// 결제 금액·플랜은 어드민 챌린지 가격 플랜이 결정하므로 여기서 관리하지 않는다.

// 아래 4개는 연동 챌린지(NEXT_PUBLIC_MEMBERSHIP_CHALLENGE_ID)를 못 읽었을 때만 쓰이는
// 폴백이다. 값은 시안 기준 — 9~11월 이용, 11월 30일 종료.
export const MEMBERSHIP_BEGINNING = new Date('2026-08-18T00:00:00+09:00');
export const MEMBERSHIP_DEADLINE = new Date('2026-08-25T23:59:59+09:00');
export const MEMBERSHIP_START_DATE = new Date('2026-09-01T00:00:00+09:00');
export const MEMBERSHIP_END_DATE = new Date('2026-11-30T23:59:59+09:00');
export const MEMBERSHIP_SEATS_TOTAL = 100;
export const MEMBERSHIP_SEATS_TAKEN = 63;

// FAQ 데이터는 src/data/faq.ts 로 이동했다.

/** 1,000 단위 콤마 (예: 79000 -> "79,000") */
export function formatKRW(value: number): string {
  return value.toLocaleString('ko-KR');
}
