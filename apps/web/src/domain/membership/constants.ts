// env: NEXT_PUBLIC_MEMBERSHIP_CHALLENGE_ID (챌린지 하나에 BASIC/STANDARD/PREMIUM 플랜 포함)
export const MEMBERSHIP_CHALLENGE_ID = Number(
  process.env.NEXT_PUBLIC_MEMBERSHIP_CHALLENGE_ID ?? 0,
);

export const MEMBERSHIP_PLANS = {
  BASIC: {
    price: 79000,
    originalPrice: 99000,
    label: '베이직',
    discount: '런칭 20% OFF',
    pricePlan: 'BASIC' as const,
  },
  STANDARD: {
    price: 149000,
    originalPrice: 198000,
    label: '스탠다드',
    discount: '런칭 25% OFF',
    pricePlan: 'STANDARD' as const,
  },
  PREMIUM: {
    price: 299000,
    originalPrice: 360000,
    label: '프리미엄',
    discount: '런칭 17% OFF',
    pricePlan: 'PREMIUM' as const,
  },
} as const;

export type MembershipPlanKey = keyof typeof MEMBERSHIP_PLANS;

export const MEMBERSHIP_DEADLINE = new Date('2026-06-30T23:59:59+09:00');
export const MEMBERSHIP_SEATS_TOTAL = 100;
export const MEMBERSHIP_SEATS_TAKEN = 63;
