// 올인원패스 결제 플로우 전용 상태 (구매·연장 공용)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MembershipOrderType = 'PURCHASE' | 'EXTENSION';

export interface MembershipOrderData {
  orderType: MembershipOrderType;
  membershipId: number | null;
  membershipPlanId: number | null;
  applicationId: number | null;
  membershipOptionId: number | null;
  passTitle: string | null;
  thumbnail: string | null;
  price: number | null;
  discount: number | null;
  couponCode: string | null;
  couponPrice: number | null;
  totalPrice: number | null;
  contactEmail: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  orderId: string | null;
  isFree: boolean | null;
  beginning: string | null;
  deadline: string | null;
}

interface MembershipOrderStore {
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  data: MembershipOrderData;
  setOrder: (params: Partial<MembershipOrderData>) => void;
  initOrder: () => void;
  checkInvalidate: () => boolean;
}

const EMPTY: MembershipOrderData = {
  orderType: 'PURCHASE',
  membershipId: null,
  membershipPlanId: null,
  applicationId: null,
  membershipOptionId: null,
  passTitle: null,
  thumbnail: null,
  price: null,
  discount: null,
  couponCode: null,
  couponPrice: 0,
  totalPrice: null,
  contactEmail: null,
  email: null,
  name: null,
  phone: null,
  orderId: null,
  isFree: null,
  beginning: null,
  deadline: null,
};

const COMMON_REQUIRED: (keyof MembershipOrderData)[] = [
  'membershipId',
  'passTitle',
  'price',
  'discount',
  'totalPrice',
  'contactEmail',
  'email',
  'name',
  'phone',
  'orderId',
  'isFree',
];

const useMembershipOrderStore = create(
  persist<MembershipOrderStore>(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      data: EMPTY,
      setOrder: (params) => set({ data: { ...get().data, ...params } }),
      initOrder: () => set({ data: EMPTY }),
      checkInvalidate: () => {
        const d = get().data;
        if (COMMON_REQUIRED.some((k) => d[k] === null)) return true;
        return d.orderType === 'EXTENSION'
          ? d.applicationId === null || d.membershipOptionId === null
          : d.membershipPlanId === null;
      },
    }),
    {
      name: 'membershipOrderForm',
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

export default useMembershipOrderStore;
