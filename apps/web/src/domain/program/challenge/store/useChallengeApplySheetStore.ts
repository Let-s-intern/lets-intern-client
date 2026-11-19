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
  setPlan: (plan: ChallengePricePlan | null) => void;
  /** '템플릿으로 혼자' 선택 여부. 가격·하단 바·상세 본문이 가이드북으로 바뀐다 (LC-3631) */
  isTemplateMode: boolean;
  setTemplateMode: (isTemplateMode: boolean) => void;
  /**
   * 참여 대상·시작일을 바꿔 다음 페이지로 갈 때 맨 위로 올리지 않도록 표시한다.
   * 다음 페이지의 ChallengeScrollToTop 이 한 번 읽고 지운다 (LC-3632)
   */
  keepScroll: boolean;
  keepScrollOnNextPage: () => void;
}

export const useChallengeApplySheetStore = create<ChallengeApplySheetState>(
  (set) => ({
    isOpen: false,
    plan: null,
    open: (plan) =>
      set((state) => ({ isOpen: true, plan: plan ?? state.plan })),
    close: () => set({ isOpen: false }),
    setPlan: (plan) => set({ plan }),
    isTemplateMode: false,
    setTemplateMode: (isTemplateMode) => set({ isTemplateMode }),
    keepScroll: false,
    keepScrollOnNextPage: () => set({ keepScroll: true }),
  }),
);
