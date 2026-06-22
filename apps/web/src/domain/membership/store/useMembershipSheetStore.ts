import { create } from 'zustand';

// 멤버십 결제 시트 열림 상태 공유 store.
// 시트가 열리면 하단 ApplyBar 와 겹치므로 ApplyBar 가 이를 구독해 숨긴다.
interface MembershipSheetStore {
  isSheetOpen: boolean;
  setSheetOpen: (v: boolean) => void;
}

const useMembershipSheetStore = create<MembershipSheetStore>((set) => ({
  isSheetOpen: false,
  setSheetOpen: (v) => set({ isSheetOpen: v }),
}));

export default useMembershipSheetStore;
