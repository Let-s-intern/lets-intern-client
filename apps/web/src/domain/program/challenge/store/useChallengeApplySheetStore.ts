import { ChallengePricePlan } from '@/schema';
import { create } from 'zustand';

/**
 * 챌린지 상세의 결제 플랜 바텀시트 열림 상태.
 * 상단 가격 카드와 하단 고정 CTA 가 같은 시트를 연다.
 * plan 은 상단에서 고른 플랜으로, 시트가 그 플랜을 선택한 채 열리고
 * 하단 고정 바도 이 플랜의 금액을 보인다.
 */
interface ChallengeApplySheetState {
  isOpen: boolean;
  plan: ChallengePricePlan | null;
  open: (plan?: ChallengePricePlan | null) => void;
  close: () => void;
  setPlan: (plan: ChallengePricePlan) => void;
}

export const useChallengeApplySheetStore = create<ChallengeApplySheetState>(
  (set) => ({
    isOpen: false,
    plan: null,
    open: (plan) =>
      set((state) => ({ isOpen: true, plan: plan ?? state.plan })),
    close: () => set({ isOpen: false }),
    setPlan: (plan) => set({ plan }),
  }),
);
