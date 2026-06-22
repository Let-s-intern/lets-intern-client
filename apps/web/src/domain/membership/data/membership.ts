// 하반기 멤버십 하드코딩 데이터 (어드민/API 연동 없음).
// 세부 수치(가격·마감일·좌석)는 분리 이후 이 파일에서 직접 조정한다.
// 외부 링크(토스·오픈채팅)는 links.ts 단일 출처에서 가져온다.

import { TOSS_LINKS } from "./links";

export const MEMBERSHIP_PLANS = {
  BASIC: {
    label: "베이직",
    price: 79000,
    originalPrice: 99000,
    discount: "런칭 20% OFF",
    toss: TOSS_LINKS.BASIC,
  },
  STANDARD: {
    label: "스탠다드",
    price: 149000,
    originalPrice: 198000,
    discount: "런칭 25% OFF",
    toss: TOSS_LINKS.STANDARD,
  },
  PREMIUM: {
    label: "프리미엄",
    price: 299000,
    originalPrice: 360000,
    discount: "런칭 17% OFF",
    toss: TOSS_LINKS.PREMIUM,
  },
} as const;

export type MembershipPlanKey = keyof typeof MEMBERSHIP_PLANS;

export const MEMBERSHIP_BEGINNING = new Date("2026-06-15T00:00:00+09:00");
export const MEMBERSHIP_DEADLINE = new Date("2026-06-30T23:59:59+09:00");
export const MEMBERSHIP_START_DATE = new Date("2026-07-01T00:00:00+09:00");
export const MEMBERSHIP_END_DATE = new Date("2026-09-30T23:59:59+09:00");
export const MEMBERSHIP_SEATS_TOTAL = 100;
export const MEMBERSHIP_SEATS_TAKEN = 63;

// FAQ 데이터는 src/data/faq.ts 로 이동했다.

/** 1,000 단위 콤마 (예: 79000 -> "79,000") */
export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR");
}
