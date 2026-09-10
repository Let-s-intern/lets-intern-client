// 마케팅 취준 올인원 패스 하드코딩 데이터 (어드민/API 연동 없음).
// 결제 금액·플랜은 어드민 챌린지 가격 플랜이 결정하므로 여기서 관리하지 않는다.

// 아래 4개는 연동 챌린지(NEXT_PUBLIC_MEMBERSHIP_CHALLENGE_ID)를 못 읽었을 때만 쓰이는
// 폴백이다. 어드민 값이 있으면 그쪽이 이긴다
// (`lib/useMembershipChallengeData.ts` 의 `toDate(data?.x) ?? 상수`).
//
// 종료일은 운영 챌린지(405)의 `endDate` 와 같은 11/30 이다. 시안에는 11/28 로 적혀
// 있었는데 어드민 값이 11/30 이라, 챌린지를 못 읽었을 때만 날짜가 이틀 당겨지는
// 상태였다. 폴백이 실제와 다르면 조회가 느린 순간에만 잠깐 다른 날짜가 보인다.
//
// 시안 8 의 플레이북 매트릭스는 마지막 주차를 11.29 로 적는다. 그 표는
// `coursePlan.ts` 의 정적 문자열이라 이 값을 따라오지 않는다 — 종료일을 앞당기면
// 표의 마지막 주차가 이용 기간 밖으로 나가므로 그때는 함께 고쳐야 한다.
export const MEMBERSHIP_BEGINNING = new Date('2026-09-10T00:00:00+09:00');
export const MEMBERSHIP_DEADLINE = new Date('2026-09-20T23:59:59+09:00');
export const MEMBERSHIP_START_DATE = new Date('2026-09-21T00:00:00+09:00');
export const MEMBERSHIP_END_DATE = new Date('2026-11-30T23:59:59+09:00');
export const MEMBERSHIP_SEATS_TOTAL = 100;
export const MEMBERSHIP_SEATS_TAKEN = 63;

// FAQ 데이터는 src/data/faq.ts 로 이동했다.

/** 1,000 단위 콤마 (예: 79000 -> "79,000") */
export function formatKRW(value: number): string {
  return value.toLocaleString('ko-KR');
}
