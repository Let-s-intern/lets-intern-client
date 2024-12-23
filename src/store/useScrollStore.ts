import { create } from 'zustand';

interface ScrollStore {
  scrollDirection: 'UP' | 'DOWN' | null;
  setScrollDirection: (direction: 'UP' | 'DOWN' | null) => void;
}

const useScrollStore = create<ScrollStore>((set) => ({
  scrollDirection: null,
  setScrollDirection: (direction) => set({ scrollDirection: direction }),
}));

export default useScrollStore;
