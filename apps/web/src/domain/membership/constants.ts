export const MEMBERSHIP_PLANS = {
  BASIC: {
    programId: 0,
    price: 79000,
    originalPrice: 99000,
    label: '베이직',
    discount: '런칭 20% OFF',
  },
  STANDARD: {
    programId: 0,
    price: 149000,
    originalPrice: 198000,
    label: '스탠다드',
    discount: '런칭 25% OFF',
  },
  PREMIUM: {
    programId: 0,
    price: 299000,
    originalPrice: 360000,
    label: '프리미엄',
    discount: '런칭 17% OFF',
  },
} as const;
// TODO(MVP): BE에서 programId 받으면 위 0값 교체

export type MembershipPlanKey = keyof typeof MEMBERSHIP_PLANS;

export const MEMBERSHIP_DEADLINE = new Date('2026-06-30T23:59:59+09:00');
export const MEMBERSHIP_SEATS_TOTAL = 100;
export const MEMBERSHIP_SEATS_TAKEN = 63; // TODO(MVP): 실시간 API로 교체 가능
